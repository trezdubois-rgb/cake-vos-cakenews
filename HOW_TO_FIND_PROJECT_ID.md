# 🔍 Comment Trouver le Vrai ID du Projet Supabase

## Méthode 1 : Via le Dashboard Supabase (Le plus simple)

1. **Connectez-vous au Dashboard Supabase**
   - Allez sur https://app.supabase.com
   - Connectez-vous à votre compte

2. **Sélectionnez votre projet**
   - Dans la liste des projets, cliquez sur votre projet

3. **Trouvez l'ID du projet**
   - L'ID du projet apparaît dans l'URL : `https://app.supabase.com/project/[VOTRE_PROJECT_ID]`
   - Ou allez dans **Settings > General** et regardez le champ **"Reference ID"**

## Méthode 2 : Via l'URL de l'API

1. **Allez dans Settings > API**
2. **Regardez l'URL de l'API**
   - L'URL ressemble à : `https://[VOTRE_PROJECT_ID].supabase.co`
   - L'ID du projet est la partie avant `.supabase.co`

## Méthode 3 : Via les Variables d'Environnement

Si vous avez un fichier `.env` ou `.env.local`, l'ID peut être extrait de `VITE_SUPABASE_URL` :

```
VITE_SUPABASE_URL=https://[VOTRE_PROJECT_ID].supabase.co
```

## Vérification

Une fois que vous avez trouvé votre vrai ID :

1. **Vérifiez dans `supabase/config.toml`**
   - Le `project_id` doit correspondre

2. **Vérifiez dans les scripts**
   - Les scripts qui utilisent l'URL Supabase doivent avoir le bon ID

3. **Mettez à jour si nécessaire**
   - Si l'ID est différent, mettez à jour les fichiers concernés

## ⚠️ Important

- Ne partagez **jamais** votre Project ID publiquement
- Ne commitez **jamais** vos clés API dans le repository
- Utilisez des variables d'environnement pour les informations sensibles

