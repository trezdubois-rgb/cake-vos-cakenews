// utils/totp.ts
// Implémentation simplifiée de TOTP pour le navigateur

// Fonction pour générer un secret TOTP aléatoire
export const generateTOTPSecret = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
};

// Fonction pour générer un code TOTP basé sur le secret et l'heure
export const generateTOTPCode = (secret: string, period: number = 30): string => {
  const epoch = Math.floor(Date.now() / 1000);
  let timeValue = Math.floor(epoch / period);
  const timeBuffer = new Uint8Array(8);
  
  // Convertir le temps en buffer big-endian
  for (let i = 8; i--; ) {
    timeBuffer[i] = timeValue & 0xff;
    timeValue = Math.floor(timeValue / 0x100);
  }

  // Pour une implémentation complète, nous aurions besoin de la fonction HMAC-SHA1
  const combined = secret + timeValue.toString();
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  
  const code = Math.abs(hash) % 1000000;
  return code.toString().padStart(6, '0');
};

// Fonction pour valider un code TOTP
export const verifyTOTPCode = (secret: string, code: string, period: number = 30, _window: number = 1): boolean => {
  if (!/^\d{6}$/.test(code)) {
    return false;
  }

  if (generateTOTPCode(secret, period) === code) {
    return true;
  }

  return false;
};

// Fonction pour générer une URL QR pour l'application d'authentification
export const generateTOTPQRUrl = (secret: string, accountName: string, issuer: string = 'Cakenews'): string => {
  const encodedAccountName = encodeURIComponent(accountName);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${issuer}:${encodedAccountName}?secret=${secret}&issuer=${encodedIssuer}`;
};
