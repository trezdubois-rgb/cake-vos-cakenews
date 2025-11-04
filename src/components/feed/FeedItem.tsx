import { useState, useEffect, useRef } from "react";
import { Heart, Share2, Eye, Play, Pause, MessageCircle, ExternalLink } from "lucide-react";
import { FeedItem as FeedItemType } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/article/CommentSection";
import { ReportMenu } from "@/components/article/ReportMenu";
import { Link } from "react-router-dom";

interface FeedItemProps {
  item: FeedItemType;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  totalItems: number;
  currentIndex: number;
}

export const FeedItem = ({ item, isActive }: FeedItemProps) => {
  const [interaction, setInteraction] = useState({
    itemId: item.id,
    seen: false,
    liked: false,
    favorited: false,
    timeSpentSec: 0,
    lastSeenAt: new Date().toISOString()
  });
  const [timeSpent, setTimeSpent] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [likeCount, setLikeCount] = useState(item.engagement.likes);
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
    const newLiked = !interaction.liked;
    setInteraction(prev => ({ ...prev, liked: newLiked }));
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
  };

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: "Vous",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
      },
      content,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      replies: []
    };

    if (parentId) {
      setComments(prev => prev.map(c => 
        c.id === parentId 
          ? { ...c, replies: [...(c.replies || []), newComment] }
          : c
      ));
    } else {
      setComments(prev => [...prev, newComment]);
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId 
        ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
        : { ...c, replies: c.replies?.map((r: any) => 
            r.id === commentId 
              ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
              : r
          ) || []
        }
    ));
  };

  const handleReportContent = () => {
    console.log("Report content:", item.id);
  };

  const handleSendFeedback = () => {
    console.log("Send feedback");
  };

  const handleHideArticle = () => {
    console.log("Hide article:", item.id);
  };

  const handleHideAuthor = () => {
    console.log("Hide author:", item.author.id);
  };

  const handleHideCategory = () => {
    console.log("Hide category:", item.category);
  };

  const handleHideTag = (tag: string) => {
    console.log("Hide tag:", tag);
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
      "feed-item bg-background text-foreground h-screen flex flex-col overflow-hidden",
      interaction.seen && "opacity-90"
    )}>
      {/* Seen Badge */}
      {interaction.seen && (
        <div className="absolute top-4 right-4 z-20 bg-destructive/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
          Déjà vu
        </div>
      )}

      {/* Article Header */}
      <div className="px-4 pt-4 pb-3 relative z-10 flex-shrink-0">
        <Badge variant="destructive" className="mb-2 text-xs font-bold uppercase tracking-wide">
          {item.category}
        </Badge>
        
        <h1 className="text-3xl font-extrabold leading-tight mb-3 text-foreground">
          {isLoading ? (
            <div className="space-y-2">
              <div className="skeleton h-9 w-full rounded" />
              <div className="skeleton h-9 w-4/5 rounded" />
            </div>
          ) : (
            item.title
          )}
        </h1>

        <div className="flex items-center gap-3 mb-4">
          {isLoading ? (
            <>
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="skeleton h-4 w-40 rounded" />
            </>
          ) : (
            <>
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-10 h-10 rounded-full bg-muted ring-2 ring-border"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {item.author.name}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(item.publishedAt).toLocaleDateString('fr-FR')}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{item.engagement.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative aspect-video mx-4 mb-4 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
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
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white border-2 border-white/30"
                    onClick={handleVideoToggle}
                  >
                    {isVideoPlaying ? <Pause size={28} /> : <Play size={28} />}
                  </Button>
                </div>

                {item.videoDuration && (
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-white text-xs font-semibold">
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

            {item.type === 'ad' && (
              <div className="absolute top-3 left-3 bg-warning/90 text-warning-foreground rounded-lg px-3 py-1 text-xs font-bold backdrop-blur-sm">
                Publicité
              </div>
            )}
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 px-4 overflow-y-auto article-content pb-32">
        {isLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-5 w-4/5 rounded" />
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-5 w-3/5 rounded" />
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-5 w-2/3 rounded" />
          </div>
        ) : (
          <>
            <div 
              className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:font-semibold prose-strong:text-foreground prose-strong:font-bold"
              dangerouslySetInnerHTML={{ __html: item.contentHtml }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/50">
              {item.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Read full article button */}
            <div className="mt-6 flex justify-center">
              <Link to={`/article/${item.id}`}>
                <Button variant="default" size="lg" className="gap-2">
                  <ExternalLink size={18} />
                  Lire l'article complet
                </Button>
              </Link>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-6">
                <CommentSection
                  articleId={item.id}
                  comments={comments}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-border z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-3 px-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-1 text-xs font-medium",
              interaction.liked && "text-like"
            )}
            onClick={toggleLike}
          >
            <Heart size={22} className={interaction.liked ? "fill-current" : ""} />
            <span>{likeCount > 0 ? likeCount : "J'aime"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs font-medium"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={22} />
            <span>{comments.length > 0 ? comments.length : "Commenter"}</span>
          </Button>

          <ReportMenu
            articleId={item.id}
            authorId={item.author.id}
            authorName={item.author.name}
            category={item.category}
            tags={item.tags}
            onReportContent={handleReportContent}
            onSendFeedback={handleSendFeedback}
            onHideArticle={handleHideArticle}
            onHideAuthor={handleHideAuthor}
            onHideCategory={handleHideCategory}
            onHideTag={handleHideTag}
          />

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs font-medium"
            onClick={handleShare}
          >
            <Share2 size={22} />
            <span>Partager</span>
          </Button>
        </div>
      </div>
    </div>
  );
};