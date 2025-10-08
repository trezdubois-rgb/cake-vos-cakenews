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

    // Get all view tracking records that need additional views
    const { data: viewRecords, error: fetchError } = await supabase
      .from('view_tracking')
      .select('*')
      .lt('views_generated', 10)
      .gte('last_view_increment', new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString());

    if (fetchError) {
      throw fetchError;
    }

    // Randomly select some records to increment (simulating random distribution)
    const recordsToIncrement = viewRecords?.filter(() => Math.random() < 0.1) || [];

    for (const record of recordsToIncrement) {
      // Insert new view (trigger will increment article view_count)
      await supabase
        .from('view_tracking')
        .insert({
          user_id: record.user_id,
          article_id: record.article_id,
          view_date: record.view_date,
          views_generated: 1,
          last_view_increment: new Date().toISOString(),
        });

      // Update main tracking record
      await supabase
        .from('view_tracking')
        .update({
          views_generated: record.views_generated + 1,
          last_view_increment: new Date().toISOString(),
        })
        .eq('id', record.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: recordsToIncrement.length,
        message: `Incremented ${recordsToIncrement.length} views` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error incrementing scheduled views:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});