import { useState, useEffect, useRef } from 'react';

// Hook pour charger les images de manière paresseuse (lazy loading)
export const useLazyImage = (src: string, rootMargin: string = '50px') => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoaded(true);
      setError(false);
    };
    
    img.onerror = () => {
      setError(true);
    };
    
    img.src = src;
  }, [src]);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loaded) {
          setImageSrc(src);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, loaded, rootMargin]);

  return { imageSrc, loaded, error, imgRef };
};

// Hook pour gérer le chargement paresseux des composants
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        const module = await importFn();
        if (isMounted) {
          setComponent(() => module.default);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [importFn]);

  return { Component, loading, error, fallback };
};

// Hook pour gérer le défilement en douceur
export const useSmoothScroll = () => {
  const scrollToElement = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return { scrollToElement };
};

// Hook pour gérer le throttling
export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

// Hook pour gérer le debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Hook pour gérer l'optimisation des requêtes
export const useOptimizedQuery = <T,>(
  queryFn: () => Promise<T>,
  deps: React.DependencyList,
  options?: {
    staleTime?: number;
    cacheTime?: number;
    enabled?: boolean;
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const queryKey = JSON.stringify(deps);

  const defaultOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
    ...options,
  };

  useEffect(() => {
    if (!defaultOptions.enabled) {
      setLoading(false);
      return;
    }

    const cached = cache.current.get(queryKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < defaultOptions.staleTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    queryFn()
      .then((result) => {
        setData(result);
        cache.current.set(queryKey, { data: result, timestamp: now });
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, deps);

  const invalidate = () => {
    cache.current.delete(queryKey);
  };

  return { data, loading, error, invalidate };
};