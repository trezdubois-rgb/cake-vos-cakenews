# Test de navigation

L'application devrait maintenant être accessible à l'adresse : http://localhost:8081/

## Pages disponibles :

1. **Page d'authentification** : http://localhost:8081/auth
   - Bouton "Continuer en tant qu'invité" pour accéder à l'application
   - Formulaires de connexion/inscription
   - Connexion avec Google, GitHub, téléphone

2. **Pages principales** (après connexion ou en tant qu'invité) :
   - **Accueil** : http://localhost:8081/ - Flux d'articles
   - **Mon Flux** : http://localhost:8081/mon-flux - Flux personnalisé  
   - **Messages** : http://localhost:8081/messages - Notifications
   - **Profil** : http://localhost:8081/profil - Profil utilisateur

## Fonctionnalités :
- Navigation par BottomNav (barre inférieure)
- Données mock pour la démonstration
- Design responsive
- Authentification complète (même si en mode démo)

## Prochaines étapes :
Pour utiliser vos données Supabase réelles, configurez les variables dans `.env.local` :
```
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre-clé-anonyme"
VITE_SUPABASE_PUBLISHABLE_KEY="votre-clé-publique"
```