import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Type, Layout, Smartphone, Monitor, Moon, Sun, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DesignManager() {
  const { user, loading: authLoading } = useAuth();
  const { theme, updateTheme, loading: themeLoading } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("colors");
  const [isSaving, setIsSaving] = useState(false);

  // Local state for form (synced with theme context)
  const [formData, setFormData] = useState({
    primary_color: theme.primary_color,
    secondary_color: theme.secondary_color,
    font_heading: theme.font_heading,
    font_body: theme.font_body,
    border_radius: theme.border_radius,
    theme_mode: theme.theme_mode,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Sync form data when theme changes from context
    setFormData({
      primary_color: theme.primary_color,
      secondary_color: theme.secondary_color,
      font_heading: theme.font_heading,
      font_body: theme.font_body,
      border_radius: theme.border_radius,
      theme_mode: theme.theme_mode,
    });
  }, [theme]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateTheme(formData);
    setIsSaving(false);
  };

  const handleReset = async () => {
    if (!confirm("Réinitialiser aux valeurs par défaut ? Cette action est irréversible.")) return;
    
    const defaultSettings = {
      primary_color: "#3B82F6",
      secondary_color: "#EC4899",
      font_heading: "Inter",
      font_body: "Inter",
      border_radius: "0.5rem",
      theme_mode: "system" as const,
    };
    
    setFormData(defaultSettings);
    setIsSaving(true);
    await updateTheme(defaultSettings);
    setIsSaving(false);
  };

  if (authLoading || themeLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24 md:pb-8 bg-slate-50 min-h-full">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Design & Apparence
          </h1>
          <p className="text-muted-foreground">Personnalisez l'identité visuelle de votre application</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" disabled={isSaving}>
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Check className="mr-2 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Appliquer les changements"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Couleurs & Thème</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Typographie</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span className="hidden sm:inline">Mise en page</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Mode d'affichage</CardTitle>
                  <CardDescription>Choisissez le thème par défaut</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFormData({ ...formData, theme_mode: mode as any })}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:bg-muted/50",
                        formData.theme_mode === mode 
                          ? "border-primary bg-primary/5" 
                          : "border-transparent bg-card shadow-sm"
                      )}
                    >
                      <div className="p-3 rounded-full bg-background shadow-sm">
                        {mode === 'light' && <Sun className="h-6 w-6 text-orange-500" />}
                        {mode === 'dark' && <Moon className="h-6 w-6 text-indigo-500" />}
                        {mode === 'system' && <Monitor className="h-6 w-6 text-slate-500" />}
                      </div>
                      <span className="font-medium capitalize">
                        {mode === 'system' ? 'Système' : mode === 'light' ? 'Clair' : 'Sombre'}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Palette de couleurs</CardTitle>
                  <CardDescription>Définissez les couleurs de votre marque</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                      <div className="space-y-1">
                        <Label className="text-base">Couleur Principale</Label>
                        <p className="text-sm text-muted-foreground">Utilisée pour les boutons, liens et accents.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-muted-foreground">{formData.primary_color}</span>
                        <div className="relative">
                          <Input
                            type="color"
                            value={formData.primary_color}
                            onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-xl bg-card">
                      <div className="space-y-1">
                        <Label className="text-base">Couleur Secondaire</Label>
                        <p className="text-sm text-muted-foreground">Utilisée pour les éléments décoratifs.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-muted-foreground">{formData.secondary_color}</span>
                        <div className="relative">
                          <Input
                            type="color"
                            value={formData.secondary_color}
                            onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Polices d'écriture</CardTitle>
                  <CardDescription>Gérez la typographie globale</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Titres (Headings)</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.font_heading}
                        onChange={(e) => setFormData({ ...formData, font_heading: e.target.value })}
                      >
                        <option value="Inter">Inter (Sans-serif)</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Playfair Display">Playfair Display (Serif)</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Corps de texte (Body)</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.font_body}
                        onChange={(e) => setFormData({ ...formData, font_body: e.target.value })}
                      >
                        <option value="Inter">Inter (Sans-serif)</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Apparence des composants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Arrondi des bordures (Border Radius)</Label>
                      <div className="flex gap-4">
                        {['0rem', '0.25rem', '0.5rem', '1rem', '9999px'].map((radius) => (
                          <button
                            key={radius}
                            onClick={() => setFormData({ ...formData, border_radius: radius })}
                            className={cn(
                              "h-12 w-12 border-2 bg-muted transition-all hover:bg-primary/20",
                              formData.border_radius === radius ? "border-primary bg-primary/10" : "border-muted-foreground/20"
                            )}
                            style={{ borderRadius: radius }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-muted/50 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  Aperçu en direct
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8" style={{ fontFamily: formData.font_body }}>
                {/* Mock UI Elements */}
                <div className="space-y-4">
                  <div 
                    className="h-32 w-full rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                    style={{ 
                      borderRadius: formData.border_radius,
                      background: `linear-gradient(135deg, ${formData.primary_color}20, ${formData.secondary_color}20)`
                    }}
                  >
                    <span className="font-bold text-2xl" style={{ color: formData.primary_color, fontFamily: formData.font_heading }}>
                      Titre Principal
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold" style={{ fontFamily: formData.font_heading }}>Sous-titre de section</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ceci est un exemple de paragraphe pour visualiser la police de corps de texte. 
                      Le design s'adapte en temps réel à vos choix.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button 
                      style={{ 
                        backgroundColor: formData.primary_color, 
                        borderRadius: formData.border_radius 
                      }}
                    >
                      Bouton Primaire
                    </Button>
                    <Button 
                      variant="outline"
                      style={{ 
                        borderColor: formData.primary_color, 
                        color: formData.primary_color,
                        borderRadius: formData.border_radius 
                      }}
                    >
                      Secondaire
                    </Button>
                  </div>

                  <div className="p-4 border rounded-xl bg-card" style={{ borderRadius: formData.border_radius }}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: formData.secondary_color }}
                      >
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Élément accentué</p>
                        <p className="text-xs text-muted-foreground">Utilise la couleur secondaire</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
