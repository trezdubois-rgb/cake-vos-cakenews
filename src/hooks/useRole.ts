import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { verifyUserRole } from '@/lib/serverAuth';

export interface RoleState {
  isAdmin: boolean;
  isCheckingRole: boolean;
  roleError: string | null;
}

export const useRole = (): RoleState => {
  const { session, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (authLoading) return; // Ne rien faire tant que l'auth n'est pas chargée
      
      if (!session?.access_token) {
        // Pas connecté, donc pas admin
        setIsAdmin(false);
        setIsCheckingRole(false);
        setRoleError(null);
        return;
      }

      try {
        const result = await verifyUserRole(session.access_token, 'admin');
        
        if (result.isValid && result.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        setRoleError(result.error || null);
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        setIsAdmin(false);
        setRoleError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkRole();
  }, [session, authLoading]);

  return { isAdmin, isCheckingRole, roleError };
};