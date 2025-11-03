import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { BlockEditor, Block } from "@/components/editor/BlockEditor";
import { compressImageFor1080 } from "@/lib/imageCompression";

export default function ArticleEditor() {
  const { id } = useParams();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    content_html: "",
    content_blocks: [] as Block[],
    tags: [] as string[],
    status: "draft",
    excerpt: "",
    featured: false,
    hero_image_url: "",
    hero_video_url: "",
    seo_title: "",
    seo_description: "",
    published: false,
    scheduled_publish_at: "",
  });

  const [categories, setCategories] = useState<any[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCategories();
      if (id) {
        fetchArticle();
      } else {
        setLoading(false);
      }
    }
  }, [id, user, isAdmin]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error loading categories:", error);
    }
  };

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Initialize blocks if empty
      const blocks = data.content_blocks && Array.isArray(data.content_blocks) && data.content_blocks.length > 0
        ? (data.content_blocks as unknown as Block[])
        : [{ id: 'initial', type: 'paragraph' as const, content: '' }];

      setFormData({
        ...data,
        content_blocks: blocks,
        scheduled_publish_at: data.scheduled_publish_at ? new Date(data.scheduled_publish_at).toISOString().slice(0, 16) : "",
      });
    } catch (error: any) {
      toast.error("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier doit être une image");
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

      const { data } = supabase.storage
        .from('article-media')
        .getPublicUrl(filePath);

      setFormData({ ...formData, hero_image_url: data.publicUrl });
      toast.success("Image compressée et uploadée avec succès");
    } catch (error: any) {
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
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSave = async (publish = false, schedule = false) => {
    if (!formData.title || formData.content_blocks.length === 0) {
      toast.error("Titre et contenu sont obligatoires");
      return;
    }

    if (schedule && !formData.scheduled_publish_at) {
      toast.error("Veuillez sélectionner une date de publication");
      return;
    }

    setSaving(true);
    try {
      // Generate HTML from blocks for backward compatibility
      const contentHtml = formData.content_blocks.map(block => {
        switch (block.type) {
          case 'paragraph':
            return `<p>${block.content}</p>`;
          case 'heading':
            return `<h${block.attributes?.level || 2}>${block.content}</h${block.attributes?.level || 2}>`;
          case 'image':
            return `<figure><img src="${block.content}" alt="${block.attributes?.caption || ''}" />${block.attributes?.caption ? `<figcaption>${block.attributes.caption}</figcaption>` : ''}</figure>`;
          case 'quote':
            return `<blockquote><p>${block.content}</p>${block.attributes?.author ? `<footer>— ${block.attributes.author}</footer>` : ''}</blockquote>`;
          case 'code':
            return `<pre><code>${block.content}</code></pre>`;
          case 'list':
            const tag = block.content?.ordered ? 'ol' : 'ul';
            const items = (block.content?.items || []).map((item: string) => `<li>${item}</li>`).join('');
            return `<${tag}>${items}</${tag}>`;
          default:
            return '';
        }
      }).join('');

      const articleData = {
        title: formData.title,
        category_id: formData.category_id || null,
        content_html: contentHtml,
        content_blocks: formData.content_blocks as any,
        tags: formData.tags,
        status: schedule ? "scheduled" : (publish ? "published" : "draft"),
        excerpt: formData.excerpt || null,
        featured: formData.featured,
        hero_image_url: formData.hero_image_url || null,
        hero_video_url: formData.hero_video_url || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        author_id: user?.id,
        published: publish && !schedule,
        published_at: publish && !schedule ? new Date().toISOString() : null,
        scheduled_publish_at: schedule ? new Date(formData.scheduled_publish_at).toISOString() : null,
      };

      if (id) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id);

        if (error) throw error;
        toast.success(schedule ? "Article planifié" : "Article mis à jour");
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([articleData]);

        if (error) throw error;
        toast.success(schedule ? "Article planifié" : "Article créé");
      }

      navigate("/admin/articles");
    } catch (error: any) {
      console.error("Erreur de sauvegarde:", error);
      toast.error(`Erreur lors de la sauvegarde: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
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

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 border-orange-500">
            <p className="text-center text-muted-foreground">
              ⚠️ Vous n'avez pas les droits administrateur. Contactez un administrateur pour obtenir l'accès.
            </p>
            <div className="mt-4 text-center">
              <Button onClick={() => navigate("/admin")}>
                Retour au tableau de bord
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/articles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">
            {id ? "Modifier l'article" : "Nouvel article"}
          </h1>
        </div>

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
              placeholder="Court résumé de l'article..."
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
              {uploading && <Button disabled><Upload className="mr-2 h-4 w-4" />Chargement...</Button>}
            </div>
            {formData.hero_image_url && (
              <img src={formData.hero_image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
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
            <Label>Contenu de l'article *</Label>
            <BlockEditor
              blocks={formData.content_blocks.length > 0 ? formData.content_blocks : [{ id: 'initial', type: 'paragraph', content: '' }]}
              onChange={(blocks) => setFormData({ ...formData, content_blocks: blocks })}
            />
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
              <Button type="button" onClick={handleAddTag}>Ajouter</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
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
                  onChange={(e) => setFormData({ ...formData, scheduled_publish_at: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Laissez vide pour publier immédiatement
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button onClick={() => handleSave(false, false)} disabled={saving} variant="outline" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Brouillon
            </Button>
            {formData.scheduled_publish_at && (
              <Button onClick={() => handleSave(false, true)} disabled={saving} variant="secondary" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Planifier
              </Button>
            )}
            <Button onClick={() => handleSave(true, false)} disabled={saving} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Publication..." : "Publier"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}