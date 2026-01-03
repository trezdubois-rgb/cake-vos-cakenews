import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Ad {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  placement: string;
  active: boolean | null;
  impression_count: number | null;
  click_count: number | null;
}

export default function AdsManager() {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    placement: "after_title",
    active: true,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des publicités");
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

    const img = new Image();
    img.onload = async () => {
      if (img.width !== img.height) {
        toast.error("L'image doit être carrée (1:1). Recommandé: 1080x1080px");
        return;
      }

      setUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('ads')
          .getPublicUrl(filePath);

        setFormData({ ...formData, image_url: data.publicUrl });
        toast.success("Image uploadée");
      } catch (error: any) {
        toast.error("Erreur lors de l'upload");
      } finally {
        setUploading(false);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.image_url) {
      toast.error("Titre et image sont obligatoires");
      return;
    }

    try {
      const { error } = await supabase
        .from("ads")
        .insert([formData]);

      if (error) throw error;
      
      toast.success("Publicité ajoutée");
      setFormData({
        title: "",
        image_url: "",
        link_url: "",
        placement: "after_title",
        active: true,
      });
      setShowForm(false);
      fetchAds();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette publicité ?")) return;

    try {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Publicité supprimée");
      fetchAds();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("ads")
        .update({ active: !active })
        .eq("id", id);

      if (error) throw error;
      toast.success(active ? "Publicité désactivée" : "Publicité activée");
      fetchAds();
    } catch (error: any) {
      toast.error("Erreur lors de la modification");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">Publicités</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Annuler" : "Ajouter"}
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="ad_title">Titre *</Label>
                <Input
                  id="ad_title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nom de la publicité"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ad_image">Image (1080x1080px recommandé) *</Label>
                <Input
                  id="ad_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  required
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>

              <div>
                <Label htmlFor="ad_link">Lien (optionnel)</Label>
                <Input
                  id="ad_link"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="ad_placement">Placement</Label>
                <Select
                  value={formData.placement}
                  onValueChange={(value) => setFormData({ ...formData, placement: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after_title">Après le titre</SelectItem>
                    <SelectItem value="mid_article">Milieu d'article</SelectItem>
                    <SelectItem value="end_article">Fin d'article</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                Ajouter la publicité
              </Button>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id} className="p-4">
              <img src={ad.image_url} alt={ad.title} className="w-full aspect-square object-cover rounded mb-4" />
              <h3 className="font-bold mb-2">{ad.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Placement: {ad.placement === 'after_title' ? 'Après titre' : ad.placement === 'mid_article' ? 'Milieu' : 'Fin'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {ad.impression_count ?? 0} vues • {ad.click_count ?? 0} clics
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={ad.active ?? false}
                    onCheckedChange={() => toggleActive(ad.id, ad.active ?? false)}
                  />
                  <span className="text-sm">{ad.active ? "Actif" : "Inactif"}</span>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(ad.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}

          {ads.length === 0 && (
            <Card className="p-12 text-center col-span-full">
              <p className="text-muted-foreground">Aucune publicité pour le moment</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}