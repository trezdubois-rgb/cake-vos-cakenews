import { useEffect } from 'react';

import { supabase } from '@/integrations/supabase/client';

export const useArticleView = (articleId: string, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !articleId) return;

    const trackView = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      try {
        // Call edge function to track view
        await supabase.functions.invoke('track-view', {
          body: { articleId },
        });
      } catch (_error) {
        console.error('Error tracking view:', error);
      }
    };

    // Track view immediately when article becomes active
    trackView();
  }, [articleId, isActive]);
};
