import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Define Article interface locally or import it if available
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content_html: string;
  hero_image_url: string;
  category: { name: string; slug: string };
  author: { display_name: string; avatar_url: string };
  published_at: string;
  slug: string;
  likes: { count: number };
  comments: { count: number };
}

const MyFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Get user preferences
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setPreferences(prefs);

        let query = supabase
          .from("articles")
          .select(`
            *,
            category:categories(name, slug),
            author:profiles(display_name, avatar_url),
            likes:article_likes(count),
            comments:comments(count)
          `)
          .eq("status", "published")
          .order("published_at", { ascending: false });

        // 2. Apply filters based on preferences (MVP: Filter by tags if any)
        if (prefs?.followed_tags && prefs.followed_tags.length > 0) {
            // This is a simplified "OR" filter. A real recommendation engine would be more complex.
            query = query.overlaps("tags", prefs.followed_tags);
        } else {
            // Fallback: If no preferences, maybe show trending or random?
            // For now, we just show latest, but we'll add a UI prompt to customize.
        }

        const { data, error } = await query;

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-4">
        <Sparkles className="w-12 h-12 text-primary mb-2" />
        <h2 className="text-2xl font-bold">Votre Feed Personnel</h2>
        <p className="text-muted-foreground max-w-md">
          Connectez-vous pour accéder à un flux d'actualités entièrement personnalisé selon vos goûts.
        </p>
        <Button onClick={() => navigate("/auth")}>Se connecter</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Mon Feed
          </h1>
          <p className="text-muted-foreground text-sm">
            Sélectionné pour vous
            {preferences?.followed_tags?.length > 0 && ` (${preferences.followed_tags.length} sujets suivis)`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
          Personnaliser
        </Button>
      </div>

      {articles.length > 0 ? (
        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate(`/article/${article.id}`)}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-card"
            >
              {article.hero_image_url && (
                <img
                  src={article.hero_image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{article.category?.name}</span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            Aucun article ne correspond à vos préférences pour le moment.
          </p>
          <Button onClick={() => navigate("/tags")}>Explorer les sujets</Button>
        </div>
      )}
    </div>
  );
};

export default MyFeed;
