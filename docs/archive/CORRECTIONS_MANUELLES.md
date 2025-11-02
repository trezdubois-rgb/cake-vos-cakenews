# Guide de Corrections Manuelles - Erreurs Critiques

Ce document liste les corrections manuelles nécessaires pour résoudre les erreurs critiques restantes dans le projet CakeNews.

---

## 🔴 Erreurs Critiques à Corriger

### 1. React Hooks Conditionnels

**Fichier:** `src/components/article-viewer/ArticleViewer.tsx:25`

**Problème:**
```typescript
const swipeHandlers = isMobile ? useSwipeable({...}) : {};
```

**Solution:**
```typescript
// Toujours appeler le Hook
const swipeHandlers = useSwipeable({
  onSwipedLeft: () => {
    if (isMobile && onNext) onNext();
  },
  onSwipedRight: () => {
    if (isMobile && onPrevious) onPrevious();
  },
  preventDefaultTouchmoveEvent: true,
  trackMouse: false,
});

// Utiliser conditionnellement les handlers
<div {...(isMobile ? swipeHandlers : {})}>
```

---

### 2. Utilisation de `dangerouslySetInnerHTML`

**Fichiers concernés:**
- `src/components/article-viewer/ArticlePage.tsx:167`
- `src/components/feed/FeedItem.tsx:301`
- `src/pages/Article.tsx:333`

**Problème:**
```typescript
<div dangerouslySetInnerHTML={{ __html: content }} />
```

**Solution:**
```typescript
// Option 1: Installer DOMPurify
// npm install dompurify
// npm install --save-dev @types/dompurify

import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />

// Option 2: Utiliser un composant de rendu sécurisé
import { sanitizeHtml } from '@/lib/sanitize';

<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
```

**Créer le fichier `src/lib/sanitize.ts`:**
```typescript
import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
```

---

### 3. Éléments Média sans Captions

**Fichiers concernés:**
- `src/components/article/AudioPlayer.tsx:18`
- `src/components/editor/blocks/AudioBlock.tsx:97`
- `src/pages/Article.tsx:305`

**Problème:**
```typescript
<audio controls src={audioUrl} />
```

**Solution:**
```typescript
<audio controls>
  <source src={audioUrl} />
  <track
    kind="captions"
    src={captionsUrl || ''}
    srcLang="fr"
    label="Français"
  />
  Votre navigateur ne supporte pas l'élément audio.
</audio>
```

**Pour les vidéos:**
```typescript
<video controls>
  <source src={videoUrl} />
  <track
    kind="captions"
    src={captionsUrl || ''}
    srcLang="fr"
    label="Français"
  />
  Votre navigateur ne supporte pas l'élément vidéo.
</video>
```

---

### 4. Non-null Assertions

**Fichiers concernés:**
- `src/main.tsx:7`
- `src/components/article/ArticleActions.tsx:121`
- `src/hooks/useAuth.ts:23`

**Problème:**
```typescript
const element = document.getElementById('root')!;
const user = getCurrentUser()!;
```

**Solution:**
```typescript
// Option 1: Vérification conditionnelle
const element = document.getElementById('root');
if (!element) {
  throw new Error('Root element not found');
}
ReactDOM.createRoot(element).render(<App />);

// Option 2: Assertion de type avec vérification
const element = document.getElementById('root');
if (element === null) {
  throw new Error('Root element not found');
}
const root: HTMLElement = element;
```

---

### 5. Constant Nullishness

**Fichiers concernés:**
- `src/components/article-viewer/ArticleViewer.tsx:14`
- `src/hooks/use-toast.ts:101`
- `src/hooks/useSwipeGesture.ts:34`

**Problème:**
```typescript
const value = CONSTANT_VALUE ?? defaultValue;
```

**Solution:**
```typescript
// Si la valeur est toujours définie, supprimer le ??
const value = CONSTANT_VALUE;

// Ou si la valeur peut être undefined, corriger la définition
const value: string | undefined = maybeValue;
const finalValue = value ?? defaultValue;
```

---

### 6. Propriétés Inconnues dans les Composants

**Fichier:** `src/components/ui/command.tsx:41`

**Problème:**
```typescript
<div cmdk-input-wrapper="">
```

**Solution:**
```typescript
<div data-cmdk-input-wrapper="">
```

**Fichier:** `src/components/header/AdminSidebar.tsx:176`

**Problème:**
```typescript
<Button /> // Button n'est pas importé
```

**Solution:**
```typescript
import { Button } from '@/components/ui/button';
```

---

### 7. Variables Inutilisées dans useAuth.js

**Fichier:** `src/hooks/useAuth.js:50,86`

**Problème:**
```typescript
} catch {
  // error n'est pas défini
  console.error('Error:', error);
}
```

**Solution:**
```typescript
} catch (error) {
  console.error('Error:', error);
}
```

---

### 8. Imports Multiples du Même Fichier

**Fichier:** `src/pages/PremiumDemo.tsx:8-12`

**Problème:**
```typescript
import { WeatherWidget } from '@/components/widgets/PremiumWidgets';
import { StockWidget } from '@/components/widgets/PremiumWidgets';
import { CryptoWidget } from '@/components/widgets/PremiumWidgets';
```

**Solution:**
```typescript
import {
  CryptoWidget,
  StockWidget,
  WeatherWidget,
} from '@/components/widgets/PremiumWidgets';
```

---

## ⚠️ Avertissements à Corriger

### 1. Variables Inutilisées

**Pattern:**
```typescript
const { data, error } = useQuery(); // error non utilisé
```

**Solution:**
```typescript
// Option 1: Préfixer avec _
const { data, error: _error } = useQuery();

// Option 2: Supprimer
const { data } = useQuery();
```

---

### 2. Console Statements

**Pattern:**
```typescript
console.log('Debug:', value);
```

**Solution:**
```typescript
// En développement: utiliser console.warn ou console.error
console.warn('Debug:', value);

// En production: supprimer ou utiliser un logger
import { logger } from '@/lib/logger';
logger.debug('Debug:', value);
```

---

### 3. Array Index as Key

**Pattern:**
```typescript
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

**Solution:**
```typescript
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}

// Si pas d'ID unique, créer un
{items.map((item, index) => (
  <div key={`${item.name}-${index}`}>{item.name}</div>
))}
```

---

### 4. Entités Non Échappées

**Pattern:**
```typescript
<p>Don't do this</p>
```

**Solution:**
```typescript
<p>Don&apos;t do this</p>
// ou
<p>{"Don't do this"}</p>
```

---

### 5. Nullish Coalescing

**Pattern:**
```typescript
const value = input || defaultValue;
```

**Solution:**
```typescript
const value = input ?? defaultValue;
```

**Différence:**
- `||` retourne `defaultValue` si `input` est `false`, `0`, `''`, `null`, `undefined`
- `??` retourne `defaultValue` seulement si `input` est `null` ou `undefined`

---

## 📋 Checklist de Correction

### Priorité 1 (Critique)
- [ ] Corriger les React Hooks conditionnels
- [ ] Sécuriser `dangerouslySetInnerHTML` avec DOMPurify
- [ ] Ajouter les captions aux éléments média
- [ ] Remplacer les non-null assertions
- [ ] Corriger les erreurs de parsing

### Priorité 2 (Important)
- [ ] Corriger les variables inutilisées
- [ ] Supprimer les console.log
- [ ] Corriger les imports multiples
- [ ] Ajouter les imports manquants

### Priorité 3 (Amélioration)
- [ ] Remplacer || par ??
- [ ] Corriger les array index keys
- [ ] Échapper les entités dans le JSX
- [ ] Ajouter les types manquants

---

## 🛠️ Commandes Utiles

```bash
# Vérifier les erreurs ESLint
npm run lint

# Corriger automatiquement ce qui peut l'être
npm run lint -- --fix

# Vérifier un fichier spécifique
npx eslint src/path/to/file.tsx

# Compiler TypeScript pour vérifier les types
npm run build
```

---

## 📚 Ressources

- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [WCAG Media Guidelines](https://www.w3.org/WAI/media/av/)
- [TypeScript Non-null Assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

---

**Date:** 2025-10-26  
**Version:** 1.0.0

