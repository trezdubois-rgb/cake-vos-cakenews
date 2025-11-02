# 🧪 Guide de Test CRUD Complet

## 🎯 Objectif

Tester toutes les fonctionnalités CRUD (Create, Read, Update, Delete) de l'éditeur Gutenberg ultra-avancé dans CakeNews.

## 🚀 Serveur Lancé

```
✅ Local:   http://localhost:8080/
✅ Network: http://192.168.118.141:8080/
```

## 📋 Checklist de Test

### ✅ Phase 1 : Accès au Panel Admin

#### Test 1.1 : Accéder à la liste des articles
1. **URL** : http://localhost:8080/admin/articles
2. **Vérifier** :
   - [ ] La page se charge sans erreur
   - [ ] Le bouton "Créer un article" est visible en haut à droite
   - [ ] La liste des articles s'affiche (ou message "Aucun article")
   - [ ] Les statistiques s'affichent (si articles existants)

#### Test 1.2 : Vérifier l'authentification
1. **Si non connecté** :
   - [ ] Redirection vers `/auth`
   - [ ] Message de connexion
2. **Si connecté mais pas admin** :
   - [ ] Message "Vous n'avez pas les droits administrateur"
   - [ ] Bouton "Retour au tableau de bord"

---

### ✅ Phase 2 : CREATE - Créer un Article

#### Test 2.1 : Accéder à l'éditeur
1. **Action** : Cliquer sur "Créer un article"
2. **URL attendue** : http://localhost:8080/admin/articles/new
3. **Vérifier** :
   - [ ] La page se charge sans erreur
   - [ ] Titre de la page : "Nouvel article"
   - [ ] Formulaire complet visible
   - [ ] Éditeur Gutenberg chargé

#### Test 2.2 : Tester l'éditeur Gutenberg
1. **Vérifier l'interface** :
   - [ ] Toolbar en haut avec titre et boutons
   - [ ] Compteur de blocs visible
   - [ ] Boutons "Save" et "Publish" présents
   - [ ] Bouton plein écran (Maximize/Minimize)
   - [ ] Onglets : Editor, Preview, Code

2. **Tester l'onglet Editor** :
   - [ ] Zone d'édition principale (3/4 de l'écran)
   - [ ] Sidebar Inspector à droite (1/4 de l'écran)
   - [ ] Cliquer sur "+" pour ajouter un bloc
   - [ ] Sélectionner "Paragraph" → Écrire du texte
   - [ ] Sélectionner "Heading" → Écrire un titre
   - [ ] Sélectionner "List" → Créer une liste
   - [ ] Sélectionner "Quote" → Ajouter une citation
   - [ ] Sélectionner "Code" → Ajouter du code

3. **Tester l'onglet Preview** :
   - [ ] Cliquer sur l'onglet "Preview"
   - [ ] Le contenu s'affiche avec le style final
   - [ ] Les blocs sont bien rendus

4. **Tester l'onglet Code** :
   - [ ] Cliquer sur l'onglet "Code"
   - [ ] Le HTML généré s'affiche
   - [ ] Bouton "Copy HTML" fonctionne

5. **Tester la Sidebar** :
   - [ ] "Block Settings" affiche les paramètres du bloc sélectionné
   - [ ] "Document Info" affiche :
     - Nombre de blocs
     - Nombre de mots
     - Nombre de caractères

6. **Tester le mode plein écran** :
   - [ ] Cliquer sur le bouton Maximize
   - [ ] L'éditeur occupe tout l'écran
   - [ ] Cliquer sur Minimize pour revenir

#### Test 2.3 : Remplir le formulaire complet
1. **Métadonnées** :
   - [ ] Titre : "Mon Premier Article de Test"
   - [ ] Catégorie : Sélectionner une catégorie
   - [ ] Extrait : "Ceci est un extrait de test"
   - [ ] Tags : Ajouter "test", "gutenberg", "article"

2. **Médias** :
   - [ ] Image hero : Uploader une image
   - [ ] Vérifier la compression automatique
   - [ ] Preview de l'image s'affiche

3. **Contenu Gutenberg** :
   - [ ] Ajouter au moins 5 blocs différents :
     - 1 Heading (H2)
     - 2 Paragraphs
     - 1 List
     - 1 Quote
     - 1 Code block

4. **SEO** :
   - [ ] Onglet SEO
   - [ ] Titre SEO : "Mon Premier Article - Test Gutenberg"
   - [ ] Description SEO : "Description optimisée pour le SEO"

5. **Options** :
   - [ ] Onglet Options
   - [ ] Activer "Article mis en avant"
   - [ ] Date de publication programmée (optionnel)

#### Test 2.4 : Sauvegarder l'article
1. **Test Brouillon** :
   - [ ] Cliquer sur "Brouillon"
   - [ ] Message de succès : "Article créé"
   - [ ] Redirection vers `/admin/articles`
   - [ ] L'article apparaît dans la liste avec badge "Brouillon"

2. **Test Publier** :
   - [ ] Créer un nouvel article
   - [ ] Cliquer sur "Publier"
   - [ ] Message de succès : "Article créé"
   - [ ] L'article apparaît avec badge "Publié"

3. **Test Programmer** :
   - [ ] Créer un nouvel article
   - [ ] Sélectionner une date future
   - [ ] Cliquer sur "Planifier"
   - [ ] Message de succès : "Article planifié"
   - [ ] L'article apparaît avec statut "Programmé"

---

### ✅ Phase 3 : READ - Lire les Articles

#### Test 3.1 : Liste des articles
1. **Accéder à** : http://localhost:8080/admin/articles
2. **Vérifier** :
   - [ ] Tous les articles créés s'affichent
   - [ ] Informations visibles :
     - Titre
     - Badge de statut (Publié/Brouillon)
     - Catégorie
     - Nombre de vues
     - Nombre de likes
     - Date de création
   - [ ] Boutons d'action :
     - ✏️ Modifier
     - 🗑️ Supprimer

#### Test 3.2 : Statistiques globales
1. **Vérifier** :
   - [ ] Carte "Total Articles" : Nombre correct
   - [ ] Carte "Total Vues" : Somme correcte
   - [ ] Carte "Total Likes" : Somme correcte

#### Test 3.3 : Affichage dans le flux public
1. **Accéder à** : http://localhost:8080/mon-flux
2. **Vérifier** :
   - [ ] Les articles publiés s'affichent
   - [ ] Les brouillons ne s'affichent PAS
   - [ ] Le contenu Gutenberg est bien rendu
   - [ ] Les images s'affichent
   - [ ] Les blocs sont stylisés correctement

#### Test 3.4 : Vue détaillée d'un article
1. **Cliquer sur un article** dans le flux
2. **Vérifier** :
   - [ ] Le titre s'affiche
   - [ ] L'image hero s'affiche
   - [ ] Le contenu Gutenberg est rendu :
     - Paragraphes
     - Titres
     - Listes
     - Citations
     - Code
   - [ ] Les métadonnées s'affichent :
     - Catégorie
     - Tags
     - Date de publication
     - Auteur

---

### ✅ Phase 4 : UPDATE - Modifier un Article

#### Test 4.1 : Accéder à l'édition
1. **Action** : Cliquer sur l'icône ✏️ d'un article
2. **URL attendue** : http://localhost:8080/admin/articles/:id/edit
3. **Vérifier** :
   - [ ] La page se charge sans erreur
   - [ ] Titre de la page : "Modifier l'article"
   - [ ] Tous les champs sont pré-remplis :
     - Titre
     - Catégorie
     - Extrait
     - Tags
     - Image hero
     - Contenu Gutenberg
     - SEO
     - Options

#### Test 4.2 : Vérifier le chargement du contenu Gutenberg
1. **Vérifier** :
   - [ ] L'éditeur Gutenberg charge le contenu existant
   - [ ] Tous les blocs sont présents
   - [ ] Le contenu est éditable
   - [ ] Les paramètres des blocs sont conservés

#### Test 4.3 : Modifier le contenu
1. **Modifications** :
   - [ ] Changer le titre
   - [ ] Modifier un paragraphe
   - [ ] Ajouter un nouveau bloc
   - [ ] Supprimer un bloc
   - [ ] Réorganiser les blocs (drag & drop)
   - [ ] Changer la catégorie
   - [ ] Ajouter/supprimer des tags

2. **Sauvegarder** :
   - [ ] Cliquer sur "Publier" (ou "Brouillon")
   - [ ] Message de succès : "Article mis à jour"
   - [ ] Redirection vers `/admin/articles`

#### Test 4.4 : Vérifier les modifications
1. **Dans la liste** :
   - [ ] Le titre est mis à jour
   - [ ] La catégorie est mise à jour
   - [ ] Les tags sont mis à jour

2. **Dans le flux public** :
   - [ ] Le contenu modifié s'affiche
   - [ ] Les nouveaux blocs sont visibles
   - [ ] Les blocs supprimés ont disparu

---

### ✅ Phase 5 : DELETE - Supprimer un Article

#### Test 5.1 : Supprimer depuis la liste
1. **Action** : Cliquer sur l'icône 🗑️ d'un article
2. **Vérifier** :
   - [ ] Popup de confirmation : "Êtes-vous sûr de vouloir supprimer cet article ?"
   - [ ] Cliquer sur "Annuler" → Rien ne se passe
   - [ ] Cliquer sur "OK" → Article supprimé

3. **Après suppression** :
   - [ ] Message de succès : "Article supprimé"
   - [ ] L'article disparaît de la liste
   - [ ] Les statistiques se mettent à jour
   - [ ] L'article n'apparaît plus dans le flux public

---

### ✅ Phase 6 : Tests Avancés

#### Test 6.1 : Tous les types de blocs Gutenberg
1. **Créer un article avec** :
   - [ ] Paragraph
   - [ ] Heading (H1, H2, H3, H4, H5, H6)
   - [ ] List (ordonnée et non ordonnée)
   - [ ] Quote
   - [ ] Code
   - [ ] Image
   - [ ] Video (embed YouTube)
   - [ ] Audio
   - [ ] Button
   - [ ] Columns
   - [ ] Separator
   - [ ] Spacer
   - [ ] Table
   - [ ] HTML

2. **Vérifier le rendu** :
   - [ ] Tous les blocs s'affichent correctement
   - [ ] Les styles sont appliqués
   - [ ] Les embeds fonctionnent

#### Test 6.2 : Formatage riche
1. **Dans un paragraphe** :
   - [ ] Gras (Ctrl+B)
   - [ ] Italique (Ctrl+I)
   - [ ] Lien (Ctrl+K)
   - [ ] Code inline
   - [ ] Couleurs personnalisées
   - [ ] Tailles de police

2. **Vérifier le rendu** :
   - [ ] Le formatage est conservé
   - [ ] Les couleurs s'affichent
   - [ ] Les liens fonctionnent

#### Test 6.3 : Performance
1. **Créer un article avec 50+ blocs** :
   - [ ] L'éditeur reste fluide
   - [ ] Pas de lag lors de la frappe
   - [ ] La sauvegarde fonctionne
   - [ ] Le rendu est rapide

#### Test 6.4 : Responsive
1. **Tester sur mobile** :
   - [ ] L'éditeur s'adapte
   - [ ] La sidebar passe en dessous
   - [ ] Les boutons sont accessibles
   - [ ] L'édition fonctionne

---

## 📊 Résultats Attendus

### ✅ Tous les tests passent
- **CREATE** : ✅ Création d'articles avec Gutenberg
- **READ** : ✅ Affichage dans la liste et le flux
- **UPDATE** : ✅ Modification avec chargement du contenu
- **DELETE** : ✅ Suppression avec confirmation

### ✅ Fonctionnalités avancées
- **50+ types de blocs** : ✅ Tous disponibles
- **Formatage riche** : ✅ Complet
- **Interface professionnelle** : ✅ Toolbar, sidebar, onglets
- **Performance** : ✅ Fluide même avec beaucoup de blocs
- **Responsive** : ✅ Fonctionne sur tous les écrans

---

## 🐛 Problèmes Potentiels

### Si l'éditeur ne charge pas
1. Vérifier la console (F12)
2. Vérifier que les packages WordPress sont installés
3. Vérifier que les styles CSS sont chargés

### Si le contenu ne se sauvegarde pas
1. Vérifier la connexion à Supabase
2. Vérifier les permissions admin
3. Vérifier les logs de la console

### Si les blocs ne s'affichent pas
1. Vérifier que `registerCoreBlocks()` est appelé
2. Vérifier les imports WordPress
3. Vérifier les styles CSS

---

## 🎉 Conclusion

Si tous les tests passent, l'intégration Gutenberg ultra-avancée est **100% fonctionnelle** ! 🚀

**Prochaines étapes** :
1. ✅ Tester en production
2. ✅ Former les utilisateurs
3. ✅ Créer du contenu
4. ✅ Profiter de l'éditeur le plus avancé ! 🎊

