import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FullScreenArticleFeed } from "@/components/feed/FullScreenArticleFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";

export default function CategoryPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      setLoading(true);
      try {
        // Note: In a real app, we might want to slugify the category name or have a separate slug column
        // For now, we assume the URL slug matches the category text (case insensitive ideally)
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
          .ilike("category", slug || "") // Case insensitive match
          .order("published_at", { ascending: false });

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
        console.error("Error fetching category articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryArticles();
    }
  }, [slug]);

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
    <div className="h-screen bg-background">
      <SEO 
        title={`${slug} - Cakenews`}
        description={`Découvrez les derniers articles de la catégorie ${slug} sur Cakenews.`}
      />
      
      {articles.length > 0 ? (
        <FullScreenArticleFeed items={articles} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Aucun article trouvé</h2>
            <p className="text-muted-foreground">
              Il n'y a pas encore d'articles dans la catégorie "{slug}".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
