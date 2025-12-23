import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  display_order: number | null;
  created_at: string;
}

export default function CategoriesManager() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin } = useRole();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    icon: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCategories();
    }
  }, [user, isAdmin]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Le nom est obligatoire");
      return;
    }

    const slug = formData.slug || generateSlug(formData.name);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update({ ...formData, slug })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Catégorie mise à jour");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([{ ...formData, slug }]);

        if (error) throw error;
        toast.success("Catégorie créée");
      }

      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      color: category.color || "#3B82F6",
      icon: category.icon || "",
    });
    setEditingId(category.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
      toast.success("Catégorie supprimée");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      icon: "",
    });
    setEditingId(null);
    setIsEditing(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background p-8 pb-20">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/admin/auth");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 border-orange-500">
            <p className="text-center text-muted-foreground">
              ⚠️ Vous n'avez pas les droits administrateur.
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Catégories</h1>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </div>

        {isEditing && (
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tech, Sport, Culture..."
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="tech, sport, culture (auto-généré si vide)"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la catégorie"
                />
              </div>

              <div>
                <Label htmlFor="color">Couleur</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="icon">Icône (emoji ou texte)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📱, 🎮, ⚽..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
                <Button onClick={resetForm} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {category.icon && (
                    <div className="text-3xl">{category.icon}</div>
                  )}
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}