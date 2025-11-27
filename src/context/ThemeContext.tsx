import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  updateTheme: (newSettings: Partial<ThemeSettings>) => Promise<void>;
  loading: boolean;
  error: string | null;
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

// Improved Hex to HSL conversion with support for short formats
function hexToHsl(hex: string): string | null {
  // Remove # if present
  hex = hex.replace(/^#/, "");
  
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    console.warn(`Invalid hex color: #${hex}`);
    return null;
  }
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
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

// Calculate relative luminance for WCAG contrast ratio
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = rgb.map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Helper to convert hex to RGB array
function hexToRgb(hex: string): [number, number, number] | null {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null;
  
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];
}

// Calculate WCAG contrast ratio between two colors
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG AA standard (4.5:1 for normal text)
function meetsWCAG(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
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
  
  // Check if already loaded
  const existingLink = document.querySelector(`link[href*="${fontQuery}"]`);
  if (existingLink) return;
  
  // Create and append <link> element
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
  document.head.appendChild(link);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const fetchTheme = async () => {
    try {
      // Check if Supabase client is configured before making request
      if (!supabase) {
        console.warn("Supabase client not initialized, using default theme");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .single();

      if (error) {
        // Table doesn't exist or other DB error
        if (error.code === 'PGRST116') {
          // No rows - use defaults silently
          console.info("No theme settings found, using defaults");
        } else if (error.message && error.message.includes('relation "public.theme_settings" does not exist')) {
          // Table not created yet
          setError("La table de thème n'existe pas encore. Utilisation des valeurs par défaut.");
          toast.warning("Thème: Table non initialisée, utilisation des valeurs par défaut", {
            description: "Exécutez la migration Supabase pour activer la persistance."
          });
        } else {
          // Log other errors but don't crash app
          console.warn("Theme fetch error:", error);
        }
      } else if (data) {
        setTheme(data);
        setError(null);
      }
    } catch (e: any) {
      console.error("Error fetching theme:", e);
      // Don't set user-facing error for network issues to avoid scary red banners on initial load
      // just log to console and use defaults
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (newSettings: Partial<ThemeSettings>) => {
    try {
      // Optimistic update
      const updatedTheme = { ...theme, ...newSettings };
      setTheme(updatedTheme);

      const { error } = await supabase
        .from("theme_settings")
        .update(newSettings)
        .eq("id", 1);

      if (error) {
        if (error.message.includes('relation "public.theme_settings" does not exist')) {
          toast.error("Table de thème manquante", {
            description: "Exécutez 'npx supabase migration up' pour créer la table."
          });
        } else {
          throw error;
        }
      } else {
        toast.success("Thème mis à jour avec succès");
        setError(null);
      }
    } catch (error: any) {
      console.error("Error updating theme:", error);
      toast.error("Erreur lors de la mise à jour du thème", {
        description: error.message
      });
      // Revert on error
      fetchTheme();
    }
  };

  const applyTheme = (settings: ThemeSettings) => {
    const root = document.documentElement;

    // Apply colors with validation
    const primaryHsl = hexToHsl(settings.primary_color);
    const secondaryHsl = hexToHsl(settings.secondary_color);

    if (primaryHsl) {
      root.style.setProperty("--primary", primaryHsl);
    } else {
      console.warn("Invalid primary color, using default");
      root.style.setProperty("--primary", hexToHsl(defaultTheme.primary_color)!);
    }
    
    if (secondaryHsl) {
      root.style.setProperty("--secondary", secondaryHsl);
    } else {
      console.warn("Invalid secondary color, using default");
      root.style.setProperty("--secondary", hexToHsl(defaultTheme.secondary_color)!);
    }

    // WCAG Contrast Validation
    const backgroundColor = settings.theme_mode === "dark" ? "#000000" : "#FFFFFF";
    const contrastRatio = getContrastRatio(settings.primary_color, backgroundColor);
    
    if (contrastRatio < 4.5) {
      console.warn(`Low contrast ratio: ${contrastRatio.toFixed(2)}:1 (WCAG recommends ≥4.5:1)`);
      toast.warning("Contraste faible détecté", {
        description: `Ratio ${contrastRatio.toFixed(1)}:1. WCAG recommande ≥4.5:1 pour l'accessibilité.`,
        duration: 5000,
      });
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
    <ThemeContext.Provider value={{ theme, updateTheme, loading, error }}>
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
