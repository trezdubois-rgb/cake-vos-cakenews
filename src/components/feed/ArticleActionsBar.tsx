import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReportMenu } from "@/components/article/ReportMenu";
import { CommentDialog } from "@/components/article/CommentDialog";

interface CommentReaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  created_at: string;
  like_count: number;
  reactions?: CommentReaction[];
  isHidden?: boolean;
  replies?: Comment[];
}

interface ArticleActionsBarProps {
  articleId: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  initialLikeCount: number;
}

export const ArticleActionsBar = ({
  articleId,
  authorId,
  authorName,
  category,
  tags,
  initialLikeCount,
}: ArticleActionsBarProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    checkIfLiked();
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch comments without join first
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("id, content, created_at, like_count, user_id, parent_id")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return;
    }

    if (!commentsData || commentsData.length === 0) {
      setComments([]);
      return;
    }

    // Fetch profiles for all user_ids
    const userIds = [...new Set(commentsData.map(c => c.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", userIds);

    const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

    // Fetch reactions for all comments
    const { data: reactionsData } = await supabase
      .from('comment_reactions')
      .select('comment_id, emoji, user_id')
      .in('comment_id', commentsData.map(c => c.id));

    // Fetch hidden comments for current user
    const { data: hiddenData } = user ? await supabase
      .from('hidden_comments')
      .select('comment_id')
      .eq('user_id', user.id)
      .in('comment_id', commentsData.map(c => c.id)) : { data: [] };

    const hiddenCommentIds = new Set(hiddenData?.map(h => h.comment_id) || []);

    // Group reactions by comment
    const reactionsByComment = new Map<string, Map<string, { count: number; userReacted: boolean }>>();
    reactionsData?.forEach((reaction: any) => {
      if (!reactionsByComment.has(reaction.comment_id)) {
        reactionsByComment.set(reaction.comment_id, new Map());
      }
      const emojiMap = reactionsByComment.get(reaction.comment_id)!;
      if (!emojiMap.has(reaction.emoji)) {
        emojiMap.set(reaction.emoji, { count: 0, userReacted: false });
      }
      const emojiData = emojiMap.get(reaction.emoji)!;
      emojiData.count++;
      if (user && reaction.user_id === user.id) {
        emojiData.userReacted = true;
      }
    });

    const formattedComments: Comment[] = [];
    const commentMap = new Map<string, Comment>();

    commentsData.forEach((comment) => {
      const profile = profilesMap.get(comment.user_id);
      const reactions = reactionsByComment.get(comment.id);
      const formattedComment: Comment = {
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.user_id,
          name: profile?.display_name || "Utilisateur",
          avatar: profile?.avatar_url || undefined,
        },
        created_at: comment.created_at,
        like_count: comment.like_count || 0,
        reactions: reactions ? Array.from(reactions.entries()).map(([emoji, reactionData]) => ({
          emoji,
          count: reactionData.count,
          userReacted: reactionData.userReacted,
        })) : [],
        isHidden: hiddenCommentIds.has(comment.id),
        replies: [],
      };
      commentMap.set(comment.id, formattedComment);

      if (!comment.parent_id) {
        formattedComments.push(formattedComment);
      }
    });

    commentsData.forEach((comment) => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        const child = commentMap.get(comment.id);
        if (parent && child) {
          parent.replies!.push(child);
        }
      }
    });

    setComments(formattedComments);
  };

  const checkIfLiked = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Connectez-vous pour interagir avec les articles");
      return;
    }

    setLoading(true);
    try {
      const newLiked = !liked;

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
        await supabase.from("user_interactions").insert({
          article_id: articleId,
          user_id: user.id,
          liked: newLiked,
        });
      }

      const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
      await supabase
        .from("articles")
        .update({ like_count: newLikeCount })
        .eq("id", articleId);

      setLiked(newLiked);
      setLikeCount(newLikeCount);
    } catch (error: any) {
      toast.error("Erreur lors du like");
      console.error("Error liking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Connectez-vous pour partager des articles");
      return;
    }
    
    const url = `${window.location.origin}/article/${articleId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Article",
          url: url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  const handleReportContent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Connectez-vous pour signaler du contenu");
      return;
    }
    
    toast.info("Contenu signalé. Merci pour votre vigilance.");
  };

  const handleSendFeedback = () => {
    toast.info("Merci pour votre avis !");
  };

  const handleHideArticle = () => {
    toast.info("Article masqué");
  };

  const handleHideAuthor = () => {
    toast.info(`Tous les articles de ${authorName} seront masqués`);
  };

  const handleHideCategory = () => {
    toast.info(`Vous ne verrez plus la catégorie "${category}"`);
  };

  const handleHideTag = (tag: string) => {
    toast.info(`Tag #${tag} masqué`);
  };

  const handleOpenComments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Connectez-vous pour voir et ajouter des commentaires");
      return;
    }
    
    setShowComments(true);
    await fetchComments();
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Connectez-vous pour commenter");
      return;
    }

    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id,
      content,
      parent_id: parentId,
    });

    if (error) {
      console.error("Error adding comment:", error);
      throw error;
    }

    await fetchComments();
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Connectez-vous pour liker");
      return;
    }

    if (isLiked) {
      const { error } = await supabase.from("comment_likes").insert({
        comment_id: commentId,
        user_id: user.id,
      });

      if (!error) {
        await supabase.rpc("increment_comment_likes", { comment_id: commentId });
      }
    } else {
      await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);

      await supabase.rpc("decrement_comment_likes", { comment_id: commentId });
    }

    await fetchComments();
  };

  return (
    <>
      {/* Barre d'actions rouge - fixe au-dessus de la navigation */}
      <div className="fixed bottom-16 left-0 right-0 z-40 h-16 bg-destructive/95 backdrop-blur border-t border-destructive-foreground/20">
        <div className="h-full flex items-center justify-around px-2">
          <button
            onClick={handleLike}
            disabled={loading}
            className="flex flex-col items-center justify-center gap-0.5 text-xs text-destructive-foreground min-w-[70px]"
          >
            <Heart size={24} fill={liked ? "currentColor" : "none"} />
            <span className="font-medium">{likeCount > 0 ? likeCount : "J'aime"}</span>
          </button>

          <button
            onClick={handleOpenComments}
            className="flex flex-col items-center justify-center gap-0.5 text-xs text-destructive-foreground min-w-[70px]"
          >
            <MessageCircle size={24} />
            <span className="font-medium">Commenter</span>
          </button>

          <ReportMenu
            articleId={articleId}
            authorId={authorId}
            authorName={authorName}
            category={category}
            tags={tags}
            onReportContent={handleReportContent}
            onSendFeedback={handleSendFeedback}
            onHideArticle={handleHideArticle}
            onHideAuthor={handleHideAuthor}
            onHideCategory={handleHideCategory}
            onHideTag={handleHideTag}
          />

          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-0.5 text-xs text-destructive-foreground min-w-[70px]"
          >
            <Share2 size={24} />
            <span className="font-medium">Partager</span>
          </button>
        </div>
      </div>

      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        articleId={articleId}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onRefreshComments={fetchComments}
      />
    </>
  );
};
