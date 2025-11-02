import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

Deno.serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get all articles that are scheduled and due to be published
    const { data: scheduledArticles, error: fetchError } = await supabaseAdmin
      .from('articles')
      .select('id, title, scheduled_publish_at')
      .eq('status', 'scheduled')
      .lte('scheduled_publish_at', new Date().toISOString())

    if (fetchError) throw fetchError

    if (!scheduledArticles || scheduledArticles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No articles to publish', count: 0 }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Publish each article
    const results = await Promise.all(
      scheduledArticles.map(async (article) => {
        const { error } = await supabaseAdmin
          .from('articles')
          .update({
            published: true,
            published_at: new Date().toISOString(),
            status: 'published'
          })
          .eq('id', article.id)

        return {
          id: article.id,
          title: article.title,
          success: !error,
          error: error?.message
        }
      })
    )

    return new Response(
      JSON.stringify({ 
        message: 'Publishing complete',
        count: scheduledArticles.length,
        results 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})