import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Hook for infinite scroll pagination
 */
export function useInfiniteScroll<T>(
  callback: () => Promise<T[]>,
  options: UseInfiniteScrollOptions = {}
): {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
} {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await callback();
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && enabled && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold, rootMargin }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [enabled, hasMore, loading, threshold, rootMargin]);

  const reset = () => {
    setItems([]);
    setHasMore(true);
    setLoading(false);
  };

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset,
  };
}

