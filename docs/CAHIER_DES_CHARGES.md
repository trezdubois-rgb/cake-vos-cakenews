# Cahier des Charges - Application CakeNews

## 1. Introduction et Objectifs

### 1.1. Vision du Projet

CakeNews est une plateforme de contenu d'actualités moderne, conçue pour offrir une expérience de lecture immersive et une gestion de contenu puissante et intuitive pour les éditeurs. L'application vise à combiner une interface utilisateur élégante et réactive avec un back-office robuste basé sur l'éditeur Gutenberg de WordPress.

### 1.2. Objectifs Principaux

- **Pour les lecteurs** : Offrir une interface de lecture claire, rapide et accessible sur tous les appareils, avec des fonctionnalités de personnalisation et d'interaction.
- **Pour les éditeurs** : Fournir un système de gestion de contenu (CMS) flexible et complet, permettant la création d'articles riches et interactifs sans effort technique.
- **Technique** : Construire une application web progressive (PWA), sécurisée, performante et maintenable, en s'appuyant sur une stack technologique moderne.

## 2. Périmètre Fonctionnel

### 2.1. Espace Public (Lecteurs)

- **Accueil (`Accueil.tsx`)** : Page principale présentant les articles à la une et les plus récents.
- **Lecture d'article (`Article.tsx`, `ArticleViewer.tsx`)** : Affichage d'un article complet avec son contenu, auteur, date, et section de commentaires.
- **Rendu de contenu Gutenberg (`GutenbergRenderer.tsx`)** : Interprétation et affichage sécurisé du contenu formaté provenant de l'éditeur Gutenberg.
- **Mon Flux (`MonFlux.tsx`)** : Flux d'articles personnalisé pour l'utilisateur connecté.
- **Profil (`Profil.tsx`)** : Page de profil utilisateur où il peut gérer ses préférences.
- **Authentification** : Inscription, connexion, et déconnexion des utilisateurs.
- **Navigation et Recherche (`Header.tsx`, `BottomNav.tsx`, `SearchDialog.tsx`)** : Navigation principale, menu inférieur pour mobile et fonctionnalité de recherche globale.
- **Commentaires (`CommentSection.tsx`)** : Espace de discussion sous chaque article.

### 2.2. Espace Administration (Éditeurs)

- **Tableau de Bord (`AdminDashboard.tsx`)** : Vue d'ensemble des statistiques, des articles récents et des activités.
- **Gestion des Articles (`ArticlesList.tsx`, `AdminArticles.tsx`)** : Liste des articles avec options de tri, de filtrage, de modification et de suppression.
- **Éditeur d'articles (`ArticleEditor.tsx`, `GutenbergEditor.tsx`)** : Interface de création et d'édition d'articles basée sur l'éditeur Gutenberg, avec support pour les blocs personnalisés, la gestion des médias et la sauvegarde automatique.
- **Créateur Rapide d'Article (`QuickArticleCreator.tsx`)** : Interface simplifiée pour la création rapide d'articles.
- **Médiathèque (`MediaLibrary.tsx`)** : Gestion centralisée des images et autres médias.
- **Gestion des Utilisateurs (`UsersManager.tsx`)** : Administration des utilisateurs et de leurs rôles.
- **Gestion des Catégories (`CategoriesManager.tsx`)** : Création, modification et suppression des catégories d'articles.
- **Paramètres (`AdminSettings.tsx`)** : Configuration générale du site.

### 2.3. Fonctionnalités Transverses

- **Système de Thèmes (`ThemeContext.tsx`)** : Support pour des thèmes visuels multiples (ex: clair/sombre).
- **Notifications (`NotificationsList.tsx`)** : Centre de notifications pour les utilisateurs.
- **Sécurité (`ProtectedRoute.tsx`, `sanitize.ts`)** : Routes protégées, validation des données et nettoyage du HTML pour prévenir les attaques XSS.
- **Progressive Web App (PWA)** : L'application sera installable et fonctionnera hors ligne grâce à un Service Worker.

## 3. Exigences Techniques

### 3.1. Stack Technologique

- **Frontend** : React 18+, TypeScript, Vite
- **UI Components** : shadcn/ui, Tailwind CSS
- **Éditeur de texte** : TipTap et intégration de l'éditeur Gutenberg de WordPress (@wordpress/block-editor).
- **Backend (BaaS)** : Supabase (Authentification, Base de données PostgreSQL, Stockage)
- **Fonctions Serverless** : Firebase Functions (pour des traitements spécifiques si nécessaire).
- **Gestion des données client** : React Query (@tanstack/react-query)
- **Routage** : React Router DOM
- **Tests** : Vitest, React Testing Library

### 3.2. Infrastructure et Déploiement

- **Hébergement** : Déploiement sur une plateforme supportant les applications Node.js (Vercel, Netlify, etc.).
- **Base de données et stockage** : Gérés via Supabase.
- **Intégration Continue/Déploiement Continu (CI/CD)** : Mise en place d'un pipeline pour automatiser les tests et les déploiements.

## 4. Architecture Logicielle

### 4.1. Structure du Code Source

Le projet suivra une organisation modulaire, comme déjà initié dans le répertoire `src` :

- `src/pages/` : Contient les composants de haut niveau correspondant aux pages de l'application.
- `src/components/` : Contient les composants réutilisables, organisés par fonctionnalité (admin, article, layout, ui).
- `src/api/` : Centralise la logique de communication avec l'API de Supabase.
- `src/lib/` : Regroupe les utilitaires, les configurations de bibliothèques et les fonctions de support.
- `src/hooks/` : Contient les hooks React personnalisés pour encapsuler la logique métier.
- `src/contexts/` : Fournit des contextes React pour la gestion de l'état global (ex: thème).
- `src/integrations/` : Gère la configuration et l'initialisation des services externes comme Supabase.

### 4.2. Gestion des Données

- **Données serveur** : `React Query` sera utilisé pour la récupération, la mise en cache et la synchronisation des données avec le backend Supabase.
- **État local** : Le state React (`useState`, `useReducer`) sera utilisé pour les états d'interface. `Context API` sera utilisé pour les états globaux simples.

## 5. Qualité, Tests et Maintenance

### 5.1. Normes de Codage

- **Linting** : ESLint avec une configuration stricte (basée sur les recommandations de `typescript-eslint` et `react`).
- **Formatage** : Prettier sera utilisé pour maintenir un style de code uniforme.
- **Automatisation** : Le script `npm run quality-check` sera exécuté avant chaque commit pour garantir la qualité du code.

### 5.2. Stratégie de Tests

- **Tests Unitaires** : Les fonctions utilitaires, les hooks et les composants simples seront testés avec Vitest.
- **Tests d'Intégration** : Les composants complexes et les flux d'utilisateurs seront testés avec React Testing Library pour simuler le comportement de l'utilisateur.

## 6. Livrables

1.  **Code source complet** de l'application, hébergé sur un dépôt Git.
2.  **Documentation technique** (`docs/`) incluant ce cahier des charges, des guides sur l'architecture et les processus.
3.  **Application déployée** et accessible en ligne.
4.  **Suite de tests automatisés** intégrée au pipeline de CI/CD.