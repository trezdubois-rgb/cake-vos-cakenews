import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeartAnimationProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const HeartAnimation = ({ x, y, onComplete }: HeartAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 800); // Animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed pointer-events-none z-50 text-red-500 drop-shadow-lg",
        "animate-in zoom-in-50 fade-out-0 duration-700 ease-out"
      )}
      style={{
        left: x - 40, // Center the 80px heart
        top: y - 40,
      }}
    >
      <Heart className="w-20 h-20 fill-current" />
    </div>
  );
};
