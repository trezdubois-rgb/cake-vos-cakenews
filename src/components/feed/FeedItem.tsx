import { useState, useEffect, useRef } from "react";
import { Heart, Bookmark, Share2, Flag, MessageCircle, Play, Pause } from "lucide-react";
import { FeedItem as FeedItemType, getUserInteraction } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FeedItemProps {
  item: FeedItemType;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  totalItems: number;
  currentIndex: number;
}

export const FeedItem = ({ item, isActive }: FeedItemProps) => {
  const [interaction, setInteraction] = useState(getUserInteraction(item.id));
  const [timeSpent, setTimeSpent] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(0);

  // Track time spent on item
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      
      // Mark as seen after 1 second
      const seenTimer = setTimeout(() => {
        setInteraction(prev => ({ ...prev, seen: true, lastSeenAt: new Date().toISOString() }));
      }, 1000);

      return () => {
        clearTimeout(seenTimer);
        const spent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeSpent(spent);
        setInteraction(prev => ({ ...prev, timeSpentSec: prev.timeSpentSec + spent }));
      };
    }
  }, [isActive]);

  // Handle video autoplay
  useEffect(() => {
    if (item.type === 'video' && videoRef.current && isActive) {
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        // Autoplay failed, user needs to interact
        setIsVideoPlaying(false);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, [isActive, item.type]);

  const toggleLike = () => {
    setInteraction(prev => ({ ...prev, liked: !prev.liked }));
  };

  const toggleFavorite = () => {
    setInteraction(prev => ({ ...prev, favorited: !prev.favorited }));
  };

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${item.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.excerpt,
          url: url,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy to clipboard
      await navigator.clipboard.writeText(url);
      // Could show a toast here
    }
  };

  return (
    <div className={cn(
      "feed-item bg-background",
      interaction.seen && "seen-indicator"
    )}>
      {/* Hero Section */}
      <div className="hero-container">
        {item.type === 'video' && item.videoHls ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={item.heroSrc}
              muted
              loop
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            >
              <source src={item.videoHls} type="video/mp4" />
            </video>
            
            {/* Video controls overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
                onClick={handleVideoToggle}
              >
                {isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>
            </div>

            {item.videoDuration && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-sm">
                  {Math.floor(item.videoDuration / 60)}:{(item.videoDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        ) : (
          <img
            src={item.heroSrc}
            alt={item.title}
            className="hero-image"
            loading="lazy"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Article meta overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-8 h-8 rounded-full border-2 border-white/20"
            />
            <span className="text-sm font-medium">{item.author.name}</span>
            <span className="text-xs text-white/70">
              {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          <h1 className="text-xl font-bold leading-tight mb-2">{item.title}</h1>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Type indicator */}
        {item.type === 'ad' && (
          <div className="absolute top-4 left-4 bg-warning text-warning-foreground rounded px-2 py-1 text-xs font-medium">
            Publicité
          </div>
        )}

        {interaction.seen && (
          <div className="absolute top-4 right-4 bg-seen/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-white">
            Déjà vu
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 overflow-y-auto article-content pb-20">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: item.contentHtml }}
        />

        {/* Engagement stats */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
          <span>{item.engagement.views.toLocaleString()} vues</span>
          <span>{item.engagement.likes} likes</span>
          <span>{item.engagement.shares} partages</span>
        </div>
      </div>

      {/* Social Actions Bar */}
      <div className="absolute bottom-safe-area right-4 flex flex-col gap-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "social-button",
            interaction.liked && "liked"
          )}
          onClick={toggleLike}
        >
          <Heart size={20} className={interaction.liked ? "fill-current" : ""} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "social-button",
            interaction.favorited && "favorited"
          )}
          onClick={toggleFavorite}
        >
          <Bookmark size={20} className={interaction.favorited ? "fill-current" : ""} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="social-button"
          onClick={handleShare}
        >
          <Share2 size={20} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="social-button"
        >
          <MessageCircle size={20} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="social-button text-muted-foreground"
        >
          <Flag size={16} />
        </Button>
      </div>
    </div>
  );
};