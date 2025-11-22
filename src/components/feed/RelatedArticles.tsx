import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RelatedArticlesProps {
  currentArticleId: string;
}

export const RelatedArticles = ({ currentArticleId }: RelatedArticlesProps) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_related_articles', { 
            p_article_id: currentArticleId,
            p_limit: 3 
          });

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching related articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentArticleId) {
      fetchRelated();
    }
  }, [currentArticleId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Articles similaires</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} to={`/article/${article.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={article.hero_image_url || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {article.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h4 className="font-bold line-clamp-2 mb-2">{article.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt || "Lire la suite..."}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
