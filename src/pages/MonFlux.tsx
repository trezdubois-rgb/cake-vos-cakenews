import { useEffect, useState } from "react";
import { FullScreenArticleFeed } from "@/components/feed/FullScreenArticleFeed";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Settings, Sparkles } from "lucide-react";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

const MonFlux = () => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(false);
  const { user, isLoading: authLoading } = useRequireAuth();

  useEffect(() => {
    if (authLoading || !user) return;
    fetchPersonalizedArticles();
  }, [user, authLoading]);

  const fetchPersonalizedArticles = async () => {
    if (!user) return;

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      const preferences = profile?.preferences as { 
        tags?: string[], 
        authors?: string[], 
        categories?: string[], 
        formats?: string[] 
      } || { tags: [], authors: [], categories: [], formats: [] };

      const hasSomePreferences = 
        (preferences.tags?.length || 0) > 0 ||
        (preferences.authors?.length || 0) > 0 ||
        (preferences.categories?.length || 0) > 0;

      setHasPreferences(hasSomePreferences);

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
        setFeedItems([]);
        setLoading(false);
        return;
      }

      let filteredData = data;
      
      if (hasSomePreferences) {
        filteredData = data.filter((article: any) => {
          const matchesTags = preferences.tags && preferences.tags.length > 0 && 
            article.tags?.some((tag: string) => 
              preferences.tags!.some(prefTag => 
                tag.toLowerCase().includes(prefTag.toLowerCase()) ||
                prefTag.toLowerCase().includes(tag.toLowerCase())
              )
            );
          
          const matchesAuthor = preferences.authors && preferences.authors.length > 0 && 
            preferences.authors.includes(article.author_id);
          
          const matchesCategory = preferences.categories && preferences.categories.length > 0 && 
            preferences.categories.some(prefCat =>
              article.category?.toLowerCase().includes(prefCat.toLowerCase()) ||
              prefCat.toLowerCase().includes(article.category?.toLowerCase() || '')
            );
          
          return matchesTags || matchesAuthor || matchesCategory;
        });
      }

      const formattedItems = filteredData.map((article: any) => ({
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
        content_blocks: article.content_blocks,
      }));

      setFeedItems(formattedItems);
    } catch (error) {
      console.error("Error fetching personalized articles:", error);
      toast.error("Erreur lors du chargement de votre flux");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <SEO 
          title="Mon Flux - Cakenews"
          description="Votre flux personnalisé d'articles."
        />
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!hasPreferences) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO 
          title="Mon Flux - Cakenews"
          description="Votre flux personnalisé d'articles basé sur vos préférences."
        />
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Personnalisez votre flux</h2>
          <p className="text-muted-foreground mb-6">
            Configurez vos préférences pour voir uniquement les articles qui vous intéressent. 
            Choisissez vos sujets, catégories et auteurs favoris.
          </p>
          <Link to="/profil">
            <Button size="lg" className="gap-2">
              <Settings className="w-5 h-5" />
              Configurer mes préférences
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (feedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO 
          title="Mon Flux - Cakenews"
          description="Votre flux personnalisé d'articles basé sur vos préférences."
        />
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Aucun article correspondant</h2>
          <p className="text-muted-foreground mb-6">
            Aucun article ne correspond à vos préférences actuelles. 
            Essayez d'ajouter plus de sujets ou de catégories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/profil">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Modifier mes préférences
              </Button>
            </Link>
            <Link to="/accueil">
              <Button className="gap-2">
                Voir tous les articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background">
      <SEO 
        title="Mon Flux - Cakenews"
        description="Votre flux personnalisé d'articles basé sur vos préférences."
      />
      <FullScreenArticleFeed items={feedItems} />
    </div>
  );
};

export default MonFlux;
