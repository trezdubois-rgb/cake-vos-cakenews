import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Edit, Eye, Trash2, Plus, Heart, TrendingUp, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";

interface Article {
  id: string;
  title: string;
  category: string;
  published: boolean | null;
  view_count: number | null;
  like_count: number | null;
  created_at: string;
}

type SortOption = "newest" | "oldest" | "most_views" | "most_likes" | "title_asc" | "title_desc";

export default function ArticlesList() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const navigate = useNavigate();

  // Stats for the header
  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.published === true).length;
  const draftCount = articles.filter((a) => a.published !== true).length;
  const totalViews = articles.reduce((sum, a) => sum + (a.view_count || 0), 0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchArticles();
    }
  }, [user, isAdmin]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, category, published, view_count, like_count, created_at");

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  // Sort articles based on selected option
  const sortedArticles = [...articles].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "most_views":
        return (b.view_count || 0) - (a.view_count || 0);
      case "most_likes":
        return (b.like_count || 0) - (a.like_count || 0);
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Article supprimé");
      fetchArticles();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      <AdminPageHeader
        title="Articles"
        description="Gérer tous les articles publiés et brouillons"
        icon={FileText}
        actions={
          <Link to="/admin/articles/new">
            <Button className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel article
            </Button>
          </Link>
        }
        statusIndicator={{
          label: `${totalArticles} articles`,
          color: "blue",
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Articles"
          value={totalArticles}
          icon={FileText}
          color="blue"
          subtitle="Tous les contenus"
        />
        <StatCard
          title="Publiés"
          value={publishedCount}
          icon={TrendingUp}
          color="green"
          subtitle="En ligne"
        />
        <StatCard
          title="Brouillons"
          value={draftCount}
          icon={Edit}
          color="orange"
          subtitle="En attente"
        />
        <StatCard
          title="Vues Totales"
          value={totalViews}
          icon={Eye}
          color="teal"
          subtitle="Toutes vues"
        />
      </div>

      {/* Articles List */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Liste des articles
            </h2>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="oldest">Plus anciens</SelectItem>
                  <SelectItem value="most_views">Plus vus</SelectItem>
                  <SelectItem value="most_likes">Plus aimés</SelectItem>
                  <SelectItem value="title_asc">Titre A-Z</SelectItem>
                  <SelectItem value="title_desc">Titre Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            {sortedArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-700">
                      {article.title}
                    </h3>
                    <Badge variant={article.published ? "default" : "secondary"}>
                      {article.published ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {article.category}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.view_count ?? 0} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {article.like_count ?? 0} j'aime
                    </span>
                    <span>
                      {new Date(article.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/admin/articles/${article.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {sortedArticles.length === 0 && (
              <div className="p-12 text-center bg-white rounded-lg border-2 border-dashed">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Aucun article pour le moment
                </p>
                <Link to="/admin/articles/new">
                  <Button>Créer le premier article</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}