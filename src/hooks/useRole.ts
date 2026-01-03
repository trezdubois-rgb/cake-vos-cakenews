import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

const ROLE_CACHE_KEY = 'admin_role_cache';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface RoleCacheData {
  isAdmin: boolean;
  userId: string;
  timestamp: number;
}

const getCachedRole = (userId: string): boolean | null => {
  try {
    const cached = sessionStorage.getItem(ROLE_CACHE_KEY);
    if (!cached) return null;
    
    const data: RoleCacheData = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION_MS;
    const isSameUser = data.userId === userId;
    
    if (!isExpired && isSameUser) {
      return data.isAdmin;
    }
    
    // Cache expiré ou utilisateur différent
    sessionStorage.removeItem(ROLE_CACHE_KEY);
    return null;
  } catch {
    return null;
  }
};

const setCachedRole = (userId: string, isAdmin: boolean): void => {
  try {
    const data: RoleCacheData = {
      isAdmin,
      userId,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(ROLE_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if sessionStorage is not available
  }
};

export const clearRoleCache = (): void => {
  try {
    sessionStorage.removeItem(ROLE_CACHE_KEY);
  } catch {
    // Silently fail
  }
};

export interface RoleState {
  isAdmin: boolean;
  isCheckingRole: boolean;
  roleError: string | null;
}

export const useRole = (): RoleState => {
  const { user, session, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    const checkRole = async () => {
      if (authLoading) return;
      
      if (!user || !session?.access_token) {
        setIsAdmin(false);
        setIsCheckingRole(false);
        setRoleError(null);
        checkedRef.current = false;
        return;
      }

      // Éviter les vérifications multiples pour le même utilisateur
      if (checkedRef.current) return;

      // Vérifier le cache en premier
      const cachedIsAdmin = getCachedRole(user.id);
      if (cachedIsAdmin !== null) {
        setIsAdmin(cachedIsAdmin);
        setIsCheckingRole(false);
        setRoleError(null);
        checkedRef.current = true;
        return;
      }

      try {
        // Vérification directe via Supabase (plus fiable que l'edge function)
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        const userIsAdmin = data?.role === 'admin';
        setIsAdmin(userIsAdmin);
        setCachedRole(user.id, userIsAdmin);
        setRoleError(null);
        checkedRef.current = true;
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        setIsAdmin(false);
        setRoleError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkRole();
  }, [user, session, authLoading]);

  // Reset le flag quand l'utilisateur change
  useEffect(() => {
    checkedRef.current = false;
  }, [user?.id]);

  return { isAdmin, isCheckingRole, roleError };
};