<<<<<<< HEAD
import { MessageCircle, Heart, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
=======
import { useState } from "react";
import { MessageCircle, Heart, MoreVertical, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

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

<<<<<<< HEAD
const CommentItem = ({
  comment,
  onReply,
  onLike,
  depth = 0,
}: {
  comment: Comment;
  onReply: (commentId: string, content: string) => void;
=======
const CommentItem = ({ 
  comment, 
  onReply, 
  onLike, 
  depth = 0 
}: { 
  comment: Comment; 
  onReply: (commentId: string, content: string) => void; 
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  onLike: (commentId: string) => void;
  depth?: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
<<<<<<< HEAD
  const [replyContent, setReplyContent] = useState('');
=======
  const [replyContent, setReplyContent] = useState("");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
<<<<<<< HEAD
      setReplyContent('');
=======
      setReplyContent("");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      setShowReplyForm(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className={cn('flex gap-3', depth > 0 && 'ml-12 mt-3')}>
=======
    <div className={cn("flex gap-3", depth > 0 && "ml-12 mt-3")}>
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD

=======
        
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        <div className="flex items-center gap-4 mt-1 px-2">
          <button
            onClick={() => onLike(comment.id)}
            className={cn(
<<<<<<< HEAD
              'flex items-center gap-1 text-xs',
              comment.isLiked ? 'text-like font-semibold' : 'text-muted-foreground'
            )}
          >
            <Heart size={14} className={comment.isLiked ? 'fill-current' : ''} />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>

=======
              "flex items-center gap-1 text-xs",
              comment.isLiked ? "text-like font-semibold" : "text-muted-foreground"
            )}
          >
            <Heart size={14} className={comment.isLiked ? "fill-current" : ""} />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>
          
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          {depth < 2 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Répondre
            </button>
          )}
<<<<<<< HEAD

=======
          
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD
            <Button onClick={handleSubmitReply} size="sm" className="flex-shrink-0">
=======
            <Button
              onClick={handleSubmitReply}
              size="sm"
              className="flex-shrink-0"
            >
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
              <Send size={16} />
            </Button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
<<<<<<< HEAD
            {comment.replies.map((reply) => (
=======
            {comment.replies.map(reply => (
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD
  comments,
  onAddComment,
  onLikeComment,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
=======
  articleId,
  comments,
  onAddComment,
  onLikeComment
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
<<<<<<< HEAD
      setNewComment('');
=======
      setNewComment("");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD
            {comments.length > 0 ? `${comments.length} commentaires` : 'Ajouter un commentaire'}
=======
            {comments.length > 0 ? `${comments.length} commentaires` : "Ajouter un commentaire"}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-background/95 backdrop-blur-lg rounded-t-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
<<<<<<< HEAD
        <h3 className="font-semibold text-lg text-foreground">Commentaires ({comments.length})</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
=======
        <h3 className="font-semibold text-lg text-foreground">
          Commentaires ({comments.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
        >
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD
        <Button onClick={handleSubmit} disabled={!newComment.trim()} className="flex-shrink-0">
=======
        <Button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="flex-shrink-0"
        >
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          <Send size={16} />
        </Button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
<<<<<<< HEAD
        {comments.map((comment) => (
=======
        {comments.map(comment => (
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD
};
=======
}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
