```
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Upload, Eye, MousePointerClick, LayoutTemplate, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Ad {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  placement: string;
  active: boolean;
  impression_count: number;
  click_count: number;
}

export default function AdsManager() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    placement: "after_title",
    active: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAds();
    }
  }, [user, isAdmin]);

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
        toast.warning("Recommandation : Image carrée (1:1) pour un meilleur affichage.");
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

  const getPlacementLabel = (placement: string) => {
    switch (placement) {
      case 'after_title': return 'Après le titre';
      case 'mid_article': return 'Milieu d\'article';
      case 'end_article': return 'Fin d\'article';
      default: return placement;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Publicités
          </h1>
          <p className="text-muted-foreground">Gérez les bannières et leur placement</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Annuler" : "Nouvelle Publicité"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-none shadow-md bg-gradient-to-br from-card to-muted/50 animate-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle>Créer une campagne</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ad_title">Titre de la campagne *</Label>
                    <Input
                      id="ad_title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Promo Été 2025"
                      required
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ad_link">Lien de redirection</Label>
                    <div className="relative mt-1.5">
                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ad_link"
                        value={formData.link_url}
                        onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                        placeholder="https://..."
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ad_placement">Placement</Label>
                    <Select
                      value={formData.placement}
                      onValueChange={(value) => setFormData({ ...formData, placement: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="after_title">Après le titre (Haute visibilité)</SelectItem>
                        <SelectItem value="mid_article">Milieu d'article (Engagement)</SelectItem>
                        <SelectItem value="end_article">Fin d'article (Conversion)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Visuel (Carré recommandé)</Label>
                    <div className="mt-1.5 border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
                        {formData.image_url ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white font-medium">Changer l'image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-8">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Cliquez pour uploader une image</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={uploading} className="w-full md:w-auto min-w-[200px]">
                  {uploading ? "Upload en cours..." : "Lancer la campagne"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <Card key={ad.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img 
                src={ad.image_url} 
                alt={ad.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className={`backdrop-blur-md ${ad.active ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                  {ad.active ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                <h3 className="font-bold text-white text-lg truncate">{ad.title}</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <LayoutTemplate className="h-3 w-3" />
                  {getPlacementLabel(ad.placement)}
                </p>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs font-medium">Vues</span>
                  </div>
                  <span className="text-xl font-bold">{ad.impression_count}</span>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                    <MousePointerClick className="h-4 w-4" />
                    <span className="text-xs font-medium">Clics</span>
                  </div>
                  <span className="text-xl font-bold">{ad.click_count}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={ad.active}
                    onCheckedChange={() => toggleActive(ad.id, ad.active)}
                    id={`switch-${ad.id}`}
                  />
                  <Label htmlFor={`switch-${ad.id}`} className="text-xs cursor-pointer">
                    {ad.active ? "Désactiver" : "Activer"}
                  </Label>
                </div>
                
                <div className="flex gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Aperçu">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Aperçu du placement</DialogTitle>
                        <DialogDescription>
                          Voici comment la publicité apparaîtra dans l'article ({getPlacementLabel(ad.placement)}).
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 border rounded-lg p-4 bg-background space-y-4 max-h-[60vh] overflow-y-auto">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        
                        {ad.placement === 'after_title' && (
                          <div className="my-4">
                            <img src={ad.image_url} className="w-full rounded-lg shadow-sm" />
                            <p className="text-[10px] text-muted-foreground text-center mt-1">Publicité</p>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-muted/50 rounded" />
                          <div className="h-3 w-5/6 bg-muted/50 rounded" />
                          <div className="h-3 w-full bg-muted/50 rounded" />
                        </div>

                        {ad.placement === 'mid_article' && (
                          <div className="my-4">
                            <img src={ad.image_url} className="w-full rounded-lg shadow-sm" />
                            <p className="text-[10px] text-muted-foreground text-center mt-1">Publicité</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="h-3 w-full bg-muted/50 rounded" />
                          <div className="h-3 w-4/5 bg-muted/50 rounded" />
                        </div>

                        {ad.placement === 'end_article' && (
                          <div className="my-4">
                            <img src={ad.image_url} className="w-full rounded-lg shadow-sm" />
                            <p className="text-[10px] text-muted-foreground text-center mt-1">Publicité</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(ad.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {ads.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-muted/20 rounded-xl border-2 border-dashed">
            <div className="p-4 rounded-full bg-muted mb-4">
              <LayoutTemplate className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">Aucune publicité active</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Créez votre première campagne publicitaire pour monétiser votre contenu.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Créer une publicité
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```