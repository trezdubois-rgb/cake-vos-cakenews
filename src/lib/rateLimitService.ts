// rateLimitService.ts - Service de gestion du rate limiting (version sécurisée)
// Utilisation de localStorage avec des vérifications de sécurité renforcées

interface RateLimitResult {
  allowed: boolean;
  attemptsLeft: number;
  resetTime?: Date;
  message?: string;
}

class RateLimitService {
  private readonly windowMs: number;
  private readonly maxAttempts: number;
  private readonly storageKey: string;

  constructor(windowMinutes: number = 15, maxAttempts: number = 5, action: string = 'general') {
    this.windowMs = windowMinutes * 60 * 1000; // Convertir en millisecondes
    this.maxAttempts = maxAttempts;
    this.storageKey = `rate_limit_${action}`;
  }

  // Vérifier si une action est autorisée selon les limites de débit
  checkLimit(identifier: string): RateLimitResult {
    try {
      // Générer un identifiant unique pour la combinaison identifiant-action
      const key = `${this.storageKey}_${identifier}`;

      // Récupérer les tentatives récentes du localStorage
      const stored = localStorage.getItem(key);
      const attempts: number[] = stored ? JSON.parse(stored) : [];

      // Filtrer les tentatives dans la fenêtre de temps
      const now = Date.now();
      const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);

      if (recentAttempts.length >= this.maxAttempts) {
        // Limite dépassée
        const oldestAttempt = recentAttempts[0];
        const resetTime = new Date(oldestAttempt + this.windowMs);

        return {
          allowed: false,
          attemptsLeft: 0,
          resetTime,
          message: `Trop de tentatives. Réessayez après ${resetTime.toLocaleTimeString()}`
        };
      }

      // Autoriser l'action et enregistrer la tentative
      recentAttempts.push(now);
      localStorage.setItem(key, JSON.stringify(recentAttempts));

      return {
        allowed: true,
        attemptsLeft: this.maxAttempts - recentAttempts.length
      };
    } catch (error) {
      console.error('Erreur dans le service de rate limiting:', error);
      // En cas d'erreur (par exemple, localStorage indisponible), on autorise l'action
      // mais on log l'erreur pour investigation
      return { allowed: true, attemptsLeft: this.maxAttempts };
    }
  }

  // Effacer les tentatives pour un identifiant spécifique
  clearLimit(identifier: string): void {
    try {
      const key = `${this.storageKey}_${identifier}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression du rate limit:', error);
    }
  }

  // Nettoyer les anciennes entrées de rate limiting
  cleanup(): void {
    try {
      const now = Date.now();
      const keysToRemove: string[] = [];

      // Parcourir toutes les clés du localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storageKey)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const attempts: number[] = JSON.parse(stored);
              // Filtrer les tentatives dans la fenêtre de temps
              const recentAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs * 2); // 2 fois la fenêtre pour le nettoyage

              if (recentAttempts.length === 0) {
                keysToRemove.push(key);
              } else if (recentAttempts.length !== attempts.length) {
                // Mettre à jour avec seulement les tentatives récentes
                localStorage.setItem(key, JSON.stringify(recentAttempts));
              }
            } catch (e) {
              // Si le parsing échoue, supprimer la clé corrompue
              keysToRemove.push(key);
            }
          }
        }
      }

      // Supprimer les clés inutiles
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Erreur lors du nettoyage des rate limits:', error);
    }
  }
}

// Service de rate limiting pour les tentatives de connexion
class LoginRateLimitService {
  private service: RateLimitService;

  constructor() {
    this.service = new RateLimitService(15, 5, 'login'); // 5 tentatives toutes les 15 minutes
  }

  // Vérifier si une connexion est autorisée
  checkLoginLimit(email: string): RateLimitResult {
    return this.service.checkLimit(email.toLowerCase());
  }

  // Effacer le rate limit pour un email (après une connexion réussie)
  clearLimit(email: string): void {
    this.service.clearLimit(email.toLowerCase());
  }

  // Nettoyer les anciennes entrées
  cleanup(): void {
    this.service.cleanup();
  }
}

// Service de rate limiting pour les tentatives d'inscription
class SignupRateLimitService {
  private service: RateLimitService;

  constructor() {
    this.service = new RateLimitService(60, 3, 'signup'); // 3 tentatives d'inscription par heure
  }

  // Vérifier si une inscription est autorisée
  checkSignupLimit(email: string): RateLimitResult {
    return this.service.checkLimit(email.toLowerCase());
  }

  // Effacer le rate limit pour un email (après une inscription réussie)
  clearLimit(email: string): void {
    this.service.clearLimit(email.toLowerCase());
  }

  // Nettoyer les anciennes entrées
  cleanup(): void {
    this.service.cleanup();
  }
}

// Exporter des instances singleton
export const loginRateLimitService = new LoginRateLimitService();
export const signupRateLimitService = new SignupRateLimitService();

// Fonction utilitaire pour planifier le nettoyage régulier
export const startRateLimitCleanup = (): void => {
  // Nettoyer immédiatement
  loginRateLimitService.cleanup();
  signupRateLimitService.cleanup();

  // Planifier un nettoyage toutes les 30 minutes
  setInterval(() => {
    loginRateLimitService.cleanup();
    signupRateLimitService.cleanup();
  }, 30 * 60 * 1000);
};

// Service de journalisation des tentatives de connexion (pour surveillance)
class LoginAttemptLogger {
  private storageKey = 'login_attempts';

  logAttempt(email: string, success: boolean, timestamp: number = Date.now()) {
    try {
      const key = `${this.storageKey}_${email.toLowerCase()}`;
      const stored = localStorage.getItem(key);
      const attempts: { timestamp: number; success: boolean }[] = stored ? JSON.parse(stored) : [];

      // Garder seulement les 50 dernières tentatives pour limiter l'utilisation du stockage
      const recentAttempts = [...attempts, { timestamp, success }].slice(-50);

      localStorage.setItem(key, JSON.stringify(recentAttempts));
    } catch (error) {
      console.error('Erreur lors de la journalisation de la tentative de connexion:', error);
    }
  }

  getRecentAttempts(email: string, minutes: number = 15): { timestamp: number; success: boolean }[] {
    try {
      const key = `${this.storageKey}_${email.toLowerCase()}`;
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const attempts: { timestamp: number; success: boolean }[] = JSON.parse(stored);
      const now = Date.now();
      const cutoff = now - (minutes * 60 * 1000);

      return attempts.filter(attempt => attempt.timestamp >= cutoff);
    } catch (error) {
      console.error('Erreur lors de la récupération des tentatives de connexion:', error);
      return [];
    }
  }

  // Vérifier si un utilisateur a été bloqué (trop de tentatives échouées récentes)
  isUserBlocked(email: string): boolean {
    const recentAttempts = this.getRecentAttempts(email);
    const recentFailedAttempts = recentAttempts.filter(attempt => !attempt.success);

    // Bloquer si plus de 5 échecs en 15 minutes
    return recentFailedAttempts.length >= 5;
  }
}

export const loginAttemptLogger = new LoginAttemptLogger();