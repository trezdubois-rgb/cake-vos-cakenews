import { useState, useEffect } from "react";
import { User, Settings, Heart, Bookmark, Clock, Download, Trash2, Plus, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserPreference {
  id: string;
  type: 'tag' | 'author' | 'category' | 'format';
  value: string;
  weight: number;
}

const Profil = () => {
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [newPreference, setNewPreference] = useState({ type: 'tag', value: '' });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { user, isLoading: authLoading, error: authError } = useRequireAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !user) return;
    loadPreferences();
  }, [user, authLoading]);

  useEffect(() => {
    if (authError) {
      toast.error("Erreur de connexion au serveur");
    }
  }, [authError]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data?.preferences) {
        const prefs = data.preferences as any;
        const allPrefs: UserPreference[] = [
          ...(prefs.tags || []).map((t: string, i: number) => ({ id: `tag-${i}`, type: 'tag' as const, value: t, weight: 0.8 })),
          ...(prefs.authors || []).map((a: string, i: number) => ({ id: `author-${i}`, type: 'author' as const, value: a, weight: 0.7 })),
          ...(prefs.categories || []).map((c: string, i: number) => ({ id: `category-${i}`, type: 'category' as const, value: c, weight: 0.9 })),
          ...(prefs.formats || []).map((f: string, i: number) => ({ id: `format-${i}`, type: 'format' as const, value: f, weight: 0.6 })),
        ];
        setPreferences(allPrefs);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast.error("Erreur lors du chargement des préférences");
    } finally {
      setIsDataLoading(false);
    }
  };

  const savePreferences = async (updatedPrefs: UserPreference[]) => {
    if (!user) return;

    const formatted = {
      tags: updatedPrefs.filter(p => p.type === 'tag').map(p => p.value),
      authors: updatedPrefs.filter(p => p.type === 'author').map(p => p.value),
      categories: updatedPrefs.filter(p => p.type === 'category').map(p => p.value),
      formats: updatedPrefs.filter(p => p.type === 'format').map(p => p.value),
    };

    const { error } = await supabase
      .from("profiles")
      .update({ preferences: formatted })
      .eq("id", user.id);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
      throw error;
    }

    toast.success("Préférences sauvegardées");
  };

  const addPreference = async () => {
    if (newPreference.value.trim()) {
      const preference: UserPreference = {
        id: Date.now().toString(),
        type: newPreference.type as any,
        value: newPreference.value.trim(),
        weight: 0.7
      };
      const updated = [...preferences, preference];
      setPreferences(updated);
      await savePreferences(updated);
      setNewPreference({ type: 'tag', value: '' });
    }
  };

  const removePreference = async (id: string) => {
    const updated = preferences.filter(p => p.id !== id);
    setPreferences(updated);
    await savePreferences(updated);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      navigate("/auth");
    }
  };

  const getPreferenceTypeLabel = (type: string) => {
    switch (type) {
      case 'tag': return 'Sujet';
      case 'author': return 'Auteur';
      case 'category': return 'Catégorie';
      case 'format': return 'Format';
      default: return type;
    }
  };

  const getPreferenceTypeColor = (type: string) => {
    switch (type) {
      case 'tag': return 'default';
      case 'author': return 'secondary';
      case 'category': return 'outline';
      case 'format': return 'destructive';
      default: return 'secondary';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 p-4">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <div className="text-center mb-6">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-40 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Mon Profil</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleSignOut}>
            <LogOut size={16} className="mr-2" />
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="settings">Réglages</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  Mes Préférences de Contenu
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Personnalisez votre flux en sélectionnant vos sujets et auteurs favoris.
                </p>
              </CardHeader>
              <CardContent>
                {isDataLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <Skeleton className="w-16 h-6 rounded-full" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Add new preference */}
                    <div className="flex gap-2 mb-4">
                      <select
                        value={newPreference.type}
                        onChange={(e) => setNewPreference({ ...newPreference, type: e.target.value })}
                        className="px-3 py-2 border border-border rounded-md text-sm bg-background"
                      >
                        <option value="tag">Sujet</option>
                        <option value="author">Auteur</option>
                        <option value="category">Catégorie</option>
                        <option value="format">Format</option>
                      </select>
                      <Input
                        placeholder="Ajouter une préférence..."
                        value={newPreference.value}
                        onChange={(e) => setNewPreference({ ...newPreference, value: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addPreference()}
                      />
                      <Button onClick={addPreference} size="sm">
                        <Plus size={16} />
                      </Button>
                    </div>

                    {/* Preferences list */}
                    <div className="space-y-2">
                      {preferences.map(preference => (
                        <div key={preference.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant={getPreferenceTypeColor(preference.type) as any} className="text-xs">
                              {getPreferenceTypeLabel(preference.type)}
                            </Badge>
                            <span className="font-medium">{preference.value}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePreference(preference.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {preferences.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Settings size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucune préférence configurée.</p>
                        <p className="text-sm">Ajoutez vos sujets favoris pour personnaliser votre flux.</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark size={20} />
                  Articles Favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Heart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aucun article en favori.</p>
                  <p className="text-sm">Vos articles favoris apparaîtront ici.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Historique de Lecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Clock size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Historique vide.</p>
                  <p className="text-sm">Votre historique de lecture sera conservé ici.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de l'Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cache-size">Taille maximale du cache (MB)</Label>
                    <Input id="cache-size" type="number" defaultValue="500" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Limite de stockage hors ligne pour les articles et vidéos.
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications push</h4>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications pour le nouveau contenu</p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Données et Confidentialité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download size={16} className="mr-2" />
                    Exporter mes données (RGPD)
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <Trash2 size={16} className="mr-2" />
                    Supprimer mon compte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profil;
