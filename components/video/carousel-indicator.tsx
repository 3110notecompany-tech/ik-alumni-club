interface CarouselIndicatorProps {
  totalItems: number;
  currentIndex: number;
  maxDots?: number;
  onDotClick: (index: number) => void;
}

export function CarouselIndicator({
  totalItems,
  currentIndex,
  maxDots = 3,
  onDotClick,
}: CarouselIndicatorProps) {
  const displayCount = Math.min(totalItems, maxDots);

  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: displayCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 rounded-full transition-colors ${
            currentIndex === index ? "bg-black" : "bg-gray-300"
          }`}
          aria-label={`${index + 1}番目の項目に移動`}
        />
      ))}
    </div>
  );
}
