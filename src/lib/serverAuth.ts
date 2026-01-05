// serverAuth.ts - Service d'authentification sécurisé utilisant une Edge Function
import { supabase } from '@/integrations/supabase/client';

export interface AuthResponse {
  isValid: boolean;
  isAdmin?: boolean;
  userId?: string;
  role?: string;
  error?: string;
}

// Fonction pour vérifier le rôle admin via une Edge Function Supabase
export const checkAdminRoleSecure = async (token: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('auth-guard', {
      body: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data as AuthResponse;
  } catch (error) {
    console.error('Erreur lors de la vérification sécurisée du rôle admin:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la vérification du rôle',
    };
  }
};

// Fonction pour vérifier le rôle via fonction backend
export const verifyUserRole = async (
  token: string,
  requiredRole: 'admin' | 'user' = 'user'
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('auth-guard', {
      body: {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as AuthResponse;

    if (requiredRole === 'admin' && !payload.isAdmin) {
      return { ...payload, isValid: false };
    }

    return payload;
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la vérification du rôle',
    };
  }
};
