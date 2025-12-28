import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseRequireAuthOptions {
  redirectTo?: string;
  requireAdmin?: boolean;
}

interface UseRequireAuthResult {
  user: ReturnType<typeof useAuth>["user"];
  session: ReturnType<typeof useAuth>["session"];
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}): UseRequireAuthResult => {
  const { redirectTo = "/auth", requireAdmin = false } = options;
  const { user, session, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (authLoading) return;
      
      if (!user) {
        setRoleLoading(false);
        navigate(redirectTo, { replace: true });
        return;
      }

      try {
        const { data, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleError && roleError.code !== "PGRST116") {
          throw roleError;
        }

        const userIsAdmin = data?.role === "admin";
        setIsAdmin(userIsAdmin);

        if (requireAdmin && !userIsAdmin) {
          toast.error("Accès refusé : droits administrateur requis");
          navigate("/", { replace: true });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur de vérification du rôle";
        setError(message);
        toast.error("Erreur de connexion au serveur");
        console.error("Role check error:", err);
      } finally {
        setRoleLoading(false);
      }
    };

    checkRole();
  }, [user, authLoading, navigate, redirectTo, requireAdmin]);

  const isLoading = authLoading || roleLoading;

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isAdmin,
    error,
  };
};
