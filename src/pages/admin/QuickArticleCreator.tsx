import { Save, Send, ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AdminNavigation } from '@/components/admin/AdminNavigation';
import GutenbergEditor from '@/components/editor/GutenbergEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Block {
  name: string;
  attributes: Record<string, unknown>;
  innerBlocks?: Block[];
}

export default function QuickArticleCreator() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content_html: '',
    blocks: [] as Block[],
    status: 'draft' as 'draft' | 'published',
    featured: false,
  });

  const handleContentChange = useCallback((htmlContent: string, blocks: Block[]) => {
    setArticleData(prev => ({
      ...prev,
      content_html: htmlContent,
      blocks: blocks
    }));
  }, []);

  const handleSave = async (publish = false) => {
    if (!articleData.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    if (!articleData.content_html.trim()) {
      toast.error('Le contenu est obligatoire');
      return;
    }

    const saveAction = publish ? setPublishing : setSaving;
    saveAction(true);

    try {
      const article = {
        title: articleData.title.trim(),
        excerpt: articleData.excerpt.trim() || null,
        content_html: articleData.content_html,
        status: publish ? 'published' : 'draft',
        featured: articleData.featured,
        author_id: user?.id,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
        tags: [],
        category_id: null,
        view_count: 0,
        like_count: 0,
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single();

      if (error) throw error;

      // Notifier les utilisateurs si publié
      if (publish && data.id) {
        try {
          const { data: authorProfile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user?.id)
            .single();

          await supabase.functions.invoke('notify-new-article', {
            body: {
              articleId: data.id,
              articleTitle: article.title,
              authorName: authorProfile?.display_name ?? user?.email ?? 'Un auteur',
            },
          });
        } catch (notifError) {
          console.error('Erreur notification:', notifError);
          // Ne pas bloquer la publication si la notification échoue
        }
      }

      toast.success(publish ? 'Article publié avec succès !' : 'Brouillon sauvegardé !');
      
      if (publish) {
        // Rediriger vers l'article publié ou la liste
        navigate(`/article/${data.id}`);
      } else {
        // Rediriger vers l'éditeur complet pour plus d'options
        navigate(`/admin/articles/${data.id}/edit`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      saveAction(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Articles', href: '/admin/articles' },
          { label: 'Créer un article' }
        ]}
        title="Créer un nouvel article"
      />

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Formulaire rapide */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Titre de l&apos;article *</Label>
              <Input
                id="title"
                value={articleData.title}
                onChange={(e) => setArticleData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre accrocheur de votre article..."
                className="text-lg"
              />
            </div>
            
            <div>
              <Label htmlFor="excerpt">Extrait (optionnel)</Label>
              <Textarea
                id="excerpt"
                value={articleData.excerpt}
                onChange={(e) => setArticleData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Résumé court de votre article..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={articleData.featured}
                onCheckedChange={(checked) => setArticleData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured" className="mb-0">Article vedette</Label>
            </div>
          </div>
        </Card>

        {/* Éditeur Gutenberg */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Contenu de l&apos;article</h3>
            <p className="text-sm text-muted-foreground">
                Utilisez l&apos;éditeur Gutenberg pour créer votre contenu avec des blocs riches
            </p>
          </div>
          
          <div className="border rounded-lg">
            <GutenbergEditor
              initialContent=""
              onContentChange={handleContentChange}
              title={articleData.title || 'Nouvel article'}
              showPreview
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/articles')}
            disabled={saving || publishing}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Annuler
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving || publishing}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder le brouillon'}
            </Button>
            
            <Button
              onClick={() => handleSave(true)}
              disabled={saving || publishing || !articleData.title.trim() || !articleData.content_html.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {publishing ? 'Publication...' : 'Publier l&apos;article'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}