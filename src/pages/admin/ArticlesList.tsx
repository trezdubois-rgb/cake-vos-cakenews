import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, Edit, Eye, Trash2, Search, Filter, 
  MoreVertical, Plus, Image as ImageIcon, Calendar 
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Article {
  id: string;
  title: string;
  category: string;
  published: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  hero_image_url: string | null;
}

export default function ArticlesList() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

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

  useEffect(() => {
    let result = articles;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      const isPublished = statusFilter === "published";
      result = result.filter((article) => article.published === isPublished);
    }

    setFilteredArticles(result);
  }, [articles, searchQuery, statusFilter]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, category, published, view_count, like_count, created_at, hero_image_url")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

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

  const togglePublish = async (article: Article) => {
    try {
      const { error } = await supabase
        .from("articles")
        .update({ published: !article.published })
        .eq("id", article.id);

      if (error) throw error;
      toast.success(article.published ? "Article dépublié" : "Article publié");
      fetchArticles();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Articles
          </h1>
          <p className="text-muted-foreground">Gérez vos contenus et publications</p>
        </div>
        <Link to="/admin/articles/new">
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un article..."
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-background/50">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Statut" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card">
            {/* Image Preview */}
            <div className="relative h-48 bg-muted overflow-hidden">
              {article.hero_image_url ? (
                <img
                  src={article.hero_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={article.published ? "default" : "secondary"}
                  className={`shadow-sm ${article.published ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"}`}
                >
                  {article.published ? "Publié" : "Brouillon"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  {article.category}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/admin/articles/edit/${article.id}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublish(article)}>
                      <Eye className="mr-2 h-4 w-4" /> {article.published ? "Dépublier" : "Publier"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {article.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Aucun article trouvé</h3>
          <p className="text-muted-foreground mt-1">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
}