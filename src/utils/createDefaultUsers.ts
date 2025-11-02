import { createClient } from '@supabase/supabase-js';

// Remplace ces valeurs par tes vraies clés Supabase
const supabase = createClient(
  'https://<TON_URL_SUPABASE>.supabase.co',
  '<TON_ANON_KEY>'
);

async function createDefaultUsers() {
  const users = [
    { email: 'diyombimea@gmail.com', password: '12345678', role: 'admin' },
    { email: 'mademagic3d@gmail.com', password: '12345678', role: 'user' },
  ];

  for (const user of users) {
    // Création du compte
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.error(`Erreur création ${user.email}:`, error.message);
      continue;
    }

    const userId = data.user?.id;
    if (user.role === 'admin' && userId) {
      // Ajout du rôle admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'admin' }]);
      if (roleError) {
        console.error(`Erreur rôle admin pour ${user.email}:`, roleError.message);
      }
    }
  }
}

createDefaultUsers();