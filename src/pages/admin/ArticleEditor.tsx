import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Loader2, Save, ArrowLeft, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useArticleForm } from "@/hooks/useArticleForm";

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { uploading, uploadImage } = useMediaUpload();
  const {
    formData,
    loading,
    saving,
    updateField,
    addTag,
    removeTag,
    saveArticle,
  } = useArticleForm(id, user?.id);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");

  // Create BlockNote editor with file upload handler
  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      if (!user) return "";
      const url = await uploadImage(file, user.id);
      return url || "";
    },
  });

  // Load initial content from HTML
  useEffect(() => {
    const loadContent = async () => {
      if (formData.content_html && editor) {
        try {
          const blocks = await editor.tryParseHTMLToBlocks(formData.content_html);
          editor.replaceBlocks(editor.document, blocks);
        } catch (error) {
          console.error("Error parsing HTML to blocks:", error);
        }
      }
    };
    loadContent();
  }, [formData.content_html, editor]);

  // Save content as HTML when editor changes
  useEffect(() => {
    if (!editor) return;
    
    const saveContent = async () => {
      const html = await editor.blocksToHTMLLossy(editor.document);
      updateField("content_html", html);
    };

    // Listen to editor changes
    const unsubscribe = editor.onChange(() => {
      saveContent();
    });

    return () => {
      unsubscribe();
    };
  }, [editor, updateField]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const url = await uploadImage(e.target.files[0], user.id);
    if (url) {
      updateField("hero_image_url", url);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl pb-24">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/articles")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => saveArticle(false)}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Brouillon
          </Button>
          <Button onClick={() => saveArticle(true)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publier"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'article</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Entrez le titre..."
              className="text-lg font-semibold"
            />
          </div>

          <div className="min-h-[500px] border rounded-lg overflow-hidden bg-background">
            <BlockNoteView editor={editor} theme="dark" />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => updateField("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Image de couverture</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    disabled={uploading}
                  />
                  {formData.hero_image_url ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                      <img
                        src={formData.hero_image_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      ) : (
                        <Upload className="w-8 h-8 mb-2" />
                      )}
                      <span className="text-sm">Cliquez pour ajouter une image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Extrait</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  placeholder="Court résumé pour les cartes..."
                  className="h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(newTag);
                        setNewTag("");
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      addTag(newTag);
                      setNewTag("");
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Mettre à la une</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => updateField("featured", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="seo">
            <TabsList className="w-full">
              <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
              <TabsTrigger value="schedule" className="flex-1">Planification</TabsTrigger>
            </TabsList>
            <TabsContent value="seo">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Titre SEO</Label>
                    <Input
                      value={formData.seo_title}
                      onChange={(e) => updateField("seo_title", e.target.value)}
                      placeholder="Titre optimisé pour Google"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description SEO</Label>
                    <Textarea
                      value={formData.seo_description}
                      onChange={(e) => updateField("seo_description", e.target.value)}
                      placeholder="Meta description..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedule">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Date de publication</Label>
                    <Input
                      type="datetime-local"
                      value={formData.scheduled_publish_at}
                      onChange={(e) => updateField("scheduled_publish_at", e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => saveArticle(true, true)}
                    disabled={saving}
                  >
                    Planifier
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;