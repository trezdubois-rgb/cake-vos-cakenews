// secureStorage.ts - Service de stockage sécurisé pour les tokens et données sensibles

interface SecureData {
  value: string;
  timestamp: number;
  expiry?: number;
  iv?: string;
}

class SecureStorageService {
  private storageKey: string = 'cakenews_secure_data';

  private async encrypt(data: string, key: CryptoKey): Promise<{ encrypted: string, iv: string }> {
    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedData
      );
      const encryptedArray = new Uint8Array(encryptedBuffer);
      const encryptedB64 = btoa(String.fromCharCode(...encryptedArray));
      const ivB64 = btoa(String.fromCharCode(...iv));
      return { encrypted: encryptedB64, iv: ivB64 };
    } catch {
      return { encrypted: data, iv: '' };
    }
  }

  private async decrypt(encryptedData: string, key: CryptoKey, ivB64: string): Promise<string> {
    try {
      const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encryptedBytes
      );
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch {
      return encryptedData;
    }
  }

  private async getEncryptionKey(): Promise<CryptoKey> {
    const origin = window.location.origin;
    const randomValue = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterialStr = origin + Array.from(randomValue).map(b => b.toString(16).padStart(2, '0')).join('');
    const encoder = new TextEncoder();
    const keyMaterialBuffer = encoder.encode(keyMaterialStr);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      keyMaterialBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
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
  }

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
    } catch {
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

  async get(key: string): Promise<string | null> {
    try {
      const allData = await this.getAllData();
      const secureData = allData[key];
      if (!secureData) return null;
      if (secureData.expiry && Date.now() > secureData.expiry) {
        await this.remove(key);
        return null;
      }
      if (secureData.iv) {
        const encryptionKey = await this.getEncryptionKey();
        return await this.decrypt(secureData.value, encryptionKey, secureData.iv);
      }
      return secureData.value;
    } catch {
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const allData = await this.getAllData();
      delete allData[key];
      localStorage.setItem(this.storageKey, JSON.stringify(allData));
    } catch {
      // Silently fail
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const allData = await this.getAllData();
      return key in allData;
    } catch {
      return false;
    }
  }

  private async getAllData(): Promise<Record<string, SecureData>> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

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
    } catch {
      // Silently fail
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Silently fail
    }
  }
}

class SecureAuthService {
  private storage: SecureStorageService;

  constructor() {
    this.storage = new SecureStorageService();
  }

  async storeAccessToken(token: string, expirySeconds?: number): Promise<void> {
    await this.storage.set('access_token', token, expirySeconds);
  }

  async getAccessToken(): Promise<string | null> {
    return await this.storage.get('access_token');
  }

  async storeRefreshToken(token: string): Promise<void> {
    await this.storage.set('refresh_token', token, 7 * 24 * 60 * 60);
  }

  async getRefreshToken(): Promise<string | null> {
    return await this.storage.get('refresh_token');
  }

  async clearTokens(): Promise<void> {
    await this.storage.remove('access_token');
    await this.storage.remove('refresh_token');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null && token.length > 0;
  }

  generateDeviceId(): string {
    if (typeof window === 'undefined') return 'server';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Hello, world!', 2, 15);
    }
    const canvasData = canvas ? canvas.toDataURL() : '';
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const platform = navigator.platform;
    const hardwareConcurrency = navigator.hardwareConcurrency || '';
    const screenResolution = `${screen.width}x${screen.height}`;
    const fingerprint = `${userAgent}-${language}-${platform}-${hardwareConcurrency}-${screenResolution}-${canvasData}`;
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  async storeDeviceId(): Promise<void> {
    const deviceId = this.generateDeviceId();
    await this.storage.set('device_id', deviceId, 365 * 24 * 60 * 60);
  }

  async getDeviceId(): Promise<string | null> {
    let deviceId = await this.storage.get('device_id');
    if (!deviceId) {
      await this.storeDeviceId();
      deviceId = await this.storage.get('device_id');
    }
    return deviceId;
  }

  // Expose cleanup for external use
  async cleanup(): Promise<void> {
    await this.storage.cleanup();
  }
}

export const secureAuthService = new SecureAuthService();

export const startSecureStorageCleanup = (): void => {
  secureAuthService.cleanup();
  setInterval(() => {
    secureAuthService.cleanup();
  }, 60 * 60 * 1000);
};
