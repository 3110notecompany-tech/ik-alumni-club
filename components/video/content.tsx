"use client";

import { ContentsHeader } from "../contents/contents-header";
import { VideoCard } from "./card";
import { Carousel } from "./carousel";
import { CarouselIndicator } from "./carousel-indicator";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function VideoContents() {
  const t = useTranslations("Contents");

  const items = [
    {
      videoUrl: "https://www.youtube.com/watch?v=FYFUKvqxgWk",
      title: "柏まつり",
    },
    {
      videoUrl: "https://www.youtube.com/watch?v=rZxr5D0wHaM",
      title: "自己紹介",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col">
      <ContentsHeader title={t("video")} />
      <Carousel onPrevious={handlePrevious} onNext={handleNext}>
        <VideoCard
          videoUrl={items[currentIndex].videoUrl}
          title={items[currentIndex].title}
        />
      </Carousel>
      <CarouselIndicator
        totalItems={items.length}
        currentIndex={currentIndex}
        maxDots={3}
        onDotClick={setCurrentIndex}
      />
    </div>
  );
}
