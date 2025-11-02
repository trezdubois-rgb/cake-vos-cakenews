import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HideMenu } from "./HideMenu";
import { CommentDialog } from "./CommentDialog";

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
  replies?: Comment[];
}

interface ArticleActionsProps {
  articleId: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  initialLikeCount: number;
}

export const ArticleActions = ({
  articleId,
  authorId,
  authorName,
  category,
  tags,
  initialLikeCount,
}: ArticleActionsProps) => {
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
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        like_count,
        user_id,
        parent_id,
        profiles!user_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    const formattedComments: Comment[] = [];
    const commentMap = new Map<string, Comment>();

    data?.forEach((comment: any) => {
      const formattedComment: Comment = {
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.profiles.id,
          name: comment.profiles.display_name || 'Utilisateur',
          avatar: comment.profiles.avatar_url,
        },
        created_at: comment.created_at,
        like_count: comment.like_count || 0,
        replies: [],
      };
      commentMap.set(comment.id, formattedComment);

      if (!comment.parent_id) {
        formattedComments.push(formattedComment);
      }
    });

    data?.forEach((comment: any) => {
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
      toast.error("Vous devez être connecté pour liker");
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
        await supabase
          .from("user_interactions")
          .insert({
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

  const handleAddComment = async (content: string, parentId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          content,
          parent_id: parentId,
        });

      if (error) throw error;

      await fetchComments();
      toast.success("Commentaire ajouté");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Vous devez être connecté pour liker");
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existingLike.id);
        
        await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
      } else {
        await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });

        await supabase.rpc('increment_comment_likes', { comment_id: commentId });
      }

      await fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Erreur lors du like du commentaire");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-border z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-3 px-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs font-medium"
            onClick={handleLike}
            disabled={loading}
          >
            <Heart size={22} className={liked ? "fill-current text-like" : ""} />
            <span>{likeCount > 0 ? likeCount : "J'aime"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs font-medium"
            onClick={() => setShowComments(true)}
          >
            <MessageCircle size={22} />
            <span>{comments.length > 0 ? comments.length : "Commenter"}</span>
          </Button>

          <HideMenu
            articleId={articleId}
            authorId={authorId}
            authorName={authorName}
            category={category}
            tags={tags}
            onHideArticle={handleHideArticle}
            onHideAuthor={handleHideAuthor}
            onHideCategory={handleHideCategory}
            onHideTag={handleHideTag}
          />

          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 text-xs font-medium"
            onClick={handleShare}
          >
            <Share2 size={22} />
            <span>Partager</span>
          </Button>
        </div>
      </div>

      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        articleId={articleId}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />
    </>
  );
};
