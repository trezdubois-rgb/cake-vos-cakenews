import { MessageCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useComments } from "@/hooks/useComments";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CommentSystemProps {
  articleId: string;
}

export const CommentSystem = ({ articleId }: CommentSystemProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    comments,
    loading,
    submitting,
    addComment,
    toggleLike,
    deleteComment,
  } = useComments(articleId);

  const totalComments = countComments(comments);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Commentaires ({totalComments})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment input */}
        {user ? (
          <div>
            <CommentInput
              onSubmit={(content) => addComment(content)}
              submitting={submitting}
            />
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-3">
              Connectez-vous pour commenter
            </p>
            <Button onClick={() => navigate("/auth")}>Se connecter</Button>
          </div>
        )}

        <Separator />

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Aucun commentaire pour le moment</p>
            <p className="text-sm mt-1">Soyez le premier à commenter !</p>
          </div>
        ) : (
          <div className="space-y-1">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={toggleLike}
                onReply={addComment}
                onDelete={deleteComment}
                submitting={submitting}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to count total comments including replies
function countComments(comments: any[]): number {
  let count = 0;
  for (const comment of comments) {
    count++;
    if (comment.replies) {
      count += countComments(comment.replies);
    }
  }
  return count;
}
