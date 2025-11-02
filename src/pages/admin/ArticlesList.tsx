import { Edit, Eye, Trash2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
// SUPPRESSION: import { useTranslation } from 'react-i18next';

interface Article {
  id: string;
  title: string;
  category: string;
  published: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
}

export default function ArticlesList() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // SUPPRESSION: const { t } = useTranslation();

  // Hooks doivent être appelés avant toute condition de retour
  useEffect(() => {
    if (user && isAdmin) {
      fetchArticles();
    }
  }, [user, isAdmin]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, category, published, view_count, like_count, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data ?? []);
    } catch (error) {
      console.error("Erreur lors du chargement des articles", error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;
      toast.success("Article supprimé");
      fetchArticles();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Vérifications d'authentification après les hooks
  if (!authLoading && !isAdmin) {
    navigate('/auth');
    return null;
  }

  if (authLoading ?? loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={`skeleton-articles-${i}`} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <AdminNavigation
        breadcrumbs={[{ label: 'Articles' }]}
        title="Gestion des Articles"
      >
        <Link to="/admin/articles/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Créer un article
          </Button>
        </Link>
      </AdminNavigation>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article) => (
            <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{article.title}</h3>
                    <Badge variant={article.published ? 'default' : 'secondary'}>
                      {article.published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{article.category}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.view_count} vues
                    </span>
                    <span>{article.like_count} likes</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/admin/articles/${article.id}/edit`}>
                    <Button variant="outline" size="icon" title="Modifier">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(article.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Empty State */}
          {articles.length === 0 && (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">Aucun article pour le moment</h3>
                <p className="text-muted-foreground mb-6">
                  Commencez à créer du contenu avec l&apos;éditeur Gutenberg professionnel
                </p>
                <Link to="/admin/articles/create">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <span className="mr-2">+</span>
                    Créer le premier article
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Stats */}
        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Articles</p>
              <p className="text-3xl font-bold">{articles.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Vues</p>
              <p className="text-3xl font-bold">
                {articles.reduce((sum, a) => sum + a.view_count, 0).toLocaleString()}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Likes</p>
              <p className="text-3xl font-bold">
                {articles.reduce((sum, a) => sum + a.like_count, 0).toLocaleString()}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}