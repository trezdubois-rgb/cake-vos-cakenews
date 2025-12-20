import { useState, useEffect } from 'react';
import { generateFingerprint } from '@/lib/deviceFingerprint';

interface DeviceToken {
  token: string;
  createdAt: string;
  lastUsed: string;
  isValid: boolean;
}

export const useDeviceFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [deviceToken, setDeviceToken] = useState<DeviceToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le token d'appareil depuis le localStorage
  useEffect(() => {
    const loadDeviceToken = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('device_token');
        
        if (token) {
          try {
            const parsedToken = JSON.parse(token) as DeviceToken;
            setDeviceToken(parsedToken);
          } catch (e) {
            console.error('Failed to parse device token:', e);
            localStorage.removeItem('device_token');
          }
        }

        // Générer le fingerprint
        const generatedFingerprint = await generateFingerprint();
        setFingerprint(generatedFingerprint);
      } catch (err) {
        setError('Failed to generate device fingerprint');
        console.error('Fingerprint generation error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDeviceToken();
  }, []);

  // Sauvegarder le token d'appareil dans le localStorage
  const saveDeviceToken = (token: string) => {
    const deviceToken: DeviceToken = {
      token,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      isValid: true,
    };
    
    setDeviceToken(deviceToken);
    localStorage.setItem('device_token', JSON.stringify(deviceToken));
  };

  // Mettre à jour le dernier usage du token
  const updateLastUsed = () => {
    if (deviceToken) {
      const updatedToken: DeviceToken = {
        ...deviceToken,
        lastUsed: new Date().toISOString(),
      };
      
      setDeviceToken(updatedToken);
      localStorage.setItem('device_token', JSON.stringify(updatedToken));
    }
  };

  // Supprimer le token d'appareil
  const clearDeviceToken = () => {
    setDeviceToken(null);
    localStorage.removeItem('device_token');
  };

  return {
    fingerprint,
    deviceToken,
    loading,
    error,
    saveDeviceToken,
    updateLastUsed,
    clearDeviceToken,
  };
};