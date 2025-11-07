import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Send, MoreVertical, Flag, EyeOff, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  replies?: Comment[];
  isHidden?: boolean;
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }

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
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [reportReason, setReportReason] = useState("spam");
    const [reportDetails, setReportDetails] = useState("");
    const [isReporting, setIsReporting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      };
      checkUser();
    }, []);

    const handleLike = () => {
      setLiked(!liked);
      onLikeComment(comment.id, !liked);
    };

    const handleReaction = async (emoji: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const reaction = comment.reactions?.find(r => r.emoji === emoji);
      if (reaction?.userReacted) {
        // Remove reaction
        const { error } = await supabase
          .from("comment_reactions")
          .delete()
          .eq("comment_id", comment.id)
          .eq("user_id", user.id)
          .eq("emoji", emoji);

        if (!error) {
          toast.success("Réaction retirée");
          // Refresh comments
          window.location.reload();
        }
      } else {
        // Add reaction
        const { error } = await supabase
          .from("comment_reactions")
          .insert({
            comment_id: comment.id,
            user_id: user.id,
            emoji,
          });

        if (!error) {
          toast.success("Réaction ajoutée");
          window.location.reload();
        } else if (error.code === "23505") {
          toast.info("Vous avez déjà réagi avec cet emoji");
        }
      }
    };

    const handleReport = async () => {
      setIsReporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        setIsReporting(false);
        return;
      }

      const { error } = await supabase
        .from("comment_reports")
        .insert({
          comment_id: comment.id,
          reporter_id: user.id,
          reason: reportReason,
          details: reportDetails || null,
        });

      setIsReporting(false);
      setShowReportDialog(false);
      setReportDetails("");

      if (error) {
        if (error.code === "23505") {
          toast.info("Vous avez déjà signalé ce commentaire");
        } else {
          toast.error("Erreur lors du signalement");
        }
      } else {
        toast.success("Commentaire signalé. Merci pour votre vigilance.");
      }
    };

    const handleHide = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté");
        return;
      }

      const { error } = await supabase
        .from("hidden_comments")
        .insert({
          comment_id: comment.id,
          user_id: user.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast.info("Ce commentaire est déjà masqué");
        } else {
          toast.error("Erreur lors du masquage");
        }
      } else {
        toast.success("Commentaire masqué");
        window.location.reload();
      }
    };

    if (comment.isHidden) {
      return (
        <div className={`py-4 ${level > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
          <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2 text-muted-foreground text-sm">
            <EyeOff className="h-4 w-4" />
            <span>Commentaire masqué</span>
          </div>
        </div>
      );
    }

    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

    return (
      <>
        <div className={`py-4 ${level > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Signaler
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleHide}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Masquer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm mb-2 whitespace-pre-wrap break-words">{comment.content}</p>
              
              {/* Reactions */}
              {comment.reactions && comment.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {comment.reactions.map((reaction) => (
                    <button
                      key={reaction.emoji}
                      onClick={() => handleReaction(reaction.emoji)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                        reaction.userReacted
                          ? 'bg-primary/20 border border-primary'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-xs font-medium">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : ''}`} />
                  {comment.like_count > 0 && <span>{comment.like_count}</span>}
                </button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Smile className="h-4 w-4" />
                      <span>Réagir</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <div className="flex gap-1">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(emoji)}
                          className="text-2xl hover:scale-125 transition-transform p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

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

        <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Signaler ce commentaire</AlertDialogTitle>
              <AlertDialogDescription>
                Pourquoi signalez-vous ce commentaire ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={reportReason} onValueChange={setReportReason}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spam" id="spam" />
                  <Label htmlFor="spam">Spam ou contenu indésirable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="harassment" id="harassment" />
                  <Label htmlFor="harassment">Harcèlement ou intimidation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hate_speech" id="hate_speech" />
                  <Label htmlFor="hate_speech">Discours haineux</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="misinformation" id="misinformation" />
                  <Label htmlFor="misinformation">Désinformation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Autre</Label>
                </div>
              </RadioGroup>
              <Textarea
                placeholder="Détails supplémentaires (optionnel)"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleReport} disabled={isReporting}>
                {isReporting ? "Envoi..." : "Signaler"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
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