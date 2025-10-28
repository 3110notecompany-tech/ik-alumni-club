"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, X, Upload } from "lucide-react";
import { useRef } from "react";

type Props = {
  /**
   * ファイルの値（URL）
   */
  value: string | null | undefined;
  /**
   * ファイルが変更された時のコールバック関数
   */
  onChange: (value: string) => void;
  /**
   * 受け入れるファイルタイプ
   * デフォルトはPDF
   */
  accept?: string;
  /**
   * 入力ファイルの最大サイズ
   * デフォルトは10MB
   */
  maxSize?: number;
  /**
   * プレースホルダーテキスト
   */
  placeholder?: string;
};

export function InputFile({
  value = "",
  onChange,
  accept = "application/pdf",
  maxSize = 1024 * 1024 * 10, // 10MB
  placeholder = "ファイルを選択してください",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック
    if (file.size > maxSize) {
      alert(`ファイルサイズは${maxSize / (1024 * 1024)}MB以下にしてください`);
      return;
    }

    // ファイルをBase64に変換
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.onerror = () => {
      alert("ファイルの読み込みに失敗しました");
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileName = (url: string) => {
    if (url.startsWith("data:")) {
      return "選択されたファイル";
    }
    return url.split("/").pop() || "ファイル";
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none ring-offset-background"
        )}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {!value ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Upload className="size-5" />
            <span>{placeholder}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <span className="flex-1 truncate text-sm">{getFileName(value)}</span>
          </div>
        )}
      </div>

      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRemove}
          className="w-full"
        >
          <X size={16} className="mr-1" />
          ファイルを削除
        </Button>
      )}
    </div>
  );
}
