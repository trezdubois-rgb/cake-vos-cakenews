import { useState, useEffect, useRef, useCallback } from "react";
import { FeedItem } from "./FeedItem";
import { FeedItem as FeedItemType } from "@/data/mockData";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedContainerProps {
  items?: FeedItemType[];
  personalFilter?: boolean;
}

export const FeedContainer = ({ personalFilter = false }: FeedContainerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedItems, setPreloadedItems] = useState<FeedItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch articles from Supabase
  useEffect(() => {
    fetchArticles();
  }, [personalFilter]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setPreloadedItems([]);
        setLoading(false);
        return;
      }

      const formattedItems = data.map((article: any) => ({
        id: article.id,
        type: "article" as const,
        slug: article.id,
        category: article.category || "Non catégorisé",
        title: article.title,
        excerpt: article.excerpt || article.title,
        contentHtml: article.content_html,
        heroSrc: article.hero_image_url || "/placeholder.svg",
        heroLqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z",
        videoHls: article.hero_video_url,
        author: {
          id: article.author_id,
          name: article.profiles?.display_name || "Auteur",
          avatar: article.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_id}`,
        },
        tags: article.tags || [],
        engagement: {
          likes: article.like_count || 0,
          views: article.view_count || 0,
          shares: 0,
        },
        publishedAt: article.published_at || article.created_at,
      }));

      setPreloadedItems(formattedItems.slice(0, 15));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = useCallback(() => {
    if (currentIndex < preloadedItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, preloadedItems.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const { swipeHandlers } = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    threshold: 50,
    angleThreshold: 30,
    edgeProtection: 20
  });

  const currentItem = preloadedItems[currentIndex];

  if (loading) {
    return (
      <div className="feed-container flex items-center justify-center">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (preloadedItems.length === 0) {
    return (
      <div className="feed-container flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Aucun article disponible</h2>
          <p className="text-muted-foreground">Les articles publiés apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="feed-container"
      {...swipeHandlers}
    >
      {/* Progress indicator */}
      <div className="absolute top-safe-area left-4 right-4 z-10">
        <div className="flex gap-1">
          {preloadedItems.slice(0, 5).map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full ${
                idx === currentIndex ? 'bg-primary' : 'bg-muted/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current item */}
      <FeedItem
        item={currentItem}
        isActive={true}
        onNext={goToNext}
        onPrev={goToPrev}
        totalItems={preloadedItems.length}
        currentIndex={currentIndex}
      />

      {/* Navigation hints */}
      <div className="absolute bottom-24 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
        {currentIndex > 0 && (
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white/80 text-sm">← Précédent</span>
          </div>
        )}
        <div className="flex-1" />
        {currentIndex < preloadedItems.length - 1 && (
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white/80 text-sm">Suivant →</span>
          </div>
        )}
      </div>
    </div>
  );
};