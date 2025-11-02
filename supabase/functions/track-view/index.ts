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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { articleId } = await req.json();

    if (!articleId) {
      return new Response(JSON.stringify({ error: 'Article ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has already viewed this article today
    const { data: existingView } = await supabase
      .from('view_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('article_id', articleId)
      .eq('view_date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    if (!existingView) {
      // Create initial view tracking record (triggers immediate +1 view via DB trigger)
      await supabase
        .from('view_tracking')
        .insert({
          user_id: user.id,
          article_id: articleId,
          view_date: new Date().toISOString().split('T')[0],
          views_generated: 1,
          last_view_increment: new Date().toISOString(),
        });

      // Schedule 9 additional views randomly over the next 24 hours
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      for (let i = 0; i < 9; i++) {
        const randomDelay = Math.random() * twentyFourHours;
        const scheduledTime = new Date(now + randomDelay);
        
        // TODO: Implémenter une vraie file d'attente de tâches pour la production
      // console.log(`Scheduled view ${i + 2}/10 for ${scheduledTime.toISOString()}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});