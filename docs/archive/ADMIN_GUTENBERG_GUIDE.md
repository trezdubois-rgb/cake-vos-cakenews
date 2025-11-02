# 📝 Guide d'utilisation de l'éditeur Gutenberg dans l'Admin

## ✅ Intégration Complète

L'éditeur Gutenberg est maintenant **complètement intégré** dans le panel d'administration de CakeNews !

## 🚀 Comment créer un article

### Étape 1: Accéder au panel d'administration

1. Visitez: `http://localhost:8080/admin/articles`
2. Vous verrez la liste de tous les articles

### Étape 2: Créer un nouvel article

1. Cliquez sur le bouton **"New Article"** (en haut à droite)
2. Vous serez redirigé vers `/admin/articles/new`
3. L'éditeur Gutenberg s'affichera

### Étape 3: Remplir les informations de l'article

#### Métadonnées de base
- **Titre** : Le titre de votre article (obligatoire)
- **Catégorie** : Sélectionnez une catégorie
- **Extrait** : Un résumé court de l'article
- **Tags** : Ajoutez des tags pour organiser vos articles

#### Images et médias
- **Image hero** : URL de l'image principale
- **Vidéo hero** : URL d'une vidéo (optionnel)

#### Contenu
- Utilisez l'**éditeur Gutenberg** pour créer votre contenu
- Ajoutez des blocs : paragraphes, titres, listes, images, vidéos, etc.
- Formatez votre texte : gras, italique, liens, etc.

#### SEO
- **Titre SEO** : Titre optimisé pour les moteurs de recherche
- **Description SEO** : Description pour les résultats de recherche

#### Options
- **Article en vedette** : Marquer l'article comme featured
- **Publier** : Publier immédiatement ou sauvegarder comme brouillon
- **Programmer** : Planifier la publication pour plus tard

### Étape 4: Sauvegarder l'article

Vous avez 3 options :

1. **Sauvegarder comme brouillon** : Cliquez sur "Sauvegarder"
2. **Publier immédiatement** : Cliquez sur "Publier"
3. **Programmer la publication** : Sélectionnez une date et cliquez sur "Programmer"

## 📝 Utiliser l'éditeur Gutenberg

### Ajouter un bloc

1. Cliquez sur le bouton **"+"** dans l'éditeur
2. Sélectionnez le type de bloc :
   - **Paragraph** : Texte normal
   - **Heading** : Titre (H1-H6)
   - **List** : Liste à puces ou numérotée
   - **Quote** : Citation
   - **Code** : Bloc de code
   - **Image** : Image
   - **Video** : Vidéo
   - **Embed** : Contenu embarqué (YouTube, Vimeo, etc.)

### Formater le texte

1. Sélectionnez le texte
2. Utilisez la barre d'outils :
   - **B** : Gras
   - **I** : Italique
   - **Link** : Ajouter un lien
   - **Color** : Changer la couleur

### Réorganiser les blocs

1. Survolez un bloc
2. Utilisez les flèches **↑** et **↓** pour déplacer
3. Ou utilisez le **drag & drop** (glisser-déposer)

### Supprimer un bloc

1. Survolez un bloc
2. Cliquez sur les **trois points** (⋮)
3. Sélectionnez **"Remove block"**

## 🔍 Gérer les articles existants

### Voir tous les articles

1. Visitez: `http://localhost:8080/admin/articles`
2. Vous verrez un tableau avec tous les articles
3. Utilisez les filtres pour rechercher :
   - **Recherche** : Par titre ou extrait
   - **Catégorie** : Filtrer par catégorie

### Modifier un article

1. Dans la liste des articles, cliquez sur l'icône **Edit** (crayon)
2. Vous serez redirigé vers `/admin/articles/:id/edit`
3. L'éditeur s'ouvrira avec le contenu existant
4. Modifiez et sauvegardez

### Voir un article

1. Dans la liste des articles, cliquez sur l'icône **Eye** (œil)
2. Vous verrez l'article tel qu'il apparaît aux utilisateurs

### Supprimer un article

1. Dans la liste des articles, cliquez sur l'icône **Trash** (poubelle)
2. Confirmez la suppression

## 📊 Statistiques

En bas de la page `/admin/articles`, vous verrez :

- **Total Articles** : Nombre total d'articles
- **Total Views** : Nombre total de vues
- **Total Likes** : Nombre total de likes

## 🎯 Routes disponibles

| Route | Description |
|-------|-------------|
| `/admin/articles` | Liste des articles |
| `/admin/articles/new` | Créer un nouvel article |
| `/admin/articles/:id/edit` | Modifier un article |
| `/article/:id` | Voir un article (public) |

## 💡 Conseils

### Pour un bon article

1. **Titre accrocheur** : Utilisez un titre clair et engageant
2. **Extrait pertinent** : Résumez l'essentiel en 1-2 phrases
3. **Image hero** : Ajoutez une belle image principale
4. **Structure claire** : Utilisez des titres et sous-titres
5. **Contenu riche** : Mélangez texte, images, vidéos
6. **Tags pertinents** : Facilitez la découverte de votre article
7. **SEO optimisé** : Remplissez les champs SEO

### Pour de meilleures performances

1. **Compressez les images** : Utilisez des images optimisées
2. **Utilisez des vidéos externes** : YouTube, Vimeo, etc.
3. **Évitez les blocs vides** : Supprimez les blocs inutiles
4. **Testez sur mobile** : Vérifiez l'affichage mobile

## 🔐 Sécurité

- **Authentification requise** : Vous devez être connecté
- **Permissions admin** : Seuls les admins peuvent créer/modifier
- **Sanitization HTML** : Le contenu est automatiquement nettoyé
- **Validation** : Les données sont validées avant sauvegarde

## 🐛 Dépannage

### L'éditeur ne charge pas ?

1. Vérifiez que vous êtes connecté
2. Vérifiez que vous avez les permissions admin
3. Rafraîchissez la page (F5)
4. Videz le cache du navigateur

### Le contenu ne s'affiche pas ?

1. Vérifiez que vous avez sauvegardé
2. Vérifiez que l'article est publié (pas en brouillon)
3. Vérifiez la console pour les erreurs

### Les images ne s'affichent pas ?

1. Vérifiez que l'URL de l'image est correcte
2. Vérifiez que l'image est accessible publiquement
3. Utilisez des URLs HTTPS

## 📚 Ressources

- **[GUTENBERG_README.md](./GUTENBERG_README.md)** - Guide Gutenberg complet
- **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - Exemples de code
- **[TESTING_GUTENBERG.md](./TESTING_GUTENBERG.md)** - Guide de test
- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Intégration backend

## ✨ Fonctionnalités avancées

### Programmer la publication

1. Remplissez tous les champs
2. Sélectionnez une date et heure dans "Scheduled Publish"
3. Cliquez sur "Programmer"
4. L'article sera publié automatiquement à la date choisie

### Articles en vedette

1. Activez le switch "Featured"
2. L'article apparaîtra en haut du flux
3. Il aura un badge "Featured"

### Gestion des tags

1. Tapez un tag dans le champ "Tags"
2. Appuyez sur **Enter** ou cliquez sur "Ajouter"
3. Cliquez sur un tag pour le supprimer

## 🎉 C'est tout !

Vous êtes maintenant prêt à créer des articles professionnels avec Gutenberg !

### Prochaines étapes

1. ✅ Créez votre premier article
2. ✅ Testez tous les types de blocs
3. ✅ Publiez et vérifiez dans le flux
4. ✅ Partagez avec vos utilisateurs !

---

**Bon écriture ! ✍️**

