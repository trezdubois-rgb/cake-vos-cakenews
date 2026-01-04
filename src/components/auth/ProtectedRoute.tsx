import { ReactNode, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

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

  const isLoading = authLoading || (requireAdmin && isCheckingRole);

  // Reset redirect flag when location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    // Not authenticated → redirect to auth
    if (!isAuthenticated) {
      hasRedirected.current = true;
      navigate("/auth", { replace: true });
      return;
    }

    // Admin required but user is not admin → redirect to home
    if (requireAdmin && !isAdmin) {
      hasRedirected.current = true;
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, isAdmin, requireAdmin, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Role error state
  if (roleError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-lg font-semibold text-destructive mb-2">Erreur de connexion</h2>
          <p className="text-muted-foreground mb-4">{roleError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Authorized
  if (isAuthenticated && (!requireAdmin || isAdmin)) {
    return <>{children}</>;
  }

  // Fallback loading while redirect happens
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};
