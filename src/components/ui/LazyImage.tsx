import React from 'react';
import { useLazyImage } from '@/hooks/usePerformance';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  rootMargin?: string;
  [key: string]: any; // Pour permettre d'autres propriétés
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.svg',
  fallback,
  rootMargin,
  ...props 
}) => {
  const { imageSrc, loaded, error, imgRef } = useLazyImage(src, rootMargin);

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      <img
        src={imageSrc || placeholder}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
      {error && fallback && (
        <img
          src={fallback}
          alt={`Fallback for ${alt}`}
          className="w-full h-full object-cover"
          {...props}
        />
      )}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;