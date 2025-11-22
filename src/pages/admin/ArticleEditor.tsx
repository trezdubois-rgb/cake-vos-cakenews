import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Loader2, Image as ImageIcon, Save, ArrowLeft, Upload, X, Plus, Youtube as YoutubeIcon, Code } from "lucide-react";
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

const lowlight = createLowlight(common);

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        controls: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: formData.content_html,
    onUpdate: ({ editor }) => {
      updateField("content_html", editor.getHTML());
    },
  });

  // Sync content when loaded
  useEffect(() => {
    if (editor && formData.content_html && editor.getHTML() !== formData.content_html) {
      editor.commands.setContent(formData.content_html);
    }
  }, [formData.content_html, editor]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const url = await uploadImage(e.target.files[0], user.id);
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

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

          <div className="min-h-[500px] border rounded-lg p-4 bg-background">
            <div className="flex gap-2 mb-4 border-b pb-2 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("editor-image-upload")?.click()}
                disabled={uploading}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </Button>
              <input
                type="file"
                id="editor-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = prompt("Entrez l'URL de la vidéo YouTube :");
                  if (url) {
                    editor?.commands.setYoutubeVideo({ src: url });
                  }
                }}
              >
                <YoutubeIcon className="w-4 h-4 mr-2" />
                YouTube
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={editor?.isActive("codeBlock") ? "bg-muted" : ""}
              >
                <Code className="w-4 h-4 mr-2" />
                Code
              </Button>
            </div>
            <EditorContent editor={editor} className="prose prose-invert max-w-none" />
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
                        <ImageIcon className="w-8 h-8 mb-2" />
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