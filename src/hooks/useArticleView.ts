<<<<<<< HEAD
import { useEffect } from 'react';

import { supabase } from '@/integrations/supabase/client';
=======
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

export const useArticleView = (articleId: string, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !articleId) return;

    const trackView = async () => {
<<<<<<< HEAD
      const {
        data: { user },
      } = await supabase.auth.getUser();
=======
      const { data: { user } } = await supabase.auth.getUser();
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      if (!user) return;

      try {
        // Call edge function to track view
        await supabase.functions.invoke('track-view', {
<<<<<<< HEAD
          body: { articleId },
        });
      } catch (_error) {
=======
          body: { articleId }
        });
      } catch (error) {
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        console.error('Error tracking view:', error);
      }
    };

    // Track view immediately when article becomes active
    trackView();
  }, [articleId, isActive]);
<<<<<<< HEAD
};
=======
};
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
