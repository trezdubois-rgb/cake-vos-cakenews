import { useState, useEffect } from "react";
import { Heart, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HideMenu } from "./HideMenu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    checkIfLiked();
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

  const handleHideArticle = async () => {
    toast.info("Article masqué");
  };

  const handleHideAuthor = async () => {
    toast.info(`Tous les articles de ${authorName} seront masqués`);
  };

  const handleHideCategory = async () => {
    toast.info(`Vous ne verrez plus la catégorie "${category}"`);
  };

  const handleHideTag = async (tag: string) => {
    toast.info(`Vous ne verrez plus le tag #${tag}`);
  };

  const scrollToComments = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-border z-50">
      <div className="max-w-4xl mx-auto flex justify-around items-center py-3 px-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
            liked && "text-like"
          )}
          onClick={handleLike}
          disabled={loading}
        >
          <Heart size={22} className={liked ? "fill-current" : ""} />
          <span>{likeCount > 0 ? likeCount : "J'aime"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 text-xs font-medium"
          onClick={scrollToComments}
        >
          <MessageCircle size={22} />
          <span>Commenter</span>
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
  );
};
