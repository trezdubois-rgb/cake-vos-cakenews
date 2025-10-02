import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Palette } from "lucide-react";
import { toast } from "sonner";

export default function DesignManager() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Gestion du Design</h1>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Palettes de Couleurs</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Créez et gérez vos palettes de couleurs pour vos articles et publicités.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer une palette
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Polices Globales</h2>
            <p className="text-muted-foreground mb-4">
              Définissez les polices par défaut pour votre contenu.
            </p>
            <div className="space-y-4">
              <div>
                <Label>Police des titres</Label>
                <Input placeholder="Pacifico, cursive" />
              </div>
              <div>
                <Label>Police du contenu</Label>
                <Input placeholder="Inter, sans-serif" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Thèmes Prédéfinis</h2>
            <p className="text-muted-foreground mb-4">
              Appliquez des thèmes complets à votre interface.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Minimal", "Bold", "Pastel", "Dark"].map((theme) => (
                <Button key={theme} variant="outline" className="h-20">
                  {theme}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
