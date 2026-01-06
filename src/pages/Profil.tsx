import { useState, useEffect } from "react";
import { User, Settings, Heart, Bookmark, Clock, Download, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PreferencesSelector } from "@/components/profile/PreferencesSelector";

interface Preferences {
  tags: string[];
  authors: string[];
  categories: string[];
  formats: string[];
}

const Profil = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    tags: [],
    authors: [],
    categories: [],
    formats: [],
  });
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
        setPreferences({
          tags: prefs.tags || [],
          authors: prefs.authors || [],
          categories: prefs.categories || [],
          formats: prefs.formats || [],
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast.error("Erreur lors du chargement des préférences");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handlePreferencesChange = async (newPreferences: Preferences) => {
    if (!user) return;

    setPreferences(newPreferences);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ preferences: JSON.parse(JSON.stringify(newPreferences)) })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Préférences sauvegardées");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      navigate("/auth");
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
                  Sélectionnez vos catégories, sujets et auteurs favoris pour personnaliser "Mon Flux".
                </p>
              </CardHeader>
              <CardContent>
                {isDataLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : user ? (
                  <PreferencesSelector
                    userId={user.id}
                    preferences={preferences}
                    onPreferencesChange={handlePreferencesChange}
                  />
                ) : null}
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
