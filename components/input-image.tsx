"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useDropzone } from "react-dropzone";

type Props = {
  testid?: string;
  /**
   * プレビュー領域の横幅
   */
  width?: string | number;
  /**
   * 画像のアスペクト比
   * */
  aspectRatio?: number;
  /**
   * クロップ後の横幅
   * */
  resultWidth: number;
  /**
   * 画像の値
   */
  value: string | null | undefined;
  /**
   * 画像が変更された時のコールバック関数
   */
  onChange: (value: string) => void;
  /**
   * 入力画像の最大サイズ
   * デフォルトは4MB
   */
  maxSize?: number;
};

export function InputImage({
  width = "100%",
  aspectRatio = 1,
  maxSize = 1024 * 1024 * 4, // 4MB
  resultWidth,
  value = "",
  onChange,
}: Props) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState(false);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    maxSize,
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    useFsAccessApi: false,
    onDropAccepted: (dropped) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setOpen(true);
      };
      reader.readAsDataURL(dropped[0]);
    },
  });

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const cropImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      resultWidth,
      resultWidth / aspectRatio
    );
    setOpen(false);
    onChange(croppedImage);
  };

  return (
    <div>
      <div className="relative w-fit">
        <div
          className={cn(
            "border overflow-hidden cursor-pointer rounded-md grid place-content-center relative",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none ring-offset-background",
            isDragAccept ? "bg-primary scale-150" : "bg-muted",
          )}
          style={{
            aspectRatio,
            width,
          }}
          {...getRootProps()}
        >
          {!value && (
            <ImagePlus className="size-8 text-muted-foreground opacity-30" />
          )}
          {value && (
            <Image
              unoptimized
              className="object-cover"
              fill
              src={value}
              alt=""
            />
          )}
          <input {...getInputProps()} />
          <span className="sr-only">画像を選択</span>
        </div>

        {value && (
          <Button
            type="button"
            variant="outline"
            className="absolute top-2 right-2 size-8 text-muted-foreground"
            size="icon"
            onClick={() => {
              onChange("");
            }}
          >
            <X size={20} />
            <span className="sr-only">イメージを削除</span>
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={(status) => setOpen(status)}>
        <DialogTitle className="sr-only">イメージを切り抜く</DialogTitle>
        <DialogContent className="max-w-md">
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              aspectRatio,
              height: 300,
            }}
          >
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="my-4">
            <Slider
              max={3}
              step={0.01}
              min={1}
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline">閉じる</Button>
            </DialogClose>
            <Button autoFocus onClick={cropImage}>
              切り取る
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number,
  outputHeight: number
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return canvas.toDataURL("image/jpeg");
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}
