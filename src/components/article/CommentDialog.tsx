import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string, liked: boolean) => void;
}

export const CommentDialog = ({
  open,
  onOpenChange,
  articleId,
  comments,
  onAddComment,
  onLikeComment,
}: CommentDialogProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment, replyTo || undefined);
      setNewComment("");
      setReplyTo(null);
      toast.success("Commentaire publié !");
    } catch (error) {
      toast.error("Erreur lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentItem = ({ comment, level = 0 }: { comment: Comment; level?: number }) => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
      setLiked(!liked);
      onLikeComment(comment.id, !liked);
    };

    return (
      <div className={`py-4 ${level > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <p className="text-sm mb-2 whitespace-pre-wrap break-words">{comment.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : ''}`} />
                {comment.like_count > 0 && <span>{comment.like_count}</span>}
              </button>
              <button
                onClick={() => setReplyTo(comment.id)}
                className="hover:text-primary transition-colors"
              >
                Répondre
              </button>
            </div>
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Commentaires</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          {comments.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Aucun commentaire pour le moment
            </div>
          ) : (
            <div className="divide-y">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          {replyTo && (
            <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
              <span>Réponse en cours...</span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-primary hover:underline"
              >
                Annuler
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 resize-none min-h-[44px] max-h-32"
              rows={1}
            />
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              size="icon"
              className="h-11 w-11 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};