import { useState, useEffect, useRef } from "react";
import { Heart, Bookmark, Share2, Flag, MessageCircle, Play, Pause, Facebook, Twitter } from "lucide-react";
import { FeedItem as FeedItemType, getUserInteraction } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(0);

  // Track time spent on item and simulate loading
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      
      // Simulate content loading
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      // Mark as seen after 1 second
      const seenTimer = setTimeout(() => {
        setInteraction(prev => ({ ...prev, seen: true, lastSeenAt: new Date().toISOString() }));
      }, 1000);

      return () => {
        clearTimeout(loadingTimer);
        clearTimeout(seenTimer);
        const spent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeSpent(spent);
        setInteraction(prev => ({ ...prev, timeSpentSec: prev.timeSpentSec + spent }));
      };
    } else {
      setIsLoading(true);
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
      "feed-item bg-background text-foreground h-screen flex flex-col",
      interaction.seen && "opacity-85"
    )}>
      {/* Seen Badge */}
      {interaction.seen && (
        <div className="absolute top-4 right-4 z-20 bg-seen/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
          Déjà vu
        </div>
      )}

      {/* Article Header */}
      <div className="p-4 pb-0 relative z-10">
        <Badge variant="destructive" className="mb-3 text-xs font-bold uppercase">
          {item.category}
        </Badge>
        
        <h1 className="text-2xl font-bold leading-tight mb-3 text-foreground">
          {isLoading ? (
            <div className="space-y-2">
              <div className="skeleton h-8 w-full rounded" />
              <div className="skeleton h-8 w-3/4 rounded" />
            </div>
          ) : (
            item.title
          )}
        </h1>

        <div className="flex items-center gap-3 mb-3">
          {isLoading ? (
            <>
              <div className="skeleton w-6 h-6 rounded-full" />
              <div className="skeleton h-4 w-32 rounded" />
            </>
          ) : (
            <>
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-6 h-6 rounded-full bg-muted"
              />
              <span className="text-sm text-muted-foreground">
                Par {item.author.name} — {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
              </span>
            </>
          )}
        </div>

        {/* Share Bar */}
        <div className="flex gap-4 pb-3 border-b border-border mb-4">
          <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0">
            <Facebook size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0">
            <Twitter size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0" onClick={handleShare}>
            <Share2 size={16} />
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative aspect-video mx-4 mb-5 rounded-xl overflow-hidden bg-muted">
        {isLoading ? (
          <div className="skeleton w-full h-full" />
        ) : (
          <>
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
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}

            {/* Type indicator */}
            {item.type === 'ad' && (
              <div className="absolute top-4 left-4 bg-warning text-warning-foreground rounded px-3 py-1 text-xs font-medium">
                Publicité
              </div>
            )}
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 px-4 overflow-y-auto article-content pb-24">
        {isLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-5 w-4/5 rounded" />
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-5 w-3/5 rounded" />
          </div>
        ) : (
          <>
            <div 
              className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: item.contentHtml }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
              {item.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Engagement stats */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
              <span>{item.engagement.views.toLocaleString()} vues</span>
              <span>{item.engagement.likes} likes</span>
              <span>{item.engagement.shares} partages</span>
            </div>
          </>
        )}
      </div>

      {/* Fixed Reaction Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex justify-around items-center py-3 px-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-1 text-xs",
              interaction.liked && "text-like"
            )}
            onClick={toggleLike}
          >
            <Heart size={20} className={interaction.liked ? "fill-current" : ""} />
            <span>J'aime</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-1 text-xs",
              interaction.favorited && "text-favorite"
            )}
            onClick={toggleFavorite}
          >
            <Bookmark size={20} className={interaction.favorited ? "fill-current" : ""} />
            <span>Favori</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs"
            onClick={handleShare}
          >
            <Share2 size={20} />
            <span>Partager</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs"
          >
            <MessageCircle size={20} />
            <span>Commenter</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
          >
            <Flag size={16} />
            <span>Signaler</span>
          </Button>
        </div>
      </div>
    </div>
  );
};