import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FullScreenArticleFeed } from "@/components/feed/FullScreenArticleFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function TagSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  // Get tags from URL query param (comma separated)
  const selectedTags = searchParams.get("q")?.split(",").filter(Boolean) || [];

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  useEffect(() => {
    fetchTaggedArticles();
  }, [searchParams]);

  const fetchAvailableTags = async () => {
    // In a real app, we'd have a tags table. Here we fetch all articles and extract unique tags.
    // Not efficient for large datasets, but fine for MVP.
    const { data } = await supabase
      .from("articles")
      .select("tags")
      .eq("published", true);
    
    const tags = new Set<string>();
    (data || []).forEach((article: any) => {
      (article.tags || []).forEach((tag: string) => tags.add(tag));
    });
    
    setAvailableTags(Array.from(tags).sort());
  };

  const fetchTaggedArticles = async () => {
    setLoading(true);
    try {
      let query = supabase
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

      if (selectedTags.length > 0) {
        // Filter articles that contain ALL selected tags
        query = query.contains("tags", selectedTags);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedItems = (data || []).map((article: any) => ({
        id: article.id,
        type: "article" as const,
        slug: article.id,
        category: article.category,
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

      setArticles(formattedItems);
    } catch (error) {
      console.error("Error fetching tagged articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSearchParams(newTags.length > 0 ? { q: newTags.join(",") } : {});
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

  return (
    <div className="h-screen bg-background flex flex-col">
      <SEO 
        title="Recherche par tags - Cakenews"
        description="Explorez les articles par thèmes et tags."
      />

      {/* Tag Filter Bar */}
      <div className="p-4 border-b bg-background/95 backdrop-blur sticky top-14 z-40 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {availableTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {articles.length > 0 ? (
          <FullScreenArticleFeed items={articles} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Aucun article trouvé</h2>
              <p className="text-muted-foreground">
                Essayez de sélectionner d'autres tags.
              </p>
              <Button 
                variant="link" 
                onClick={() => setSearchParams({})}
                className="mt-4"
              >
                Effacer les filtres
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
