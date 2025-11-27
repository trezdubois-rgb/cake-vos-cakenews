import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
  is_liked?: boolean;
}

// Helper function to find a comment in the tree
function findComment(comments: Comment[], commentId: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === commentId) return comment;
    if (comment.replies) {
      const found = findComment(comment.replies, commentId);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to update a comment in the tree (for optimistic updates)
function updateCommentInTree(
  comments: Comment[], 
  commentId: string, 
  updates: Partial<Comment>
): Comment[] {
  return comments.map(comment => {
    if (comment.id === commentId) {
      return { ...comment, ...updates };
    }
    if (comment.replies) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, commentId, updates)
      };
    }
    return comment;
  });
}


export const useComments = (articleId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch all comments for the article
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          *,
          user:profiles!user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("article_id", articleId)
        .order("created_at", { ascending: true });

      if (commentsError) throw commentsError;

      // Fetch user's likes if authenticated
      let userLikes: Set<string> = new Set();
      if (user) {
        const { data: likesData } = await supabase
          .from("comment_likes")
          .select("comment_id")
          .eq("user_id", user.id)
          .in("comment_id", commentsData?.map(c => c.id) || []);

        userLikes = new Set(likesData?.map(l => l.comment_id) || []);
      }

      // Build comment tree
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      commentsData?.forEach((comment: any) => {
        const formattedComment: Comment = {
          ...comment,
          user: comment.user || { id: comment.user_id, full_name: "Utilisateur", avatar_url: null },
          replies: [],
          is_liked: userLikes.has(comment.id),
        };
        commentMap.set(comment.id, formattedComment);

        if (!comment.parent_id) {
          rootComments.push(formattedComment);
        }
      });

      // Attach replies to parents
      commentsData?.forEach((comment: any) => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          const child = commentMap.get(comment.id);
          if (parent && child) {
            parent.replies!.push(child);
          }
        }
      });

      setComments(rootComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Erreur lors du chargement des commentaires");
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`comments:${articleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `article_id=eq.${articleId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [articleId, fetchComments]);

  const addComment = async (content: string, parentId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Connectez-vous pour commenter");
      return;
    }

    if (!content.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        user_id: user.id,
        content: content.trim(),
        parent_id: parentId || null,
      });

      if (error) throw error;
      toast.success("Commentaire ajouté !");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (commentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Connectez-vous pour liker");
      return;
    }

    try {
      const comment = findComment(comments, commentId);
      if (!comment) return;

      if (comment.is_liked) {
        // Unlike
        const { error } = await supabase
          .from("comment_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("comment_id", commentId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("comment_likes")
          .insert({ user_id: user.id, comment_id: commentId });

        if (error) throw error;
      }

      // Refresh comments to get updated like count
      await fetchComments();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Erreur lors du like");
    }
  };

  const deleteComment = async (commentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Commentaire supprimé");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  return {
    comments,
    loading,
    submitting,
    addComment,
    toggleLike,
    deleteComment,
    refreshComments: fetchComments,
  };
};
