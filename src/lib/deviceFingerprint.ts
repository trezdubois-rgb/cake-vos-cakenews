// deviceFingerprint.ts
export interface DeviceFingerprint {
  browser: string;
  os: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  platform: string;
  cookieEnabled: boolean;
  webglVendor: string;
  webglRenderer: string;
  audioContextFingerprint: string;
}

export const generateFingerprint = async (): Promise<string> => {
  const fingerprintData: DeviceFingerprint = {
    browser: getBrowser(),
    os: getOS(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    deviceMemory: (navigator as any).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    webglVendor: getWebGLVendor(),
    webglRenderer: getWebGLRenderer(),
    audioContextFingerprint: getAudioContextFingerprint(),
  };

  const fingerprintString = JSON.stringify(fingerprintData);
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const getBrowser = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
  return 'Unknown';
};

const getOS = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Win')) return 'Windows';
  if (userAgent.includes('Mac')) return 'MacOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
};

const getWebGLVendor = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'Unknown';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'Unknown';
    return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
  } catch (e) {
    return 'Unknown';
  }
};

const getWebGLRenderer = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'Unknown';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'Unknown';
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
  } catch (e) {
    return 'Unknown';
  }
};

const getAudioContextFingerprint = (): string => {
  try {
    // This is a simplified version - a real implementation would extract more detailed audio fingerprinting
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return `${audioContext.sampleRate}`;
  } catch (e) {
    return 'Unknown';
  }
};