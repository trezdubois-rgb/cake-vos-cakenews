import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { articleId, articleTitle, authorName } = await req.json();

    if (!articleId || !articleTitle) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all users to notify (exclude the author)
    const { data: article } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', articleId)
      .single();

    const { data: users } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', article?.author_id || '');

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ success: true, notified: 0 }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create notifications for all users
    const notifications = users.map(user => ({
      user_id: user.id,
      type: 'new_article',
      title: 'Nouvel article publié',
      message: `${authorName || 'Un auteur'} a publié : ${articleTitle}`,
      link_url: `/article/${articleId}`,
      related_article_id: articleId,
      related_user_id: article?.author_id,
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('Error creating notifications:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, notified: users.length }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error notifying users:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});