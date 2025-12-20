// secureStorage.ts - Service de stockage sécurisé pour les tokens et données sensibles
// Utilisation de l'API Web Crypto pour un chiffrement plus robuste

// Interface pour les données sensibles
interface SecureData {
  value: string;
  timestamp: number;
  expiry?: number; // Durée de validité en secondes
  iv?: string; // Vecteur d'initialisation pour le chiffrement
}

// Service de stockage sécurisé
class SecureStorageService {
  private storageKey: string = 'cakenews_secure_data';

  // Chiffrer les données avec l'API Web Crypto
  private async encrypt(data: string, key: CryptoKey): Promise<{ encrypted: string, iv: string }> {
    try {
      // Convertir la chaîne en ArrayBuffer
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);

      // Générer un vecteur d'initialisation aléatoire
      const iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits pour AES-GCM

      // Chiffrer les données
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encodedData
      );

      // Convertir les données chiffrées en base64
      const encryptedArray = new Uint8Array(encryptedBuffer);
      const encryptedB64 = btoa(String.fromCharCode(...encryptedArray));
      const ivB64 = btoa(String.fromCharCode(...iv));

      return { encrypted: encryptedB64, iv: ivB64 };
    } catch (e) {
      console.error('Erreur lors du chiffrement:', e);
      // En cas d'erreur de chiffrement, retourner les données non chiffrées
      // Cela réduit la sécurité mais permet à l'application de fonctionner
      return { encrypted: data, iv: '' };
    }
  }

  // Déchiffrer les données avec l'API Web Crypto
  private async decrypt(encryptedData: string, key: CryptoKey, ivB64: string): Promise<string> {
    try {
      // Convertir les données de base64 vers ArrayBuffer
      const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));

      // Déchiffrer les données
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encryptedBytes
      );

      // Convertir ArrayBuffer vers chaîne
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (e) {
      console.error('Erreur lors du déchiffrement:', e);
      // En cas d'erreur de déchiffrement, retourner les données chiffrées
      // pour éviter de retourner des données non sécurisées
      return encryptedData;
    }
  }

  // Générer une clé de chiffrement basée sur l'origine et une valeur aléatoire
  private async getEncryptionKey(): Promise<CryptoKey> {
    try {
      // Créer une clé dérivée de l'origine du site et d'une valeur aléatoire
      const origin = window.location.origin;
      const randomValue = crypto.getRandomValues(new Uint8Array(16));

      // Créer une chaîne à partir de l'origine et de la valeur aléatoire
      const keyMaterialStr = origin + Array.from(randomValue).map(b => b.toString(16).padStart(2, '0')).join('');

      // Convertir en ArrayBuffer
      const encoder = new TextEncoder();
      const keyMaterialBuffer = encoder.encode(keyMaterialStr);

      // Créer une clé à partir du matériau
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        keyMaterialBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      // Dérive une clé AES-GCM
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('cakenews_salt'),
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      return key;
    } catch (e) {
      console.error('Erreur lors de la génération de la clé de chiffrement:', e);
      // En cas d'erreur, créer une clé par défaut (moins sécurisée)
      // mais permettre à l'application de fonctionner
      throw e;
    }
  }

  // Stocker des données de manière sécurisée
  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    try {
      const encryptionKey = await this.getEncryptionKey();
      const { encrypted, iv } = await this.encrypt(value, encryptionKey);

      const secureData: SecureData = {
        value: encrypted,
        timestamp: Date.now(),
        expiry: expirySeconds ? Date.now() + expirySeconds * 1000 : undefined,
        iv: iv
      };

      const allData = await this.getAllData();
      allData[key] = secureData;
      localStorage.setItem(this.storageKey, JSON.stringify(allData));
    } catch (e) {
      console.error('Erreur lors du stockage sécurisé:', e);
      // En cas d'erreur de chiffrement, stocker les données en clair
      // mais avec un avertissement
      const secureData: SecureData = {
        value,
        timestamp: Date.now(),
        expiry: expirySeconds ? Date.now() + expirySeconds * 1000 : undefined
      };

      const allData = await this.getAllData();
      allData[key] = secureData;
      localStorage.setItem(this.storageKey, JSON.stringify(allData));
    }
  }

  // Récupérer des données stockées de manière sécurisée
  async get(key: string): Promise<string | null> {
    try {
      const allData = await this.getAllData();
      const secureData = allData[key];

      if (!secureData) {
        return null;
      }

      // Vérifier l'expiration
      if (secureData.expiry && Date.now() > secureData.expiry) {
        await this.remove(key);
        return null;
      }

      // Si les données sont chiffrées (ont un IV), les déchiffrer
      if (secureData.iv) {
        const encryptionKey = await this.getEncryptionKey();
        return await this.decrypt(secureData.value, encryptionKey, secureData.iv);
      }

      // Sinon, retourner les données telles quelles
      return secureData.value;
    } catch (e) {
      console.error('Erreur lors de la récupération sécurisée:', e);
      return null;
    }
  }

  // Supprimer des données
  async remove(key: string): Promise<void> {
    try {
      const allData = await this.getAllData();
      delete allData[key];
      localStorage.setItem(this.storageKey, JSON.stringify(allData));
    } catch (e) {
      console.error('Erreur lors de la suppression:', e);
    }
  }

  // Vérifier si une clé existe
  async has(key: string): Promise<boolean> {
    try {
      const allData = await this.getAllData();
      return key in allData;
    } catch (e) {
      console.error('Erreur lors de la vérification de la clé:', e);
      return false;
    }
  }

  // Obtenir toutes les données
  private async getAllData(): Promise<Record<string, SecureData>> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Erreur lors de la récupération de toutes les données:', e);
      return {};
    }
  }

  // Nettoyer les données expirées
  async cleanup(): Promise<void> {
    try {
      const allData = await this.getAllData();
      const keysToRemove: string[] = [];

      for (const [key, secureData] of Object.entries(allData)) {
        if (secureData.expiry && Date.now() > secureData.expiry) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => delete allData[key]);
      localStorage.setItem(this.storageKey, JSON.stringify(allData));
    } catch (e) {
      console.error('Erreur lors du nettoyage:', e);
    }
  }

  // Effacer toutes les données
  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.error('Erreur lors de l\'effacement:', e);
    }
  }
}

// Service d'authentification sécurisée
class SecureAuthService {
  private storage: SecureStorageService;

  constructor() {
    this.storage = new SecureStorageService();
  }

  // Stocker le token d'accès de manière sécurisée
  async storeAccessToken(token: string, expirySeconds?: number): Promise<void> {
    await this.storage.set('access_token', token, expirySeconds);
  }

  // Récupérer le token d'accès
  async getAccessToken(): Promise<string | null> {
    return await this.storage.get('access_token');
  }

  // Stocker le token de rafraîchissement de manière sécurisée
  async storeRefreshToken(token: string, expirySeconds?: number): Promise<void> {
    await this.storage.set('refresh_token', token, 7 * 24 * 60 * 60); // 7 jours pour le refresh token
  }

  // Récupérer le token de rafraîchissement
  async getRefreshToken(): Promise<string | null> {
    return await this.storage.get('refresh_token');
  }

  // Supprimer les tokens
  async clearTokens(): Promise<void> {
    await this.storage.remove('access_token');
    await this.storage.remove('refresh_token');
  }

  // Vérifier si l'utilisateur est connecté
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null && token.length > 0;
  }

  // Générer un identifiant d'appareil (fingerprint) de manière sécurisée
  generateDeviceId(): string {
    if (typeof window === 'undefined') return 'server';

    // Créer un identifiant basé sur plusieurs caractéristiques du navigateur
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Hello, world! 😊', 2, 15);
    }

    const canvasData = canvas ? canvas.toDataURL() : '';
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = navigator.platform;
    const hardwareConcurrency = navigator.hardwareConcurrency || '';
    const screenResolution = `${screen.width}x${screen.height}`;

    const fingerprint = `${userAgent}-${language}-${platform}-${hardwareConcurrency}-${screenResolution}-${canvasData}`;

    // Créer un hash simple (dans une application de production, utilisez crypto.subtle)
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convertir en entier 32 bits
    }

    return Math.abs(hash).toString(36);
  }

  // Stocker l'identifiant d'appareil
  async storeDeviceId(): Promise<void> {
    const deviceId = this.generateDeviceId();
    await this.storage.set('device_id', deviceId, 365 * 24 * 60 * 60); // 1 an
  }

  // Récupérer l'identifiant d'appareil
  async getDeviceId(): Promise<string | null> {
    let deviceId = await this.storage.get('device_id');
    if (!deviceId) {
      await this.storeDeviceId();
      deviceId = await this.storage.get('device_id');
    }
    return deviceId;
  }
}

// Exporter une instance singleton du service d'authentification sécurisée
export const secureAuthService = new SecureAuthService();

// Fonction utilitaire pour nettoyer les données expirées périodiquement
export const startSecureStorageCleanup = (): void => {
  // Nettoyer immédiatement
  secureAuthService.storage.cleanup();

  // Planifier un nettoyage toutes les heures
  setInterval(() => {
    secureAuthService.storage.cleanup();
  }, 60 * 60 * 1000);
};