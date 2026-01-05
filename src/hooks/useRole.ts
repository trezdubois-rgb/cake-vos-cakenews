import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface RoleState {
  isAdmin: boolean;
  isCheckingRole: boolean;
  roleError: string | null;
}

/**
 * Rôle admin: validation côté serveur via la fonction backend `auth-guard`.
 * - Pas de cache localStorage/sessionStorage (modifiable côté client)
 * - Petit cache en mémoire (par session) pour éviter les appels doublons
 */
export const useRole = (): RoleState => {
  const { user, session, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);

  const inMemoryCacheRef = useRef<{ userId: string; isAdmin: boolean } | null>(null);
  const inFlightRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (authLoading) return;

    // Pas connecté → pas admin
    if (!user || !session?.access_token) {
      inMemoryCacheRef.current = null;
      inFlightRef.current = null;
      setIsAdmin(false);
      setRoleError(null);
      setIsCheckingRole(false);
      return;
    }

    // Cache mémoire (même session)
    if (inMemoryCacheRef.current?.userId === user.id) {
      setIsAdmin(inMemoryCacheRef.current.isAdmin);
      setRoleError(null);
      setIsCheckingRole(false);
      return;
    }

    const run = async () => {
      setIsCheckingRole(true);
      setRoleError(null);

      try {
        const { data, error } = await supabase.functions.invoke("auth-guard", {
          body: {},
        });

        if (error) throw error;

        const valid = Boolean(data?.isValid);
        const admin = Boolean(data?.isAdmin);

        if (!valid) {
          setIsAdmin(false);
          setRoleError(data?.error || "Session invalide");
          return;
        }

        inMemoryCacheRef.current = { userId: user.id, isAdmin: admin };
        setIsAdmin(admin);
      } catch (e) {
        console.error("Erreur lors de la vérification du rôle (auth-guard):", e);
        setIsAdmin(false);
        setRoleError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setIsCheckingRole(false);
        inFlightRef.current = null;
      }
    };

    // Évite les doubles appels en rafale
    if (!inFlightRef.current) {
      inFlightRef.current = run();
    }
  }, [authLoading, user?.id, session?.access_token]);

  return { isAdmin, isCheckingRole, roleError };
};
