import { ReactNode, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { isAdmin, isCheckingRole, roleError } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  // Afficher un indicateur de chargement pendant la vérification
  const isLoading = authLoading || (requireAdmin && isCheckingRole);

  useEffect(() => {
    // Reset redirect flag when location changes
    hasRedirected.current = false;
  }, [location.pathname]);

  useEffect(() => {
    // Ne pas rediriger tant que le chargement n'est pas terminé
    if (isLoading || hasRedirected.current) return;

    // Rediriger si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      hasRedirected.current = true;
      navigate("/auth", { replace: true });
      return;
    }

    // Si admin requis mais l'utilisateur n'est pas admin
    if (requireAdmin && !isAdmin) {
      hasRedirected.current = true;
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, isAdmin, requireAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground text-sm">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si la vérification du rôle a échoué (erreur réseau, etc.)
  if (roleError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-lg font-semibold text-destructive mb-2">Erreur de connexion</h2>
          <p className="text-muted-foreground mb-4">{roleError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est authentifié et les conditions sont remplies
  if (isAuthenticated && (!requireAdmin || isAdmin)) {
    return <>{children}</>;
  }

  // Pendant la redirection, afficher le loader
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};
