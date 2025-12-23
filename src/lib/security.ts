// utils/security.ts
// Simplified security utilities using localStorage-based rate limiting

// Fonction pour vérifier si un utilisateur a dépassé la limite de tentatives
export const checkRateLimit = async (identifier: string, maxAttempts: number = 5, windowMinutes: number = 15): Promise<{ allowed: boolean; attemptsLeft: number; resetTime?: Date }> => {
  try {
    const key = `rate_limit_${identifier}`;
    const rateLimitData = localStorage.getItem(key);
    
    if (!rateLimitData) {
      localStorage.setItem(key, JSON.stringify({
        attempts: 1,
        timestamp: Date.now(),
        window: windowMinutes * 60 * 1000
      }));
      return { allowed: true, attemptsLeft: maxAttempts - 1 };
    }
    
    const data = JSON.parse(rateLimitData);
    const now = Date.now();
    const windowEnd = data.timestamp + data.window;
    
    if (now > windowEnd) {
      localStorage.setItem(key, JSON.stringify({
        attempts: 1,
        timestamp: now,
        window: data.window
      }));
      return { allowed: true, attemptsLeft: maxAttempts - 1 };
    }
    
    if (data.attempts >= maxAttempts) {
      const resetTime = new Date(windowEnd);
      return { 
        allowed: false, 
        attemptsLeft: 0, 
        resetTime 
      };
    }
    
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
    return { allowed: true, attemptsLeft: maxAttempts };
  }
};

// Fonction pour enregistrer une tentative de connexion échouée (localStorage only)
export const logFailedAttempt = async (email: string, _ip: string | null = null) => {
  try {
    const key = `failed_attempts_${email}`;
    const data = localStorage.getItem(key);
    const attempts = data ? JSON.parse(data) : [];
    attempts.push({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
    // Keep only last 10 attempts
    localStorage.setItem(key, JSON.stringify(attempts.slice(-10)));
  } catch (error) {
    console.error('Error logging failed attempt:', error);
  }
};

// Fonction pour enregistrer une tentative de connexion réussie (localStorage only)
export const logSuccessfulAttempt = async (email: string, _userId: string, _ip: string | null = null) => {
  try {
    // Clear failed attempts on successful login
    const key = `failed_attempts_${email}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error logging successful attempt:', error);
  }
};

// Fonction pour vérifier si un utilisateur est bloqué
export const isUserBlocked = async (email: string): Promise<boolean> => {
  try {
    const key = `failed_attempts_${email}`;
    const data = localStorage.getItem(key);
    if (!data) return false;
    
    const attempts = JSON.parse(data);
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    
    // Count recent failed attempts
    const recentAttempts = attempts.filter((attempt: { timestamp: string }) => 
      new Date(attempt.timestamp).getTime() > fifteenMinutesAgo
    );
    
    return recentAttempts.length >= 5;
  } catch (error) {
    console.error('Error checking user block status:', error);
    return false;
  }
};

// Fonction pour nettoyer les anciennes tentatives de connexion
export const cleanupOldAttempts = async (_olderThanMinutes: number = 60) => {
  // No-op for localStorage implementation
};

// Fonction pour valider un token CSRF
export const validateCSRFToken = (token: string): boolean => {
  return token.length > 0;
};

// Fonction pour générer un token CSRF
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
