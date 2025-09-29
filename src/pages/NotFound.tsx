import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-destructive">404</h1>
        <p className="text-xl text-muted-foreground">Page introuvable</p>
        <a href="/accueil" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
