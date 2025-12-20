import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { isAdmin, isCheckingRole, roleError } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas authentifié
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Si une vérification admin est requise, attendre que la vérification du rôle soit terminée
    if (requireAdmin && !isCheckingRole && isAuthenticated) {
      if (!isAdmin) {
        // L'utilisateur n'a pas les droits admin requis
        navigate("/");
      }
    }
  }, [isAuthenticated, authLoading, isAdmin, isCheckingRole, requireAdmin, navigate]);

  // Afficher un indicateur de chargement pendant la vérification
  const isLoading = authLoading || (requireAdmin && isCheckingRole);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Afficher une erreur si la vérification du rôle a échoué
  if (roleError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold text-destructive">Erreur de vérification du rôle</h2>
          <p className="text-muted-foreground">{roleError}</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est authentifié et que les conditions sont remplies, afficher les enfants
  if (isAuthenticated && (!requireAdmin || isAdmin)) {
    return <>{children};
  }

  // Sinon, afficher un indicateur de chargement ou rien
  return null;
};
