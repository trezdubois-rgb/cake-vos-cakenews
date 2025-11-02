/**
 * Image optimization utilities
 * Provides responsive image srcSet generation and lazy loading helpers
 */

export interface ImageSrcSet {
  srcSet: string;
  sizes: string;
}

/**
 * Generate responsive srcSet for an image URL
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [400, 800, 1200, 1600]
): ImageSrcSet {
  // If URL already has query params, append; otherwise add
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  const srcSet = widths
    .map((width) => `${baseUrl}${separator}w=${width} ${width}w`)
    .join(', ');

  // Responsive sizes based on viewport
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 800px, 1200px';

  return { srcSet, sizes };
}

/**
 * Generate optimized image props
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: {
    widths?: number[];
    priority?: boolean;
    aspectRatio?: string;
  } = {}
): React.ImgHTMLAttributes<HTMLImageElement> {
  const { widths, priority = false, aspectRatio } = options;
  const { srcSet, sizes } = generateSrcSet(src, widths);

  return {
    src,
    alt,
    srcSet,
    sizes,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    style: aspectRatio ? { aspectRatio } : undefined,
  };
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

