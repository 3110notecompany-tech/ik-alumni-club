"use client";

import { ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  onPrevious: () => void;
  onNext: () => void;
}

export function Carousel({ children, onPrevious, onNext }: CarouselProps) {
  return (
    <div className="flex items-center justify-center gap-[30px] mt-[30px]">
      <button
        onClick={onPrevious}
        className="text-4xl hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="前へ"
      >
        ←
      </button>
      <div className="flex flex-col items-center flex-1 max-w-full">{children}</div>
      <button
        onClick={onNext}
        className="text-4xl hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="次へ"
      >
        →
      </button>
    </div>
  );
}
