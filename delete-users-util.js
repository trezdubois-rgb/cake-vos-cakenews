#!/usr/bin/env node

/**
 * Utilitaire de suppression de tous les utilisateurs non-admin
 * 
 * USAGE:
 * 1. Obtenez votre Service Role Key depuis: https://app.supabase.com/project/_/settings/api
 * 2. Exécutez: node delete-users-util.js YOUR_SERVICE_ROLE_KEY
 * 
 * ATTENTION: Cette action est irréversible !
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.argv[3];
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Erreur: Veuillez fournir votre Service Role Key en argument');
  console.error('Usage: node delete-users-util.js YOUR_SERVICE_ROLE_KEY [SUPABASE_URL]');
  console.error('Obtenez votre clé depuis: https://app.supabase.com/project/_/settings/api');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('❌ Erreur: Veuillez fournir votre URL Supabase');
  console.error('Usage: node delete-users-util.js YOUR_SERVICE_ROLE_KEY SUPABASE_URL');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function deleteAllNonAdminUsers() {
  try {
    console.log('🗑️  Début de la suppression des utilisateurs...');
    console.log('📋 Récupération de la liste des utilisateurs...');
    
    // Récupérer tous les utilisateurs
    const { data: usersResponse, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${listError.message}`);
    }
    
    const users = usersResponse.users;
    
    if (!users || users.length === 0) {
      console.log('✅ Aucun utilisateur trouvé');
      return;
    }

    console.log(`📊 ${users.length} utilisateurs trouvés`);

    // Identifier les admins et les utilisateurs normaux
    const usersToDelete = [];
    const adminUsers = [];

    for (const user of users) {
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (roleError) {
        console.warn(`⚠️  Impossible de vérifier le rôle de ${user.email}: ${roleError.message}`);
        continue;
      }

      const isAdmin = roles?.some(role => role.role === 'admin');
      
      if (isAdmin) {
        adminUsers.push({ id: user.id, email: user.email });
      } else {
        usersToDelete.push({ id: user.id, email: user.email });
      }
    }

    console.log(`🛡️  ${adminUsers.length} administrateurs seront préservés:`);
    adminUsers.forEach(admin => console.log(`   - ${admin.email}`));
    
    console.log(`🗑️  ${usersToDelete.length} utilisateurs seront supprimés:`);
    usersToDelete.forEach(user => console.log(`   - ${user.email}`));

    if (usersToDelete.length === 0) {
      console.log('✅ Aucun utilisateur non-admin à supprimer');
      return;
    }

    // Demander confirmation
    console.log('\n⚠️  ATTENTION: Cette action est irréversible!');
    console.log('Les utilisateurs et toutes leurs données seront définitivement supprimés.');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const confirm = await new Promise((resolve) => {
      rl.question('\nTapez "SUPPRIMER" pour confirmer: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });

    if (confirm !== 'SUPPRIMER') {
      console.log('❌ Suppression annulée');
      return;
    }

    // Supprimer les utilisateurs
    console.log('\n🗑️  Suppression en cours...');
    let deletedCount = 0;
    let errorCount = 0;

    for (const user of usersToDelete) {
      try {
        console.log(`🗑️  Suppression de ${user.email}...`);
        
        // Supprimer les données liées dans l'ordre (enfants d'abord)
        await supabase.from('user_interactions').delete().eq('user_id', user.id);
        await supabase.from('view_tracking').delete().eq('user_id', user.id);
        await supabase.from('comment_likes').delete().eq('user_id', user.id);
        await supabase.from('comments').delete().eq('user_id', user.id);
        await supabase.from('hidden_comments').delete().eq('user_id', user.id);
        await supabase.from('comment_reports').delete().eq('reporter_id', user.id);
        await supabase.from('notifications').delete().eq('user_id', user.id);
        await supabase.from('user_roles').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);
        
        // Puis supprimer l'utilisateur auth
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        
        if (deleteError) {
          console.error(`❌ Erreur lors de la suppression de ${user.email}: ${deleteError.message}`);
          errorCount++;
        } else {
          console.log(`✅ Utilisateur supprimé: ${user.email}`);
          deletedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${user.email}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Résumé:`);
    console.log(`✅ Utilisateurs supprimés: ${deletedCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`🛡️  Administrateurs préservés: ${adminUsers.length}`);
    console.log('\n✅ Opération terminée!');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    if (error.message.includes('JWT')) {
      console.error('\n💡 Astuce: Assurez-vous d\'utiliser la Service Role Key et non la anon key');
      console.error('Obtenez votre clé depuis: https://app.supabase.com/project/_/settings/api');
    }
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  deleteAllNonAdminUsers();
}