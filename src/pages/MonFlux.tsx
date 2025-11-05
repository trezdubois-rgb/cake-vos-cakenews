import { useEffect, useState } from "react";
import { FullScreenArticleFeed } from "@/components/feed/FullScreenArticleFeed";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const MonFlux = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPersonalizedArticles();
  }, [user]);

  const fetchPersonalizedArticles = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single();

      const preferences = profile?.preferences || { tags: [], authors: [], categories: [], formats: [] };

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

      const prefs = preferences as { tags: string[], authors: string[], categories: string[], formats: string[] };
      
      const filtered = data?.filter((article: any) => {
        const matchesTags = prefs.tags.length > 0 && article.tags?.some((tag: string) => prefs.tags.includes(tag));
        const matchesAuthor = prefs.authors.length > 0 && prefs.authors.includes(article.author_id);
        const matchesCategory = prefs.categories.length > 0 && prefs.categories.includes(article.category);
        return matchesTags || matchesAuthor || matchesCategory;
      }) || [];

      setArticles(filtered);
    } catch (error) {
      console.error("Error fetching personalized articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-6 bg-card rounded-lg shadow-lg max-w-sm mx-4">
          <h2 className="text-xl font-semibold mb-2">Personnalisez votre flux</h2>
          <p className="text-muted-foreground mb-4">
            Configurez vos préférences pour voir du contenu adapté à vos intérêts.
          </p>
          <Link to="/profil">
            <Button>Configurer mes préférences</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <FullScreenArticleFeed articles={articles} />;
};

export default MonFlux;