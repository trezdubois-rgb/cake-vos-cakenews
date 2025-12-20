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
    // Appeler l'Edge Function pour la validation côté serveur
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-guard`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification sécurisée du rôle admin:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la vérification du rôle',
    };
  }
};

// Fonction pour vérifier le rôle via Edge Function
export const verifyUserRole = async (token: string, requiredRole: 'admin' | 'user' = 'user'): Promise<AuthResponse> => {
  try {
    // Appeler l'Edge Function pour la validation côté serveur
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-guard`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur serveur: ${response.status}`);
    }

    const data = await response.json();

    // Vérifier si le rôle requis est respecté
    if (requiredRole === 'admin' && !data.isAdmin) {
      return {
        ...data,
        isValid: false,
      };
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la vérification du rôle',
    };
  }
};