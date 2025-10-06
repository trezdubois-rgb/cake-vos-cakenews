import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('VITE_SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, newPassword } = await req.json()

    // Update user password
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      '4015a539-1a9a-4dfb-a088-84e82be2c3ce',
      { password: newPassword }
    )

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, message: 'Password updated successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
