import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Palette, LogOut, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [followedTags, setFollowedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        // Fetch preferences
        const { data: prefsData } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (prefsData) {
          setPreferences(prefsData);
          setFollowedTags(prefsData.followed_tags || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddTag = async () => {
    if (!newTag.trim() || !user) return;

    const updatedTags = [...followedTags, newTag.trim()];
    setFollowedTags(updatedTags);
    setNewTag("");

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          followed_tags: updatedTags,
        });

      if (error) throw error;
      toast.success("Préférence ajoutée !");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!user) return;

    const updatedTags = followedTags.filter((t) => t !== tag);
    setFollowedTags(updatedTags);

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          followed_tags: updatedTags,
        });

      if (error) throw error;
      toast.success("Préférence retirée");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Attendre que l'authentification soit chargée avant de rediriger
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-4">
        <User className="w-12 h-12 text-primary mb-2" />
        <h2 className="text-2xl font-bold">Profil</h2>
        <p className="text-muted-foreground max-w-md">
          Connectez-vous pour accéder à votre profil et personnaliser votre expérience.
        </p>
        <Button onClick={() => navigate("/auth")}>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl">
              {profile?.display_name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile?.display_name || "Utilisateur"}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="preferences">
            <Settings className="w-4 h-4 mr-2" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            Compte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sujets Suivis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Personnalisez votre feed en suivant des sujets qui vous intéressent.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {followedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un sujet (ex: Toyota, Tech...)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag}>Ajouter</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personnalisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thème</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choisissez l'apparence de votre application.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <div className="w-8 h-8 rounded-full bg-background border-2 mb-2" />
                    Clair
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col border-primary">
                    <div className="w-8 h-8 rounded-full bg-foreground mb-2" />
                    Sombre
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-background to-foreground mb-2" />
                    Auto
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  🎨 <strong>Bientôt disponible :</strong> Skins premium, icônes personnalisées, badges exclusifs...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du Compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={profile?.display_name || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email || ""} disabled />
              </div>
              <p className="text-sm text-muted-foreground">
                Pour modifier vos informations, contactez le support.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
