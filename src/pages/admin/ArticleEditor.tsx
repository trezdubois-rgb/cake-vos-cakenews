import { Save, Upload, X } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { AdminNavigation } from '@/components/admin/AdminNavigation';
import GutenbergEditor from '@/components/editor/GutenbergEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { compressImageFor1080 } from '@/lib/imageCompression';


interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function ArticleEditor() {
  const { id } = useParams();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    content_html: '',
    tags: [] as string[],
    status: 'draft',
    excerpt: '',
    featured: false,
    hero_image_url: '',
    hero_video_url: '',
    seo_title: '',
    seo_description: '',
    published: false,
    scheduled_publish_at: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);

  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);

  // Hooks doivent être appelés avant toute condition de retour
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');

      if (error) throw error;
      setCategories(data ?? []);
    } catch (_error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  const notifyUsers = async (articleId: string, articleTitle: string) => {
    if (!user) return;

    try {
      const { data: authorProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      await supabase.functions.invoke('notify-new-article', {
        body: {
          articleId,
          articleTitle,
          authorName: authorProfile?.display_name ?? user.email ?? 'Un auteur',
        },
      });
    } catch (error) {
      console.error('Erreur notification:', error);
      // Ne pas bloquer la publication si la notification échoue
    }
  };

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();

      if (error) throw error;

      setFormData({
        ...data,
        scheduled_publish_at: data.scheduled_publish_at
          ? new Date(data.scheduled_publish_at).toISOString().slice(0, 16)
          : '',
      });
    } catch (_error) {
      toast.error("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCategories();
      if (id) {
        fetchArticle();
      } else {
        setLoading(false);
      }
    }
  }, [id, user, isAdmin, fetchCategories, fetchArticle]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image');
      return;
    }

    setUploading(true);
    try {
      toast.info("Compression de l'image en cours...");

      // Compress image
      const compressedFile = await compressImageFor1080(file);

      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('article-media')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('article-media').getPublicUrl(filePath);

      setFormData({ ...formData, hero_image_url: data.publicUrl });
      toast.success('Image compressée et uploadée avec succès');
    } catch (_error) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSave = async (publish = false, schedule = false) => {
    if (!formData.title || !formData.content_html) {
      toast.error('Titre et contenu sont obligatoires');
      return;
    }

    if (schedule && !formData.scheduled_publish_at) {
      toast.error('Veuillez sélectionner une date de publication');
      return;
    }

    setSaving(true);
    try {
      const articleData = {
        title: formData.title,
        category_id: formData.category_id ?? null,
        content_html: formData.content_html,
        tags: formData.tags,
        status: schedule ? 'scheduled' : publish ? 'published' : 'draft',
        excerpt: formData.excerpt ?? null,
        featured: formData.featured,
        hero_image_url: formData.hero_image_url ?? null,
        hero_video_url: formData.hero_video_url ?? null,
        seo_title: formData.seo_title ?? null,
        seo_description: formData.seo_description ?? null,
        author_id: user?.id,
        published: publish && !schedule,
        published_at: publish && !schedule ? new Date().toISOString() : null,
        scheduled_publish_at: schedule
          ? new Date(formData.scheduled_publish_at).toISOString()
          : null,
      };

      let articleId = id;

      if (id) {
        const { error, data } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id)
          .select('id')
          .single();

        if (error) throw error;
        articleId = data?.id ?? id;

        // Notifier si publié (et non planifié)
        if (publish && !schedule && articleId) {
          await notifyUsers(articleId, articleData.title);
        }

        toast.success(schedule ? 'Article planifié' : 'Article mis à jour');
      } else {
        const { error, data } = await supabase
          .from('articles')
          .insert([articleData])
          .select('id')
          .single();

        if (error) throw error;
        articleId = data?.id;

        // Notifier si publié (et non planifié)
        if (publish && !schedule && articleId) {
          await notifyUsers(articleId, articleData.title);
        }

        toast.success(schedule ? 'Article planifié' : 'Article créé');
      }

      navigate('/admin/articles');
    } catch (_error) {
      console.error('Erreur de sauvegarde:', error);
      toast.error(`Erreur lors de la sauvegarde: ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading ?? loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  // Vérifications d'authentification après les hooks
  if (!authLoading && !isAdmin) {
    navigate('/auth');
    return null;
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 border-orange-500">
            <p className="text-center text-muted-foreground">
              ⚠️ Vous n&apos;avez pas les droits administrateur. Contactez un administrateur pour obtenir
              l&apos;accès.
            </p>
            <div className="mt-4 text-center">
              <Button onClick={() => navigate('/admin')}>Retour au tableau de bord</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <AdminNavigation
        breadcrumbs={[
          { label: 'Articles', href: '/admin/articles' },
          { label: id ? 'Modifier' : 'Nouveau' },
        ]}
        title={id ? "Modifier l&apos;article" : 'Créer un nouvel article'}
      />
      <div className="max-w-4xl mx-auto">

        <Card className="p-6 space-y-6">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Le titre de votre article"
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="excerpt">Extrait</Label>
            <Input
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Court résumé de l&apos;article..."
            />
          </div>

          <div>
            <Label htmlFor="hero_image">Image hero</Label>
            <div className="flex gap-2">
              <Input
                id="hero_image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <Button disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  Chargement...
                </Button>
              )}
            </div>
            {formData.hero_image_url && (
              <img
                src={formData.hero_image_url}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div>
            <Label htmlFor="hero_video">URL Vidéo hero (optionnel)</Label>
            <Input
              id="hero_video"
              value={formData.hero_video_url}
              onChange={(e) => setFormData({ ...formData, hero_video_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Contenu de l&apos;article *</Label>
            <div className="mt-2">
              <GutenbergEditor
                initialContent={formData.content_html}
                onSave={(html) => setFormData({ ...formData, content_html: html })}
                onContentChange={(html) => setFormData({ ...formData, content_html: html })}
                title={formData.title || 'Nouvel article'}
                showPreview={false}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Ajouter un tag"
              />
              <Button type="button" onClick={handleAddTag}>
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          <Tabs defaultValue="seo">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="seo_title">Titre SEO</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="Titre optimisé pour les moteurs de recherche"
                />
              </div>
              <div>
                <Label htmlFor="seo_description">Description SEO</Label>
                <Input
                  id="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Description optimisée (150-160 caractères)"
                />
              </div>
            </TabsContent>
            <TabsContent value="options" className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label>Article mis en avant</Label>
              </div>
              <div>
                <Label htmlFor="scheduled_date">Date de publication programmée</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_publish_at}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduled_publish_at: e.target.value })
                  }
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Laissez vide pour publier immédiatement
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(false, false)}
              disabled={saving}
              variant="outline"
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              Brouillon
            </Button>
            {formData.scheduled_publish_at && (
              <Button
                onClick={() => handleSave(false, true)}
                disabled={saving}
                variant="secondary"
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                Planifier
              </Button>
            )}
            <Button onClick={() => handleSave(true, false)} disabled={saving} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}