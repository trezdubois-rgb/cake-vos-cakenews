import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Comment } from "@/hooks/useComments";
import { CommentInput } from "./CommentInput";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (content: string, parentId: string) => Promise<void>;
  onDelete: (commentId: string) => void;
  depth?: number;
  submitting?: boolean;
}

export const CommentItem = ({
  comment,
  onLike,
  onReply,
  onDelete,
  depth = 0,
  submitting = false,
}: CommentItemProps) => {
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const maxDepth = 2;

  const handleReply = async (content: string) => {
    await onReply(content, comment.id);
    setShowReplyInput(false);
  };

  const isAuthor = user?.id === comment.user_id;

  return (
    <div className={`${depth > 0 ? "ml-8 mt-3" : "mt-4"}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={comment.user.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {comment.user.display_name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {comment.user.display_name || "Utilisateur"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-muted-foreground">(modifié)</span>
            )}
          </div>

          {/* Comment text */}
          <p className="text-sm text-foreground whitespace-pre-wrap break-words mb-2">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 gap-1 ${
                comment.is_liked ? "text-red-500" : "text-muted-foreground"
              }`}
              onClick={() => onLike(comment.id)}
            >
              <Heart
                className="w-4 h-4"
                fill={comment.is_liked ? "currentColor" : "none"}
              />
              {comment.like_count > 0 && (
                <span className="text-xs">{comment.like_count}</span>
              )}
            </Button>

            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 text-muted-foreground"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">Répondre</span>
              </Button>
            )}

            {isAuthor && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(comment.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                onSubmit={handleReply}
                placeholder={`Répondre à ${comment.user.display_name}...`}
                autoFocus
                onCancel={() => setShowReplyInput(false)}
                submitting={submitting}
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                  onDelete={onDelete}
                  depth={depth + 1}
                  submitting={submitting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
