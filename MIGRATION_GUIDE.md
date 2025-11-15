# 📋 Guide d'Exécution de la Migration SQL

## Méthode 1 : Via le Dashboard Supabase (Recommandé)

### Étapes :

1. **Accéder au Dashboard Supabase**
   - Allez sur https://app.supabase.com
   - Connectez-vous à votre compte
   - Sélectionnez votre projet
   - ⚠️ **Vérifiez l'ID de votre projet** dans l'URL ou dans Settings > General > Reference ID

2. **Ouvrir l'éditeur SQL**
   - Dans le menu de gauche, cliquez sur **"SQL Editor"**
   - Cliquez sur **"New query"** pour créer une nouvelle requête

3. **Copier le contenu de la migration**
   - Ouvrez le fichier : `supabase/migrations/20251120000000_add_device_control_and_2fa.sql`
   - Copiez tout le contenu (Ctrl+A puis Ctrl+C)

4. **Coller et exécuter**
   - Collez le contenu dans l'éditeur SQL du dashboard
   - Cliquez sur **"Run"** ou appuyez sur `Ctrl+Enter`
   - Attendez la confirmation de succès

5. **Vérifier les tables créées**
   - Allez dans **"Table Editor"** dans le menu de gauche
   - Vous devriez voir les nouvelles tables :
     - `trusted_devices`
     - `admin_access_logs`
     - `admin_2fa_secrets`
   - Vérifiez aussi que la table `admin_login_requests` a bien les nouvelles colonnes

## Méthode 2 : Via la CLI Supabase (Optionnel)

Si vous souhaitez installer la CLI Supabase :

```bash
# Installer la CLI (Windows avec npm)
npm install -g supabase

# Ou avec Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Se connecter à Supabase
supabase login

# Lier le projet local au projet Supabase
cd cake-vos-cakenews-main
# Remplacez [VOTRE_PROJECT_ID] par le vrai ID de votre projet
supabase link --project-ref [VOTRE_PROJECT_ID]

# Pousser les migrations
supabase db push
```

## Vérification Post-Migration

Après l'exécution, vérifiez que :

1. ✅ Les 3 nouvelles tables existent :
   - `trusted_devices`
   - `admin_access_logs`
   - `admin_2fa_secrets`

2. ✅ La table `admin_login_requests` a les nouvelles colonnes :
   - `ip_address`
   - `user_agent`
   - `device_fingerprint`
   - `two_fa_code`
   - `two_fa_verified`

3. ✅ Les politiques RLS sont actives sur les nouvelles tables

4. ✅ Les fonctions sont créées :
   - `cleanup_old_admin_access_logs()`
   - `auto_revoke_pending_requests()`

## En cas d'erreur

Si vous rencontrez des erreurs lors de l'exécution :

1. **Erreur "relation already exists"** : C'est normal si certaines tables existent déjà. Les commandes `IF NOT EXISTS` devraient gérer cela.

2. **Erreur "function already exists"** : Les fonctions utilisent `CREATE OR REPLACE`, donc elles seront mises à jour.

3. **Erreur de permissions** : Assurez-vous d'être connecté en tant qu'administrateur du projet Supabase.

4. **Erreur sur les politiques** : Si une politique existe déjà, vous pouvez la supprimer d'abord :
   ```sql
   DROP POLICY IF EXISTS "policy_name" ON table_name;
   ```

## Notes importantes

- ⚠️ Cette migration est **idempotente** (peut être exécutée plusieurs fois sans problème)
- ⚠️ Les données existantes ne seront **pas supprimées**
- ⚠️ Les nouvelles colonnes ajoutées à `admin_login_requests` auront des valeurs `NULL` pour les enregistrements existants

