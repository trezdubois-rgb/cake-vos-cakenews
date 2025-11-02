import React, { createContext, useState, useEffect } from 'react';

interface ThemeSettings {
  // Layout
  layout: 'boxed' | 'fullwidth';
  sidebarPosition: 'left' | 'right' | 'both' | 'none';
  stickyHeader: boolean;
  stickySidebar: boolean;
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  
  // Typography
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // Features
  infiniteScroll: boolean;
  autoLoadNext: boolean;
  lazyLoad: boolean;
  
  // Ads & Monetization
  adBlockerDetection: boolean;
  exitIntentPopup: boolean;
  slideInAd: boolean;
  
  // Social & Engagement
  reactions: boolean;
  badges: boolean;
  pointsSystem: boolean;
  voting: boolean;
  
  // NSFW
  nsfwEnabled: boolean;
  nsfwBlur: boolean;
  
  // Shop & Affiliate
  shopThePost: boolean;
  shoppableImages: boolean;
  affiliateMarketing: boolean;
  
  // Gallery & Media
  lightboxGallery: boolean;
  videoPlaylist: boolean;
  watermarks: boolean;
  hotlinkProtection: boolean;
  
  // Interactive Content
  quizzes: boolean;
  polls: boolean;
  lists: boolean;
  
  // Header & Navigation
  headerStyle: 'default' | 'centered' | 'minimal' | 'mega-menu';
  offCanvasMenu: boolean;
  ajaxSearch: boolean;
  
  // Footer & Widgets
  footerColumns: number;
  stickyWidgets: boolean;
  socialWidgets: boolean;
  
  // Performance
  imageOptimization: boolean;
  imageSizes: {
    thumbnail: { width: number; height: number };
    medium: { width: number; height: number };
    large: { width: number; height: number };
  };
}

// DEFAULT PHILOSOPHY: All advanced features DISABLED by default
// Features must be explicitly enabled through admin settings
const defaultThemeSettings: ThemeSettings = {
  layout: 'fullwidth',
  sidebarPosition: 'none', // No sidebars by default - clean mobile-first
  stickyHeader: true, // Keep header sticky for better UX
  stickySidebar: false,
  primaryColor: '#ff005c',
  secondaryColor: '#171717',
  textColor: '#171717',
  backgroundColor: '#ffffff',
  fontFamily: 'Open Sans',
  fontSize: 'medium',
  infiniteScroll: true, // Good for mobile UX
  autoLoadNext: false,
  lazyLoad: true, // Performance optimization
  adBlockerDetection: false, // Disabled by default
  exitIntentPopup: false, // Disabled by default
  slideInAd: false,
  reactions: false, // Disabled by default
  badges: false, // Disabled by default
  pointsSystem: false, // Disabled by default
  voting: false, // Disabled by default
  nsfwEnabled: false,
  nsfwBlur: true,
  shopThePost: false,
  shoppableImages: false,
  affiliateMarketing: false,
  lightboxGallery: false, // Disabled by default
  videoPlaylist: false, // Disabled by default
  watermarks: false,
  hotlinkProtection: false,
  quizzes: false, // Disabled by default
  polls: false, // Disabled by default
  lists: false, // Disabled by default
  headerStyle: 'default', // Simple header
  offCanvasMenu: false, // Disabled by default
  ajaxSearch: false, // Disabled by default
  footerColumns: 1, // Minimal footer
  stickyWidgets: false, // Disabled by default
  socialWidgets: false, // Disabled by default
  imageOptimization: true, // Keep for performance
  imageSizes: {
    thumbnail: { width: 150, height: 150 },
    medium: { width: 300, height: 200 },
    large: { width: 650, height: 400 }
  }
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('cakenews-theme-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultThemeSettings, ...parsed });
      } catch (_error) {
        console.error('Failed to load theme settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('cakenews-theme-settings', JSON.stringify(updatedSettings));
    
    // Apply CSS custom properties
    applyThemeStyles(updatedSettings);
  };

  const resetSettings = () => {
    setSettings(defaultThemeSettings);
    localStorage.setItem('cakenews-theme-settings', JSON.stringify(defaultThemeSettings));
    applyThemeStyles(defaultThemeSettings);
  };

  const applyThemeStyles = (themeSettings: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    root.style.setProperty('--text-color', themeSettings.textColor);
    root.style.setProperty('--background-color', themeSettings.backgroundColor);
    root.style.setProperty('--font-family', themeSettings.fontFamily);
    root.style.setProperty('--font-size', themeSettings.fontSize);
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetSettings, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};