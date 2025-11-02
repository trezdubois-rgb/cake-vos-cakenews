# Guide Complet de l'Intégration de Gutenberg

## 📋 Introduction

Ce guide complet explique comment utiliser l'éditeur **WordPress Gutenberg** intégré dans l'application CakeNews. Il s'adresse aux développeurs, aux créateurs de contenu et aux testeurs. L'intégration est conçue pour être robuste, performante et sécurisée, offrant une expérience d'édition de niveau professionnel.

## 🚀 Démarrage Rapide (2 minutes)

Pour commencer à utiliser l'éditeur, suivez ces étapes :

1.  **Démarrez l'application** :
    ```bash
    npm run dev
    ```

2.  **Essayez l'éditeur** :
    Rendez-vous sur **http://localhost:5173/gutenberg-demo**.

3.  **Créez un article** :
    - Remplissez le titre, l'extrait, la catégorie et les tags.
    - Utilisez l'éditeur Gutenberg pour créer votre contenu.
    - Cliquez sur "Enregistrer l'article".
    - Visualisez-le dans le flux à l'adresse `/mon-flux`.

## 🎯 Fonctionnalités Principales

### Fonctionnalités de l'Éditeur
- ✅ Plus de 20 types de blocs (paragraphes, titres, listes, etc.).
- ✅ Mise en forme de texte enrichi (gras, italique, liens).
- ✅ Insertion d'images et de vidéos (YouTube, Vimeo).
- ✅ Réorganisation des blocs par glisser-déposer.
- ✅ Prévisualisation en temps réel.
- ✅ Exportation du contenu au format HTML compatible WordPress.

### Fonctionnalités d'Intégration
- ✅ Intégration transparente avec le système de flux d'actualités.
- ✅ Gestion complète des articles (création, édition, suppression).
- ✅ Recherche, filtrage par catégorie et par tag.
- ✅ Prise en charge des informations sur l'auteur et suivi de l'engagement.

### Fonctionnalités Techniques
- ✅ Support complet de TypeScript.
- ✅ Basé sur React 18.3.1 et Vite.
- ✅ Conception responsive pour les mobiles.
- ✅ Nettoyage du HTML pour la sécurité (prévention XSS).
- ✅ Prêt pour la production.

## 📦 Composants

### `GutenbergEditor`
Le composant principal de l'éditeur, offrant toutes les fonctionnalités de Gutenberg.

**Props :**
- `initialContent?: string` : Contenu HTML à charger initialement.
- `onSave?: (htmlContent: string, blocks: any[]) => void` : Callback exécuté lors de la sauvegarde.
- `onContentChange?: (htmlContent: string, blocks: any[]) => void` : Callback exécuté lors de la modification du contenu.
- `title?: string` : Titre affiché dans l'éditeur.
- `showPreview?: boolean` : Affiche un aperçu du HTML et du rendu.

**Exemple d'utilisation :**
```tsx
import GutenbergEditor from '@/components/editor/GutenbergEditor';

export const MyEditor = () => {
  return (
    <GutenbergEditor
      onSave={(html, blocks) => {
        console.log('Contenu sauvegardé :', html);
      }}
      title="Créer un Article"
    />
  );
};
```

### `GutenbergRenderer`
Ce composant est utilisé pour afficher le contenu HTML généré par Gutenberg dans votre flux ou vos articles.

**Exemple d'utilisation :**
```tsx
import { GutenbergRenderer } from '@/components/article/GutenbergRenderer';

export const ArticleView = ({ article }) => {
  return (
    <GutenbergRenderer
      htmlContent={article.contentHtml}
      className="my-custom-class"
    />
  );
};
```

## 🔌 Intégration de l'API

L'API (actuellement simulée) prend en charge les opérations CRUD complètes pour les articles.

### Créer un Article
```tsx
import { createArticle } from '@/api/articles';

const newArticle = await createArticle({
  title: 'Mon Super Article',
  excerpt: 'Un bref résumé...',
  category: 'Technologie',
  contentHtml: '<p>Le contenu de mon article...</p>',
  slug: 'mon-super-article',
  tags: ['tech', 'nouveauté'],
});
```

### Mettre à Jour un Article
```tsx
import { updateArticle } from '@/api/articles';

await updateArticle(articleId, {
  title: 'Titre Mis à Jour',
  contentHtml: '<p>Contenu mis à jour...</p>',
});
```

### Obtenir des Articles
```tsx
import { getArticles, getArticlesByCategory } from '@/api/articles';

const allArticles = await getArticles();
const techArticles = await getArticlesByCategory('Technologie');
```

## 📁 Structure des Fichiers

```
src/
├── components/
│   ├── editor/
│   │   └── GutenbergEditor.tsx          # Composant principal de l'éditeur
│   └── article/
│       └── GutenbergRenderer.tsx        # Affiche le contenu HTML
├── pages/
│   ├── GutenbergDemo.tsx                # Page de démonstration
│   ├── ArticleEditor.tsx                # Page de l'éditeur d'articles
│   └── AdminArticles.tsx                # Gestion des articles
├── api/
│   ├── articles.ts                      # Client API pour les articles
│   └── handlers/
│       └── articlesHandler.ts           # Simule le backend
└── data/
    └── articles.ts                      # Exemples d'articles
```

## 🎨 Style

Les styles de Gutenberg sont chargés automatiquement. Pour personnaliser l'apparence du contenu rendu, utilisez les classes `prose` de Tailwind CSS :

```tsx
<div className="prose prose-sm max-w-none">
  {/* Votre contenu Gutenberg ici */}
</div>
```

## 🔄 Flux de Travail

### Pour les Créateurs de Contenu
1.  Allez sur `/gutenberg-demo` ou `/admin/articles/new`.
2.  Remplissez les métadonnées de l'article (titre, extrait, etc.).
3.  Utilisez l'éditeur Gutenberg pour créer le contenu.
4.  Cliquez sur "Enregistrer l'article".
5.  Le contenu est sauvegardé au format HTML compatible WordPress.

### Pour les Développeurs
1.  Les articles sont stockés avec le contenu HTML et les données de bloc brutes.
2.  Le HTML est rendu dans les flux en utilisant `GutenbergRenderer`.
3.  Les données de bloc peuvent être utilisées pour un traitement personnalisé.
4.  Tout le contenu est nettoyé avant l'affichage pour des raisons de sécurité.

## 📊 Structure des Données

```typescript
interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  contentHtml: string;        // HTML compatible WordPress
  slug: string;
  tags: string[];
  heroSrc?: string;
  blocks?: any[];             // Blocs bruts de Gutenberg
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  engagement: {
    likes: number;
    views: number;
    shares: number;
  };
  publishedAt: string;
}
```

## 🛠️ Intégration du Backend

Actuellement, l'application utilise des gestionnaires de simulation dans `src/api/handlers/articlesHandler.ts`. Pour vous connecter à un backend réel :

1.  Remplacez les appels API dans `src/api/articles.ts`.
2.  Mettez à jour les points de terminaison pour qu'ils correspondent à votre backend.
3.  Assurez-vous que le backend renvoie les articles dans le format attendu.

## 📈 Performance et Sécurité

### Performance
- **Taille du bundle** : Gutenberg ajoute environ 500-700 Ko (gzip). Pensez au *code-splitting* pour les pages d'administration.
- **Temps de chargement** : Le chargement de l'éditeur peut être différé (*lazy-loading*) pour améliorer les performances initiales.

### Sécurité
- **Nettoyage du HTML** : Le contenu HTML est nettoyé avec `sanitizeHtml()` avant d'être affiché pour prévenir les attaques XSS.
- **Validation côté serveur** : Validez et nettoyez toujours les données côté serveur.
- **Politique de Sécurité de Contenu (CSP)** : Utilisez des en-têtes CSP en production.

## 🧪 Tests

Pour garantir la qualité et la stabilité de l'intégration, exécutez les commandes suivantes :

```bash
# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Analyser le code avec ESLint
npm run lint
```

Consultez le fichier `TESTING_GUTENBERG.md` pour un guide de test détaillé.

## 🐛 Dépannage

### L'éditeur ne se charge pas ?
- Vérifiez la console du navigateur pour des erreurs.
- Assurez-vous que les paquets WordPress sont correctement installés.
- Videz le cache et rechargez la page.

### Le contenu ne s'enregistre pas ?
- Vérifiez l'onglet "Réseau" pour des erreurs d'API.
- Assurez-vous que le point de terminaison du backend est correct.
- Vérifiez la console pour des erreurs JavaScript.

### Problèmes de style ?
- Vérifiez que les fichiers CSS de WordPress sont bien importés.
- Recherchez des conflits de style avec votre thème.
- Utilisez les classes `prose` pour le rendu du contenu.