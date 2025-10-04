import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Users, BarChart3, LogOut, Image, FolderTree, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    articles: 0,
    published: 0,
    drafts: 0,
    media: 0,
    categories: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin]);

  const fetchStats = async () => {
    try {
      const [articlesRes, mediaRes, categoriesRes] = await Promise.all([
        supabase.from("articles").select("*", { count: 'exact', head: true }),
        supabase.from("media_library").select("*", { count: 'exact', head: true }),
        supabase.from("categories").select("*", { count: 'exact', head: true }),
      ]);

      const { count: publishedCount } = await supabase
        .from("articles")
        .select("*", { count: 'exact', head: true })
        .eq("status", "published");

      const { count: draftsCount } = await supabase
        .from("articles")
        .select("*", { count: 'exact', head: true })
        .eq("status", "draft");

      setStats({
        articles: articlesRes.count || 0,
        published: publishedCount || 0,
        drafts: draftsCount || 0,
        media: mediaRes.count || 0,
        categories: categoriesRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    { title: "Articles totaux", value: stats.articles.toString(), icon: FileText },
    { title: "Publiés", value: stats.published.toString(), icon: BarChart3 },
    { title: "Brouillons", value: stats.drafts.toString(), icon: FileText },
    { title: "Médias", value: stats.media.toString(), icon: Image },
    { title: "Catégories", value: stats.categories.toString(), icon: FolderTree },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 pb-20">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Pacifico, cursive' }}>
            Cake Admin
          </h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {!isAdmin && (
          <Card className="p-6 mb-8 border-orange-500">
            <p className="text-center text-muted-foreground">
              ⚠️ Vous n'avez pas les droits administrateur. Contactez un administrateur pour obtenir l'accès.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="p-4">
              <stat.icon className="h-6 w-6 mb-2 text-primary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/articles/new">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Nouvel article</h2>
              </div>
              <p className="text-muted-foreground">Créer un nouvel article</p>
            </Card>
          </Link>

          <Link to="/admin/articles">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Articles</h2>
              </div>
              <p className="text-muted-foreground">Gérer tous les articles</p>
            </Card>
          </Link>

          <Link to="/admin/ads">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Video className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Publicités</h2>
              </div>
              <p className="text-muted-foreground">Créer et gérer les pubs</p>
            </Card>
          </Link>

          <Link to="/admin/media">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Image className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Médias</h2>
              </div>
              <p className="text-muted-foreground">Bibliothèque de médias</p>
            </Card>
          </Link>

          <Link to="/admin/categories">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FolderTree className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Catégories</h2>
              </div>
              <p className="text-muted-foreground">Organiser les catégories</p>
            </Card>
          </Link>

          <Link to="/admin/design">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Design</h2>
              </div>
              <p className="text-muted-foreground">Palettes et styles</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}