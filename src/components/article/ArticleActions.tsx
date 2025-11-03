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

    // Format comments with nested replies
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

    // Link replies to parents
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

    const { error } = await supabase.from('comments').insert({
      article_id: articleId,
      user_id: user.id,
      content,
      parent_id: parentId,
    });

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    await fetchComments();
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isLiked) {
      const { error } = await supabase.from('comment_likes').insert({
        comment_id: commentId,
        user_id: user.id,
      });

      if (!error) {
        await supabase.rpc('increment_comment_likes', { comment_id: commentId });
      }
    } else {
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
    }

    await fetchComments();
  };

  return (
    <>
      <div className="fixed bottom-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-40">
        <div className="flex items-center justify-around px-4 py-3 max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className={`flex flex-col items-center gap-1 text-xs ${liked ? 'text-primary' : 'text-foreground'}`}
          >
            <Heart
              size={24}
              className={liked ? 'fill-primary' : ''}
            />
            <span className="font-medium">{likeCount > 0 ? likeCount : 'J\'aime'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center gap-1 text-xs"
          >
            <MessageCircle size={24} />
            <span className="font-medium">Commenter</span>
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
            onClick={handleShare}
            className="flex flex-col items-center gap-1 text-xs"
          >
            <Share2 size={24} />
            <span className="font-medium">Partager</span>
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