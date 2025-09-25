
import { useState, useEffect, RefObject } from 'react';

type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null;

export const useSwipe = (ref: RefObject<HTMLElement>) => {
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [touchStart, setTouchStart] = useState<[number, number] | null>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart([e.targetTouches[0].clientX, e.targetTouches[0].clientY]);
      setSwipeDirection(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart) return;

      const currentX = e.targetTouches[0].clientX;
      const currentY = e.targetTouches[0].clientY;
      const diffX = touchStart[0] - currentX;
      const diffY = touchStart[1] - currentY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > 30) {
          setSwipeDirection(diffX > 0 ? 'left' : 'right');
          setTouchStart(null);
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > 30) {
          setSwipeDirection(diffY > 0 ? 'up' : 'down');
          setTouchStart(null);
        }
      }
    };
    
    const handleTouchEnd = () => {
        setTouchStart(null);
        // Reset direction after a short delay
        setTimeout(() => setSwipeDirection(null), 100);
    };

    target.addEventListener('touchstart', handleTouchStart);
    target.addEventListener('touchmove', handleTouchMove);
    target.addEventListener('touchend', handleTouchEnd);

    return () => {
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchmove', handleTouchMove);
      target.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, touchStart]);

  return swipeDirection;
};
