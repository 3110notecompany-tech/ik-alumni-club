"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import content1 from "@/app/[locale]/(main)/supporters/photo/content1.jpg";
import content2 from "@/app/[locale]/(main)/supporters/photo/content2.jpg";
import content3 from "@/app/[locale]/(main)/supporters/photo/content3.jpg";

const images = [
  { src: content1, alt: "サポーターズクラブ画像1" },
  { src: content2, alt: "サポーターズクラブ画像2" },
  { src: content3, alt: "サポーターズクラブ画像3" },
];

export function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(images.length); // 中央セットから開始
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3セット複製（前、中央、後ろ）
  const extendedImages = [...images, ...images, ...images];

  useEffect(() => {
    // 自動スクロール
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 無限ループ：最後のセットに到達したらトランジションなしで中央セットにリセット
    if (currentIndex >= images.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(images.length);
        // 次のフレームでトランジションを再度有効化
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
    // 最初のセットに到達したらトランジションなしで中央セットにリセット
    if (currentIndex < images.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(images.length);
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // 各画像の幅を計算（サイズが変わるため動的に計算）
  const getImageWidth = (index: number) => {
    const distanceFromCenter = Math.abs(index - currentIndex);
    return distanceFromCenter === 0 ? 50 : 35;
  };

  // 中央に配置するためのtransform計算
  const getTransform = () => {
    let offset = 0;
    for (let i = 0; i < currentIndex; i++) {
      offset += getImageWidth(i);
      offset += 0.5; // gap-2
    }
    offset += getImageWidth(currentIndex) / 2;
    return `calc(-${offset}vw + 50vw)`;
  };

  return (
    <div className="w-full overflow-hidden mb-16 md:mb-32 h-[calc(50vw*9/16)] md:h-[calc(50vw*9/16)]">
      <div className="flex justify-center items-center h-full">
        <div className="overflow-hidden w-full h-full">
          <div
            ref={containerRef}
            className="flex items-center gap-2"
            style={{
              transform: `translateX(${getTransform()})`,
              transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
            }}
          >
            {extendedImages.map((image, index) => {
              const distanceFromCenter = Math.abs(index - currentIndex);
              const isCenterSlide = distanceFromCenter === 0;

              return (
                <div
                  key={`${index}-${image.alt}`}
                  className="flex-shrink-0"
                  style={{
                    width: isCenterSlide ? "50vw" : "35vw",
                    opacity: isCenterSlide ? 1 : 0.7,
                    transition: isTransitioning ? "all 500ms ease-in-out" : "none",
                  }}
                >
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 35vw"
                      priority={index <= 4}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
