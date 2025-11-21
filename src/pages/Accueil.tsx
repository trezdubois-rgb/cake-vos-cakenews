import { useEffect, useState } from "react";
import { FullScreenArticleFeed } from "@/components/feed/FullScreenArticleFeed";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGuestMode } from "@/hooks/useGuestMode";
import { GuestTimer } from "@/components/auth/GuestTimer";
import { GuestPromptDialog } from "@/components/auth/GuestPromptDialog";
import { SEO } from "@/components/SEO";

const Accueil = () => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const guestMode = useGuestMode();
  
  // Activer le mode invité seulement si l'utilisateur n'est pas connecté
  const isGuest = !user;
  const shouldShowGuestTimer = isGuest && guestMode.timeRemaining > 0 && !guestMode.isBlocked;

  useEffect(() => {
    fetchArticles();
  }, []);

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
        .order("published_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      if (!data || data.length === 0) {
        setFeedItems([]);
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

      setFeedItems(formattedItems);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (feedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Aucun article disponible</h2>
          <p className="text-muted-foreground">Les articles publiés apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <SEO 
        title="Cakenews - L'actualité en temps réel"
        description="Découvrez toute l'actualité en direct sur Cakenews. Politique, Tech, Culture et plus encore."
      />
      {shouldShowGuestTimer && (
        <GuestTimer
          timeRemaining={guestMode.timeRemaining}
          formatTime={guestMode.formatTime}
        />
      )}
      
      {isGuest && (
        <GuestPromptDialog
          open={guestMode.showAuthPrompt}
          onOpenChange={guestMode.setShowAuthPrompt}
          isBlocked={guestMode.isBlocked}
        />
      )}
      
      <FullScreenArticleFeed items={feedItems} />
    </div>
  );
};

export default Accueil;