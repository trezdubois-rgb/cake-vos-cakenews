// utils/security.ts
import { supabase } from "@/integrations/supabase/client";

// Fonction pour vérifier si un utilisateur a dépassé la limite de tentatives
export const checkRateLimit = async (identifier: string, maxAttempts: number = 5, windowMinutes: number = 15): Promise<{ allowed: boolean; attemptsLeft: number; resetTime?: Date }> => {
  try {
    // Dans une implémentation complète, on utiliserait une table rate_limits ou Redis
    // Pour cette implémentation, nous allons utiliser une solution basée sur le localStorage
    // mais dans une application de production, cela devrait être géré côté serveur
    
    const key = `rate_limit_${identifier}`;
    const rateLimitData = localStorage.getItem(key);
    
    if (!rateLimitData) {
      // Première tentative, autoriser
      localStorage.setItem(key, JSON.stringify({
        attempts: 1,
        timestamp: Date.now(),
        window: windowMinutes * 60 * 1000 // Convertir en millisecondes
      }));
      return { allowed: true, attemptsLeft: maxAttempts - 1 };
    }
    
    const data = JSON.parse(rateLimitData);
    const now = Date.now();
    const windowEnd = data.timestamp + data.window;
    
    if (now > windowEnd) {
      // Fenêtre expirée, réinitialiser
      localStorage.setItem(key, JSON.stringify({
        attempts: 1,
        timestamp: now,
        window: data.window
      }));
      return { allowed: true, attemptsLeft: maxAttempts - 1 };
    }
    
    // Vérifier le nombre de tentatives
    if (data.attempts >= maxAttempts) {
      // Limite dépassée
      const resetTime = new Date(windowEnd);
      return { 
        allowed: false, 
        attemptsLeft: 0, 
        resetTime 
      };
    }
    
    // Incrémenter le compteur
    localStorage.setItem(key, JSON.stringify({
      ...data,
      attempts: data.attempts + 1
    }));
    
    return { 
      allowed: true, 
      attemptsLeft: maxAttempts - (data.attempts + 1) 
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // En cas d'erreur, autoriser par défaut pour ne pas bloquer les utilisateurs
    return { allowed: true, attemptsLeft: maxAttempts };
  }
};

// Fonction pour enregistrer une tentative de connexion échouée
export const logFailedAttempt = async (email: string, ip: string | null = null) => {
  try {
    const { error } = await supabase
      .from('admin_login_attempts')
      .insert({
        email: email,
        ip_address: ip || 'unknown',
        success: false,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error('Error logging failed attempt:', error);
    }
  } catch (error) {
    console.error('Error logging failed attempt:', error);
  }
};

// Fonction pour enregistrer une tentative de connexion réussie
export const logSuccessfulAttempt = async (email: string, userId: string, ip: string | null = null) => {
  try {
    const { error } = await supabase
      .from('admin_login_attempts')
      .insert({
        email: email,
        user_id: userId,
        ip_address: ip || 'unknown',
        success: true,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error('Error logging successful attempt:', error);
    }
  } catch (error) {
    console.error('Error logging successful attempt:', error);
  }
};

// Fonction pour vérifier si un utilisateur est bloqué
export const isUserBlocked = async (email: string): Promise<boolean> => {
  try {
    // Vérifier s'il y a des tentatives récentes infructueuses
    const { data, error } = await supabase
      .from('admin_login_attempts')
      .select('*')
      .eq('email', email)
      .eq('success', false)
      .gte('timestamp', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // 15 dernières minutes
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error checking user block status:', error);
      return false;
    }

    // Si plus de 5 tentatives infructueuses dans les 15 dernières minutes
    if (data && data.length >= 5) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking user block status:', error);
    return false;
  }
};

// Fonction pour nettoyer les anciennes tentatives de connexion
export const cleanupOldAttempts = async (olderThanMinutes: number = 60) => {
  try {
    const { error } = await supabase
      .from('admin_login_attempts')
      .delete()
      .lt('timestamp', new Date(Date.now() - olderThanMinutes * 60 * 1000).toISOString());

    if (error) {
      console.error('Error cleaning up old attempts:', error);
    }
  } catch (error) {
    console.error('Error cleaning up old attempts:', error);
  }
};

// Fonction pour valider un token CSRF
export const validateCSRFToken = (token: string): boolean => {
  // Dans une implémentation complète, on vérifierait le token contre une valeur stockée côté serveur
  // Pour cette implémentation, nous retournons true mais dans une application de production,
  // cela devrait être géré côté serveur
  return token.length > 0;
};

// Fonction pour générer un token CSRF
export const generateCSRFToken = (): string => {
  // Générer un token aléatoire pour la protection CSRF
  // Dans une application de production, cela devrait être géré côté serveur
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};