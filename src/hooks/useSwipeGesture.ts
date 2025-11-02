import { useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  angleThreshold?: number;
  edgeProtection?: number;
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  angleThreshold = 30,
  edgeProtection = 20,
}: SwipeGestureOptions) => {
  const touchDataRef = useRef<TouchData | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;

      // Ignore touches near edges for native gesture support
      const screenWidth = window.innerWidth;
      if (startX < edgeProtection || startX > screenWidth - edgeProtection) {
        return;
      }

      touchDataRef.current = {
        startX,
        startY,
        startTime: Date.now(),
      };
    },
    [edgeProtection]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchDataRef.current) return;

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const { startX, startY, startTime } = touchDataRef.current;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = Date.now() - startTime;

      // Calculate swipe distance and angle
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = (Math.atan2(Math.abs(deltaY), Math.abs(deltaX)) * 180) / Math.PI;

      // Check if it's a valid horizontal swipe
      const isHorizontalSwipe = angle < angleThreshold;
      const isValidDistance = distance > threshold;
      const isValidVelocity = distance / deltaTime > 0.1; // minimum velocity

      if (isHorizontalSwipe && (isValidDistance ?? isValidVelocity)) {
        if (deltaX > 0) {
          // Swipe right (go to previous)
          onSwipeRight?.();
        } else {
          // Swipe left (go to next)
          onSwipeLeft?.();
        }
      }

      touchDataRef.current = null;
    },
    [onSwipeLeft, onSwipeRight, threshold, angleThreshold]
  );

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };

  return { swipeHandlers };
};
