import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  font_heading: string;
  font_body: string;
  border_radius: string;
  theme_mode: "light" | "dark" | "system";
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  loading: boolean;
}

const defaultTheme: ThemeSettings = {
  primary_color: "#3B82F6",
  secondary_color: "#EC4899",
  font_heading: "Inter",
  font_body: "Inter",
  border_radius: "0.5rem",
  theme_mode: "system",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hex to HSL conversion
function hexToHsl(hex: string): string | null {
  hex = hex.replace(/^#/, "");
  
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return null;
  }
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Load Google Fonts dynamically
function loadGoogleFont(fontFamily: string) {
  const fontMap: Record<string, string> = {
    "Inter": "Inter:wght@400;500;600;700",
    "Roboto": "Roboto:wght@400;500;700",
    "Playfair Display": "Playfair+Display:wght@400;600;700",
    "Montserrat": "Montserrat:wght@400;500;600;700",
    "Open Sans": "Open+Sans:wght@400;500;600;700",
    "Lato": "Lato:wght@400;700",
  };
  
  const fontQuery = fontMap[fontFamily];
  if (!fontQuery) return;
  
  const existingLink = document.querySelector(`link[href*="${fontQuery}"]`);
  if (existingLink) return;
  
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
  document.head.appendChild(link);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setTheme({ ...defaultTheme, ...parsed });
      } catch (e) {
        console.warn("Failed to parse saved theme");
      }
    }
    applyTheme(theme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    const updatedTheme = { ...theme, ...newSettings };
    setTheme(updatedTheme);
    localStorage.setItem('app-theme', JSON.stringify(updatedTheme));
  };

  const applyTheme = (settings: ThemeSettings) => {
    const root = document.documentElement;

    const primaryHsl = hexToHsl(settings.primary_color);
    const secondaryHsl = hexToHsl(settings.secondary_color);

    if (primaryHsl) {
      root.style.setProperty("--primary", primaryHsl);
    }
    
    if (secondaryHsl) {
      root.style.setProperty("--secondary", secondaryHsl);
    }

    // Load and apply fonts
    loadGoogleFont(settings.font_heading);
    loadGoogleFont(settings.font_body);
    
    root.style.setProperty("--font-heading", `"${settings.font_heading}", serif`);
    root.style.setProperty("--font-body", `"${settings.font_body}", sans-serif`);

    // Apply border radius
    root.style.setProperty("--radius", settings.border_radius);

    // Apply Theme Mode
    root.classList.remove("light", "dark");
    if (settings.theme_mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme_mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}