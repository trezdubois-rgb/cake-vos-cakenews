# 🍰 Cake - Système d'Authentification

> *Slogan* : vos cakenews

Système d'authentification moderne et sécurisé avec Firebase, incluant :
- ✅ Authentification multi-méthodes (email, Google, GitHub, téléphone)
- ✅ Gestion des rôles (admin/user) avec Firebase Custom Claims
- ✅ Protection des routes côté client et serveur
- ✅ Design moderne avec dégradé violet-rose
- ✅ Animations fluides et UX premium

## 🚀 Fonctionnalités

### Authentification
- **Email/Mot de passe** : Inscription et connexion classiques
- **Google OAuth** : Connexion rapide avec Google
- **GitHub OAuth** : Connexion avec GitHub
- **Téléphone (OTP)** : Connexion par SMS avec code de vérification
- **Mot de passe oublié** : Réinitialisation par email

### Sécurité
- **Custom Claims Firebase** : Gestion sécurisée des rôles
- **Validation côté client** : Validation des emails, mots de passe et numéros
- **Protection des routes** : Redirection automatique basée sur les rôles
- **Messages d'erreur francisés** : UX améliorée

### Design
- **Dégradé animé** : Violet (#A855F7) → Rose (#EC4899)
- **Interface moderne** : Cards, animations, transitions
- **Responsive** : Adaptation mobile et desktop
- **Accessibilité** : Labels ARIA, navigation clavier

## 📁 Structure du projet

```
src/
├── lib/
│   ├── firebase.js      # Configuration Firebase
│   └── authUtils.js     # Utilitaires d'authentification
├── hooks/
│   └── useAuth.js       # Hooks d'authentification
├── pages/
│   ├── Auth.tsx         # Page principale d'authentification
│   ├── AdminDashboard.tsx # Dashboard administrateur
│   └── Unauthorized.tsx   # Page d'accès refusé
└── App.tsx              # Configuration des routes
```

## 🔧 Configuration Firebase

### 1. Variables d'environnement
Remplissez le fichier `.env.local` avec vos informations Firebase :

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

### 2. Activer les méthodes d'authentification
Dans la console Firebase :
1. Allez dans **Authentication** > **Sign-in method**
2. Activez :
   - Email/Password
   - Google
   - GitHub
   - Phone

### 3. Configurer OAuth
- **Google** : Ajoutez votre domaine dans les URLs autorisées
- **GitHub** : Créez une application OAuth et ajoutez les URLs de redirection

## 🔐 Gestion des rôles

### Custom Claims
Les rôles sont gérés via Firebase Custom Claims (côté serveur) :

```javascript
// Définir un utilisateur comme admin
admin.auth().setCustomUserClaims(uid, { role: "admin" });

// Récupérer le rôle côté client
const idTokenResult = await user.getIdTokenResult();
const role = idTokenResult.claims.role || "user";
```

### Cloud Functions
Déployez les fonctions dans `firebase-functions/index.js` pour :
- `setAdminRole` : Attribuer le rôle admin
- `removeAdminRole` : Retirer le rôle admin
- `getUsers` : Liste des utilisateurs (admin uniquement)

## 🛡️ Protection des routes

### Hook useAuthProtection
```javascript
import { useAuthProtection } from "../hooks/useAuth";

export default function AdminDashboard() {
  useAuthProtection("admin"); // Protège la route admin
  
  return <div>Dashboard Admin</div>;
}
```

### Redirection automatique
- **Utilisateurs connectés** : Redirigés vers `/home` ou `/admin/dashboard`
- **Utilisateurs non connectés** : Redirigés vers `/login`
- **Non autorisés** : Redirigés vers `/unauthorized`

## 🎨 Personnalisation

### Couleurs
Modifiez le dégradé dans `Auth.tsx` :
```css
bg-gradient-to-br from-[#A855F7] to-[#EC4899]
```

### Animations
Le dégradé d'arrière-plan est animé avec une animation CSS :
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## 🧪 Tests

### Test de l'authentification
1. **Inscription email** : Testez avec un nouvel email
2. **Connexion** : Testez avec des identifiants existants
3. **Google/GitHub** : Testez les connexions sociales
4. **Téléphone** : Testez l'OTP avec un vrai numéro
5. **Rôles** : Vérifiez la redirection admin/user

### Test de sécurité
1. **Accès non autorisé** : Tentez d'accéder à `/admin` sans rôle
2. **Session persistante** : Vérifiez la connexion après refresh
3. **Déconnexion** : Testez la déconnexion complète

## 📱 Mobile

Le design est fully responsive avec Tailwind CSS :
- **Mobile first** : Optimisé pour les écrans tactiles
- **Touch friendly** : Boutons adaptés au touch
- **Animations fluides** : Transitions optimisées

## 🔒 Sécurité

### Bonnes pratiques implémentées
- ✅ Validation côté client et serveur
- ✅ Protection contre les injections
- ✅ Gestion sécurisée des tokens
- ✅ HTTPS obligatoire en production
- ✅ Custom Claims non modifiables côté client

### À implémenter en production
- [ ] HTTPS partout
- [ ] Rate limiting
- [ ] Monitoring des tentatives de connexion
- [ ] 2FA optionnel
- [ ] Audit logs

## 🚀 Déploiement

### Build
```bash
npm run build
```

### Firebase Hosting
```bash
firebase deploy --only hosting
```

### Cloud Functions
```bash
firebase deploy --only functions
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la console Firebase pour les erreurs
2. Consultez les logs Cloud Functions
3. Vérifiez les variables d'environnement

---

**Cake** - Système d'authentification moderne et sécurisé 🍰