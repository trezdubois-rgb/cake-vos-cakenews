import { useState, useEffect, useRef, useCallback } from "react";
import { FeedItem } from "./FeedItem";
import { FeedItem as FeedItemType, mockFeedItems } from "@/data/mockData";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

interface FeedContainerProps {
  items?: FeedItemType[];
  personalFilter?: boolean;
}

export const FeedContainer = ({ items = mockFeedItems, personalFilter = false }: FeedContainerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedItems, setPreloadedItems] = useState<FeedItemType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload initial batch of 15 items
  useEffect(() => {
    const initialBatch = items.slice(0, Math.min(15, items.length));
    setPreloadedItems(initialBatch);
  }, [items]);

  // Preload next batch when reaching 80% (index >= 12)
  useEffect(() => {
    if (currentIndex >= Math.floor(preloadedItems.length * 0.8)) {
      const nextBatch = items.slice(preloadedItems.length, preloadedItems.length + 15);
      if (nextBatch.length > 0) {
        setPreloadedItems(prev => [...prev, ...nextBatch]);
      }
    }
  }, [currentIndex, preloadedItems.length, items]);

  const goToNext = useCallback(() => {
    if (currentIndex < preloadedItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, preloadedItems.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const { swipeHandlers } = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    threshold: 50,
    angleThreshold: 30,
    edgeProtection: 20
  });

  const currentItem = preloadedItems[currentIndex];

  if (!currentItem) {
    return (
      <div className="feed-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du flux...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="feed-container"
      {...swipeHandlers}
    >
      {/* Progress indicator */}
      <div className="absolute top-safe-area left-4 right-4 z-10">
        <div className="flex gap-1">
          {preloadedItems.slice(0, 5).map((_, idx) => (
            <div
              key={idx}
              className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current item */}
      <FeedItem
        item={currentItem}
        isActive={true}
        onNext={goToNext}
        onPrev={goToPrev}
        totalItems={preloadedItems.length}
        currentIndex={currentIndex}
      />

      {/* Navigation hints */}
      <div className="absolute bottom-24 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
        {currentIndex > 0 && (
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white/80 text-sm">← Précédent</span>
          </div>
        )}
        <div className="flex-1" />
        {currentIndex < preloadedItems.length - 1 && (
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white/80 text-sm">Suivant →</span>
          </div>
        )}
      </div>
    </div>
  );
};