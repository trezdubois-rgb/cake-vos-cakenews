import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useHaptic } from "./useHaptic";
import { useAuth } from "./useAuth";

interface UseArticleLikeResult {
  liked: boolean;
  likeCount: number;
  handleLike: () => Promise<boolean>; // Returns true if action was performed, false if auth required
  loading: boolean;
  requiresAuth: boolean;
}

export const useArticleLike = (articleId: string, initialLikeCount: number): UseArticleLikeResult => {
  const { user, isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const { trigger } = useHaptic();

  useEffect(() => {
    if (articleId && isAuthenticated && user) {
      checkIfLiked();
    }
  }, [articleId, isAuthenticated, user]);

  const checkIfLiked = async () => {
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

  const handleLike = async (): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      trigger('error');
      setRequiresAuth(true);
      return false;
    }

    setRequiresAuth(false);

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

      return true;
    } catch (error: any) {
      // Revert on error
      setLiked(!newLiked);
      setLikeCount(liked ? likeCount : likeCount);
      toast.error("Erreur lors du like");
      console.error("Error liking:", error);
      trigger('error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { liked, likeCount, handleLike, loading, requiresAuth };
};
