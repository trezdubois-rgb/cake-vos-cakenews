import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Image, LogOut, PlusCircle } from "lucide-react";

export default function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Pacifico, cursive' }}>
            Cake Admin
          </h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {!isAdmin && (
          <Card className="p-6 mb-8 border-orange-500">
            <p className="text-center text-muted-foreground">
              ⚠️ Vous n'avez pas les droits administrateur. Contactez un administrateur pour obtenir l'accès.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <FileText className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Articles</h2>
            <p className="text-muted-foreground mb-4">
              Gérer les articles publiés et en brouillon
            </p>
            <Link to="/admin/articles">
              <Button className="w-full">Voir les articles</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <PlusCircle className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Nouvel Article</h2>
            <p className="text-muted-foreground mb-4">
              Créer un nouveau contenu
            </p>
            <Link to="/admin/articles/new">
              <Button className="w-full">Créer</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Image className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Publicités</h2>
            <p className="text-muted-foreground mb-4">
              Gérer les publicités (1:1)
            </p>
            <Link to="/admin/ads">
              <Button className="w-full">Gérer les Ads</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}