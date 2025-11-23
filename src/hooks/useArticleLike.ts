import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useHaptic } from "./useHaptic";

export const useArticleLike = (articleId: string, initialLikeCount: number) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const { trigger } = useHaptic();

  useEffect(() => {
    if (articleId) {
      checkIfLiked();
    }
  }, [articleId]);

  const checkIfLiked = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data } = await supabase
        .from("user_interactions")
        .select("liked")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setLiked(data.liked || false);
      }
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      trigger('error');
      toast.error("Connectez-vous pour interagir avec les articles");
      return;
    }

    // Optimistic update
    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
    
    setLiked(newLiked);
    setLikeCount(newLikeCount);
    
    // Haptic feedback
    trigger(newLiked ? 'success' : 'light');

    setLoading(true);
    try {
      // Update or insert user interaction
      const { data: existingInteraction } = await supabase
        .from("user_interactions")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingInteraction) {
        await supabase
          .from("user_interactions")
          .update({ liked: newLiked })
          .eq("id", existingInteraction.id);
      } else {
        await supabase
          .from("user_interactions")
          .insert({
            article_id: articleId,
            user_id: user.id,
            liked: newLiked,
          });
      }

      // Update article like count
      await supabase
        .from("articles")
        .update({ like_count: newLikeCount })
        .eq("id", articleId);

    } catch (error: any) {
      // Revert on error
      setLiked(!newLiked);
      setLikeCount(liked ? likeCount : likeCount); // Revert count
      toast.error("Erreur lors du like");
      console.error("Error liking:", error);
      trigger('error');
    } finally {
      setLoading(false);
    }
  };

  return { liked, likeCount, handleLike, loading };
};
