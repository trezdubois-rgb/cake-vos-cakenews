# Configuration des variables d'environnement

Pour que l'application fonctionne correctement avec Supabase, vous devez configurer les variables suivantes dans votre fichier `.env.local`:

```bash
# Configuration Supabase
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre-clé-anonyme"
VITE_SUPABASE_PUBLISHABLE_KEY="votre-clé-publique"
```

## Instructions pour obtenir ces valeurs :

1. **Supabase URL** : Trouvez cette URL dans votre tableau de bord Supabase
2. **Supabase Anon Key** : Générez cette clé dans les paramètres de votre projet Supabase
3. **Supabase Publishable Key** : Cette clé est disponible dans les paramètres d'authentification de Supabase

## Mode démo actuel

L'application est actuellement en mode démo avec des données mock. Pour passer en mode production avec vos données réelles :

1. Configurez les variables d'environnement ci-dessus
2. Redémarrez le serveur de développement
3. Les composants utiliseront alors vos données Supabase réelles

## URL de l'application

L'application est accessible à l'adresse : http://localhost:8081/

## Navigation

- **Accueil** : `/` - Page principale avec le flux d'articles
- **Mon Flux** : `/mon-flux` - Votre flux personnalisé
- **Messages** : `/messages` - Vos notifications et messages
- **Profil** : `/profil` - Votre profil utilisateur
- **Authentification** : `/auth` - Page de connexion/inscription