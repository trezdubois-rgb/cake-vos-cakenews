import { MessageCircle, Heart, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies: Comment[];
}

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  onReply,
  onLike,
  depth = 0,
}: {
  comment: Comment;
  onReply: (commentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  depth?: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className={cn('flex gap-3', depth > 0 && 'ml-12 mt-3')}>
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full bg-muted flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-muted/50 rounded-2xl px-4 py-2">
          <p className="font-semibold text-sm text-foreground">{comment.author.name}</p>
          <p className="text-sm text-foreground/90 mt-1">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 mt-1 px-2">
          <button
            onClick={() => onLike(comment.id)}
            className={cn(
              'flex items-center gap-1 text-xs',
              comment.isLiked ? 'text-like font-semibold' : 'text-muted-foreground'
            )}
          >
            <Heart size={14} className={comment.isLiked ? 'fill-current' : ''} />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>

          {depth < 2 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Répondre
            </button>
          )}

          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {showReplyForm && (
          <div className="flex gap-2 mt-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Votre réponse..."
              className="min-h-[60px] resize-none"
            />
            <Button onClick={handleSubmitReply} size="sm" className="flex-shrink-0">
              <Send size={16} />
            </Button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentSection = ({
  comments,
  onAddComment,
  onLikeComment,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-muted/30 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {comments.length > 0 ? `${comments.length} commentaires` : 'Ajouter un commentaire'}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-background/95 backdrop-blur-lg rounded-t-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-foreground">Commentaires ({comments.length})</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
          Réduire
        </Button>
      </div>

      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="min-h-[80px] resize-none"
        />
        <Button onClick={handleSubmit} disabled={!newComment.trim()} className="flex-shrink-0">
          <Send size={16} />
        </Button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(commentId, content) => onAddComment(content, commentId)}
            onLike={onLikeComment}
          />
        ))}
      </div>
    </div>
  );
};