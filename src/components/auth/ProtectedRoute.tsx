import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Rediriger vers la page de connexion
        navigate("/auth");
      } else if (requireAdmin && !isAdmin) {
        // L'utilisateur n'a pas les droits admin requis
        navigate("/");
      }
    }
  }, [user, loading, isAdmin, requireAdmin, navigate]);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si l'utilisateur est connecté et que les conditions sont remplies, afficher les enfants
  if (user && (!requireAdmin || isAdmin)) {
    return <>{children}</>;
  }

  // Sinon, afficher un indicateur de chargement ou rien
  return null;
};
