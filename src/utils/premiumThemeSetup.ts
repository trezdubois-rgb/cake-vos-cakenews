/**
 * Utilitaire de configuration rapide pour le thème premium CakeNews
 * Ce fichier contient des fonctions utilitaires pour configurer et personnaliser le thème premium
 */

import { PremiumThemeConfig } from "@/components/PremiumTheme";

/**
 * Presets de thème prédéfinis
 */
export const themePresets = {
  /**
   * Preset Viral - Optimisé pour la viralité et l'engagement
   */
  viral: {
    name: "Viral",
    header: {
      style: "viral" as const,
      sticky: true,
      transparent: true,
      logo: {
        type: "image" as const,
        text: "CakeNews",
        imageUrl: "/logo-viral.png",
      },
      navigation: {
        type: "mega" as const,
        items: [
          { label: "Tendance", href: "/trending", icon: "🔥" },
          { label: "Viral", href: "/viral", icon: "🚀" },
          { label: "Buzz", href: "/buzz", icon: "⚡" },
        ],
      },
      search: {
        enabled: true,
        type: "full-modal" as const,
        placeholder: "Découvrez le buzz du moment...",
      },
      ctaButtons: [
        { label: "Créer Viral", href: "/create", variant: "primary" as const },
        { label: "Partager", href: "/share", variant: "secondary" as const },
      ],
    },
    widgets: [
      {
        id: "social-share",
        title: "Partage Social",
        enabled: true,
        position: "right" as const,
        type: "social-share" as const,
      },
      {
        id: "viral-counter",
        title: "Compteur Viral",
        enabled: true,
        position: "left" as const,
        type: "viral-counter" as const,
      },
      {
        id: "reactions",
        title: "Réactions",
        enabled: true,
        position: "right" as const,
        type: "reactions" as const,
      },
    ],
    layout: {
      sidebar: {
        left: true,
        right: true,
        sticky: true,
        width: "80",
      },
      content: {
        maxWidth: "7xl",
      },
    },
    colors: {
      primary: "#FF6B35",
      secondary: "#F7931E",
      accent: "#FFD23F",
      background: "#0F0F23",
      surface: "#1A1A2E",
    },
  },

  /**
   * Preset Gaming - Style gaming moderne
   */
  gaming: {
    name: "Gaming",
    header: {
      style: "gaming" as const,
      sticky: true,
      transparent: false,
      logo: {
        type: "both" as const,
        text: "CakeNews",
        imageUrl: "/logo-gaming.png",
      },
      navigation: {
        type: "horizontal" as const,
        items: [
          { label: "Esports", href: "/esports", icon: "🎮" },
          { label: "Gaming", href: "/gaming", icon: "🎯" },
          { label: "Reviews", href: "/reviews", icon: "⭐" },
        ],
      },
      search: {
        enabled: true,
        type: "icon" as const,
        placeholder: "Rechercher dans le gaming...",
      },
      gamification: {
        enabled: true,
        showLevel: true,
        showPoints: true,
        showBadges: true,
      },
    },
    widgets: [
      {
        id: "gamification",
        title: "Gamification",
        enabled: true,
        position: "left" as const,
        type: "gamification" as const,
      },
      {
        id: "video-playlist",
        title: "Videos Gaming",
        enabled: true,
        position: "right" as const,
        type: "video-playlist" as const,
      },
    ],
    layout: {
      sidebar: {
        left: true,
        right: true,
        sticky: true,
        width: "72",
      },
      content: {
        maxWidth: "6xl",
      },
    },
    colors: {
      primary: "#00F5FF",
      secondary: "#FF00FF",
      accent: "#FFFF00",
      background: "#0A0A0A",
      surface: "#1A1A1A",
    },
  },

  /**
   * Preset Magazine - Style publication moderne
   */
  magazine: {
    name: "Magazine",
    header: {
      style: "magazine" as const,
      sticky: true,
      transparent: false,
      logo: {
        type: "text" as const,
        text: "CakeNews",
        fontSize: "2xl",
        fontWeight: "bold",
      },
      navigation: {
        type: "mega" as const,
        items: [
          { label: "Actualité", href: "/news", icon: "📰" },
          { label: "Culture", href: "/culture", icon: "🎭" },
          { label: "Tech", href: "/tech", icon: "💻" },
          { label: "Style", href: "/style", icon: "✨" },
        ],
      },
      search: {
        enabled: true,
        type: "bar" as const,
        placeholder: "Explorer le magazine...",
      },
    },
    widgets: [
      {
        id: "social-share",
        title: "Partager",
        enabled: true,
        position: "right" as const,
        type: "social-share" as const,
      },
      {
        id: "reactions",
        title: "Réactions",
        enabled: true,
        position: "right" as const,
        type: "reactions" as const,
      },
    ],
    layout: {
      sidebar: {
        left: false,
        right: true,
        sticky: true,
        width: "80",
      },
      content: {
        maxWidth: "5xl",
      },
    },
    colors: {
      primary: "#2C3E50",
      secondary: "#E74C3C",
      accent: "#F39C12",
      background: "#FFFFFF",
      surface: "#F8F9FA",
    },
  },
};

/**
 * Fonction utilitaire pour obtenir un preset de thème
 */
export const getThemePreset = (presetName: keyof typeof themePresets): PremiumThemeConfig => {
  const preset = themePresets[presetName as keyof typeof themePresets]

  if (!preset) {
    throw new Error(`Preset de thème "${presetName}" non trouvé`);
  }
  
  return preset;
};

/**
 * Fonction pour créer une configuration personnalisée
 */
export const createCustomTheme = (basePreset: keyof typeof themePresets, customizations: Partial<PremiumThemeConfig>): PremiumThemeConfig => {
  const base = getThemePreset(basePreset);
  return {
    ...base,
    ...customizations,
  };
};

/**
 * Fonction pour valider la configuration du thème
 */
export const validateThemeConfig = (config: PremiumThemeConfig): boolean => {
  try {
    // Validation de base
    if (!config.header || !config.widgets || !config.layout) {
      throw new Error("Configuration invalide : header, widgets et layout sont requis");
    }

    // Validation du header
    const validHeaderStyles = ["modern", "classic", "minimal", "magazine", "viral", "gaming"];
    if (!validHeaderStyles.includes(config.header.style)) {
      throw new Error(`Style de header invalide : ${config.header.style}`);
    }

    // Validation des widgets
    if (!Array.isArray(config.widgets)) {
      throw new Error("Les widgets doivent être un tableau");
    }

    // Validation du layout
    if (!config.layout.sidebar || !config.layout.content) {
      throw new Error("Configuration de layout invalide");
    }

    return true;
  } catch (error) {
    console.error("Erreur de validation du thème :", error);
    return false;
  }
};

/**
 * Fonction utilitaire pour migrer depuis un thème classique
 */
export const migrateFromClassicTheme = (classicConfig: Record<string, unknown>): Partial<PremiumThemeConfig> => {
  const config = classicConfig as Record<string, boolean | string | undefined>;
  return {
    header: {
      style: "modern",
      sticky: config.stickyHeader ?? false,
      transparent: config.transparentHeader ?? false,
      logo: {
        type: (config.logoType as string) ?? "text",
        text: (config.siteName as string) ?? "CakeNews",
      },
    },
    layout: {
      sidebar: {
        left: config.showLeftSidebar ?? false,
        right: config.showRightSidebar ?? true,
        sticky: config.stickySidebar ?? false,
        width: (config.sidebarWidth as string) ?? "80",
      },
      content: {
        maxWidth: (config.contentWidth as string) ?? "7xl",
      },
    },
  };
};

/**
 * Fonction pour obtenir des suggestions de configuration basées sur le type de site
 */
export const getSuggestionsBySiteType = (siteType: "news" | "blog" | "magazine" | "viral" | "gaming"): keyof typeof themePresets => {
  switch (siteType) {
    case "news":
      return "magazine";
    case "blog":
      return "modern";
    case "magazine":
      return "magazine";
    case "viral":
      return "viral";
    case "gaming":
      return "gaming";
    default:
      return "modern";
  }
};

/**
 * Fonction pour générer des données de démonstration
 */
export const generateDemoData = () => {
  // Structure de données de démonstration avec propriétés prédéfinies
  const demoData = {
    user: {
      id: "demo-user",
      name: "Utilisateur Demo",
      avatar: "/demo-avatar.jpg",
      points: Math.floor(Math.random() * 10000) + 1000,
      level: Math.floor(Math.random() * 20) + 1,
      badges: [
        { id: "1", name: "Lecteur Actif", icon: "📚", earned: true },
        { id: "2", name: "Partageur", icon: "🔄", earned: true },
        { id: "3", name: "Expert", icon: "🏆", earned: Math.random() > 0.5 },
      ],
    },
    post: {
      id: "demo-post",
      title: "Article de démonstration",
      url: "https://demo.cakenews.com/article",
      views: Math.floor(Math.random() * 50000) + 1000,
      shares: Math.floor(Math.random() * 5000) + 100,
      likes: Math.floor(Math.random() * 10000) + 500,
      comments: Math.floor(Math.random() * 2000) + 50,
    },
    leaderboard: Array.from({ length: 10 }, (_, index) => ({
      rank: index + 1,
      name: `User ${index + 1}`,
      points: Math.floor(Math.random() * 20000) + 1000,
      avatar: `/avatar-${index + 1}.jpg`,
    })).sort((a, b) => a.points - b.points).reverse(),
  };
  
  return demoData;
};

export default {
  themePresets,
  getThemePreset,
  createCustomTheme,
  validateThemeConfig,
  migrateFromClassicTheme,
  getSuggestionsBySiteType,
  generateDemoData,
};