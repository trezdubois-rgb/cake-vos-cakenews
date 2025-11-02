# 🚀 Guide de déploiement rapide - Cake Auth

## 1. Configuration Firebase

### Créer un projet Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Créez un nouveau projet
3. Activez **Authentication** et **Firestore**

### Configurer l'authentification
1. Dans **Authentication** > **Sign-in method** :
   - ✅ Email/Password (activé par défaut)
   - ✅ Google (configurez le domaine)
   - ✅ GitHub (ajoutez OAuth app)
   - ✅ Phone (ajoutez reCAPTCHA)

### Obtenir les clés d'API
1. Dans **Project Settings** > **General** :
2. Copiez la configuration Web SDK
3. Collez dans `.env.local` :

```env
VITE_FIREBASE_API_KEY="votre-api-key"
VITE_FIREBASE_AUTH_DOMAIN="votre-projet.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="votre-projet-id"
VITE_FIREBASE_STORAGE_BUCKET="votre-projet.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="votre-sender-id"
VITE_FIREBASE_APP_ID="votre-app-id"
VITE_FIREBASE_MEASUREMENT_ID="votre-measurement-id"
```

## 2. Déployer les Cloud Functions

### Installer Firebase CLI
```bash
npm install -g firebase-tools
```

### Se connecter
```bash
firebase login
```

### Initialiser le projet
```bash
firebase init functions
```

### Déployer les fonctions
```bash
cd firebase-functions
npm install
firebase deploy --only functions
```

## 3. Configurer les rôles admin

### Créer un document admin dans Firestore
```javascript
// Collection: users
// Document: uid-de-lutilisateur
{
  role: "admin",
  email: "admin@example.com",
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
}
```

### Utiliser la fonction Cloud pour définir le rôle
```bash
# Via Firebase CLI (remplacez UID)
curl -X POST https://votre-region-votre-projet.cloudfunctions.net/setAdminRole \
  -H "Content-Type: application/json" \
  -d '{"uid": "uid-utilisateur", "adminSecret": "VITE_ADMIN_SECRET_CODE"}'
```

## 4. Déployer l'application

### Build
```bash
npm run build
```

### Déployer sur Firebase Hosting
```bash
firebase deploy --only hosting
```

## 5. Tester

### Tests à effectuer
1. ✅ **Inscription email** : Créer un compte
2. ✅ **Connexion** : Se connecter avec email/mdp
3. ✅ **Google OAuth** : Connexion avec Google
4. ✅ **GitHub OAuth** : Connexion avec GitHub
5. ✅ **Téléphone** : Connexion par SMS
6. ✅ **Rôles** : Vérifier la redirection admin/user
7. ✅ **Protection** : Tester l'accès non autorisé
8. ✅ **Responsive** : Tester sur mobile

### Commandes de test
```bash
# Lancer les tests
npm test

# Vérifier ESLint
npm run lint

# Build en production
npm run build
```

## 6. Monitoring

### Firebase Console
- **Authentication** : Voir les utilisateurs connectés
- **Functions** : Voir les logs des fonctions
- **Hosting** : Voir les statistiques
- **Firestore** : Voir les données utilisateurs

### Logs utiles
```bash
# Voir les logs Cloud Functions
firebase functions:log

# Voir les logs en temps réel
firebase emulators:start --only functions
```

## 🎯 Problèmes courants

### Erreur "auth/invalid-api-key"
- ✅ Vérifiez `.env.local`
- ✅ Redémarrez le serveur de développement

### Erreur "permission-denied"
- ✅ Vérifiez les règles Firestore
- ✅ Vérifiez Custom Claims

### Redirection infinie
- ✅ Vérifiez les hooks `useAuthProtection`
- ✅ Vérifiez la logique dans `App.tsx`

### OAuth qui ne fonctionne pas
- ✅ Vérifiez les URLs de redirection
- ✅ Vérifiez les clés OAuth

---

**Temps estimé** : 30-45 minutes
**Difficulté** : Moyenne
**Prérequis** : Compte Firebase, Node.js 18+