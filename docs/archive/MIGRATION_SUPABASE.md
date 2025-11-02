# Migration Firebase vers Supabase

Ce document décrit la migration complète du système d'authentification de Firebase vers Supabase.

## Configuration Supabase

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anonyme (anon key)

### 2. Configuration des variables d'environnement

Mettez à jour votre fichier `.env.local` :

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Configuration de la base de données

Exécutez le script SQL `supabase-setup.sql` dans le tableau de bord Supabase pour créer :
- La table `users` pour stocker les métadonnées
- Les politiques de sécurité (RLS)
- Les fonctions utilitaires
- Le déclencheur pour créer automatiquement les profils

## Fonctionnalités migrées

✅ **Authentification email/mot de passe**
- Connexion avec `supabase.auth.signInWithPassword()`
- Inscription avec `supabase.auth.signUp()`

✅ **OAuth (Google & GitHub)**
- Configuration dans Supabase Dashboard > Authentication > Providers
- Utilisation de `supabase.auth.signInWithOAuth()`

✅ **Gestion des rôles**
- Stockage dans la table `users` au lieu des Custom Claims Firebase
- Vérification via requêtes SQL

✅ **Protection des routes**
- Hooks `useAuth`, `useAuthRedirect`, `useAuthProtection` mis à jour
- Redirection basée sur les rôles

⚠️ **Authentification par téléphone**
- Implémentée de manière simulée pour la démonstration
- Pour une implémentation réelle, configurez un fournisseur SMS (Twilio, etc.)

## Configuration OAuth

### Google OAuth
1. Allez dans Supabase Dashboard > Authentication > Providers
2. Activez Google
3. Ajoutez vos identifiants Google OAuth
4. Configurez les URLs de redirection autorisées

### GitHub OAuth
1. Créez une application OAuth sur GitHub
2. Allez dans Supabase Dashboard > Authentication > Providers  
3. Activez GitHub
4. Ajoutez vos identifiants GitHub OAuth

## Configuration des rôles admin

Pour créer un administrateur :

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Tests

1. **Test d'inscription** : Créez un nouveau compte
2. **Test de connexion** : Connectez-vous avec email/mot de passe
3. **Test OAuth** : Essayez Google et GitHub
4. **Test des rôles** : Vérifiez que l'admin est redirigé vers `/admin/dashboard`
5. **Test de protection** : Accédez à `/admin/dashboard` sans être admin

## Avantages de Supabase

- **Base de données PostgreSQL** complète
- **Politiques de sécurité** puissantes (RLS)
- **API REST et GraphQL** intégrées
- **Fonctions Edge** pour la logique serveur
- **Stockage de fichiers** intégré
- **Monitoring** et logs complets
- **Open source** et auto-hébergeable

## Notes importantes

- Les sessions sont gérées automatiquement par Supabase
- Les tokens JWT sont renouvelés automatiquement
- La déconnexion est gérée avec `supabase.auth.signOut()`
- Les métadonnées utilisateur sont stockées dans `auth.users` et `public.users`

## Support

Pour toute question ou problème, consultez :
- [Documentation Supabase](https://supabase.com/docs)
- [Discord Supabase](https://discord.supabase.com)
- GitHub Issues du projet