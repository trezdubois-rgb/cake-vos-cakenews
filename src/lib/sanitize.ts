import DOMPurify from 'dompurify';

/**
 * Configuration de sanitization pour le contenu HTML des articles
 * Permet les balises courantes tout en bloquant les scripts et contenus dangereux
 */
const ARTICLE_SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    // Texte et formatage
    'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
    // Titres
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Listes
    'ul', 'ol', 'li',
    // Liens
    'a',
    // Citations et code
    'blockquote', 'q', 'cite', 'code', 'pre',
    // Tableaux
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    // Médias (images uniquement, vidéos gérées séparément)
    'img', 'figure', 'figcaption',
    // Conteneurs
    'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main',
    // Autres
    'hr', 'abbr', 'time',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'title', 'alt', 'src', 'width', 'height',
    'class', 'id', 'style', 'data-*', 'aria-*',
    'colspan', 'rowspan', 'datetime', 'cite',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  ALLOW_DATA_ATTR: true,
  ALLOW_ARIA_ATTR: true,
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Configuration stricte pour les commentaires et contenus utilisateurs
 * Plus restrictive que la configuration pour les articles
 */
const COMMENT_SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'title'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  KEEP_CONTENT: true,
};

/**
 * Sanitize HTML content pour les articles
 * Utilise DOMPurify pour nettoyer le HTML et prévenir les attaques XSS
 * 
 * @param html - Le contenu HTML à nettoyer
 * @returns Le HTML nettoyé et sécurisé
 * 
 * @example
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    return DOMPurify.sanitize(html, ARTICLE_SANITIZE_CONFIG);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
}

/**
 * Sanitize HTML content pour les commentaires et contenus utilisateurs
 * Plus restrictif que sanitizeHtml pour éviter les abus
 * 
 * @param html - Le contenu HTML à nettoyer
 * @returns Le HTML nettoyé et sécurisé
 * 
 * @example
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: sanitizeComment(comment.content) }} />
 * ```
 */
export function sanitizeComment(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    return DOMPurify.sanitize(html, COMMENT_SANITIZE_CONFIG);
  } catch (error) {
    console.error('Error sanitizing comment:', error);
    return '';
  }
}

/**
 * Sanitize une URL pour s'assurer qu'elle est sûre
 * Bloque les URLs javascript: et data: qui pourraient être dangereuses
 * 
 * @param url - L'URL à vérifier
 * @returns L'URL si elle est sûre, une chaîne vide sinon
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return 'about:blank';
  }

  const trimmedUrl = url.trim().toLowerCase();
  
  // Bloquer les URLs dangereuses
  if (
    trimmedUrl.startsWith('javascript:') ||
    trimmedUrl.startsWith('data:') ||
    trimmedUrl.startsWith('vbscript:')
  ) {
    return 'about:blank';
  }

  return url;
}

/**
 * Nettoie le texte brut en échappant les caractères HTML
 * Utile pour afficher du texte utilisateur sans permettre de HTML
 * 
 * @param text - Le texte à échapper
 * @returns Le texte avec les caractères HTML échappés
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Échapper manuellement les caractères HTML
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Alias pour compatibilité
 */
export const escapeHtml = sanitizeText;

/**
 * Vérifie si une chaîne contient du HTML potentiellement dangereux
 * 
 * @param html - Le HTML à vérifier
 * @returns true si le HTML contient des éléments suspects
 */
export function containsDangerousHtml(html: string): boolean {
  if (!html || typeof html !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onload, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<applet/i,
    /<meta/i,
    /<link/i,
    /<style/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(html));
}

/**
 * Hook DOMPurify pour ajouter des attributs target="_blank" et rel="noopener noreferrer"
 * à tous les liens externes automatiquement
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // Ajouter target="_blank" et rel="noopener noreferrer" aux liens externes
  if (node.tagName === 'A') {
    const href = node.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('/')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Ajouter loading="lazy" aux images
  if (node.tagName === 'IMG') {
    node.setAttribute('loading', 'lazy');
  }
});

/**
 * Sanitize attribute value
 */
export function sanitizeAttribute(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/</g, '')
    .replace(/>/g, '')
    .trim();
}

/**
 * Sanitize CSS class names
 */
export function sanitizeClassName(classes: string): string {
  if (!classes || typeof classes !== 'string') {
    return '';
  }

  // Remove HTML tags and dangerous characters, keep valid CSS class characters
  return classes
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim();
}

export default {
  sanitizeHtml,
  sanitizeComment,
  sanitizeUrl,
  escapeHtml,
  sanitizeText,
  sanitizeAttribute,
  sanitizeClassName,
  containsDangerousHtml,
};