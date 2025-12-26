import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <section className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-destructive">404</h1>
        <p className="text-xl text-muted-foreground">Page introuvable</p>
        <Button asChild>
          <Link to="/accueil">Retour à l'accueil</Link>
        </Button>
      </section>
    </main>
  );
};

export default NotFound;
