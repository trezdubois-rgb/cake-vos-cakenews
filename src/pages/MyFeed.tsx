import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content_html: string;
  hero_image_url: string | null;
  category: string;
  published_at: string | null;
  created_at: string;
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
        // Get user preferences from profiles table
        const { data: profileData } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", user.id)
          .single();

        const prefs = profileData?.preferences as { tags?: string[] } | null;
        setPreferences(prefs);

        let query = supabase
          .from("articles")
          .select("id, title, excerpt, content_html, hero_image_url, category, published_at, created_at")
          .eq("published", true)
          .order("published_at", { ascending: false, nullsFirst: false });

        // Apply filters based on preferences (MVP: Filter by tags if any)
        if (prefs?.tags && prefs.tags.length > 0) {
          query = query.overlaps("tags", prefs.tags);
        }

        const { data, error } = await query.limit(20);

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

  const followedTags = (preferences?.tags as string[]) || [];

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
            {followedTags.length > 0 && ` (${followedTags.length} sujets suivis)`}
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
                  <span>{article.category}</span>
                  <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
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
          <Button onClick={() => navigate("/")}>Explorer les articles</Button>
        </div>
      )}
    </div>
  );
};

export default MyFeed;