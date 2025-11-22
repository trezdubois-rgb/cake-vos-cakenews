import { MessageCircle, Loader2, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useComments } from "@/hooks/useComments";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  const totalComments = countComments(comments);

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "popular") {
      return b.like_count - a.like_count;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Commentaires ({totalComments})
          </CardTitle>
          {comments.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("recent")}
                className="h-8"
              >
                <Clock className="w-4 h-4 mr-1" />
                Récents
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
                className="h-8"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Populaires
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment input - Always visible with better UX */}
        <div>
          {user ? (
            <CommentInput
              onSubmit={(content) => addComment(content)}
              submitting={submitting}
            />
          ) : (
            <div 
              onClick={() => navigate("/auth")}
              className="cursor-pointer group"
            >
              <div className="relative">
                <textarea
                  placeholder="💬 Qu'en pensez-vous ? Partagez votre avis..."
                  className="w-full min-h-[80px] p-3 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 resize-none cursor-pointer group-hover:border-primary/50 transition-colors"
                  readOnly
                  onClick={() => navigate("/auth")}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-background/95 backdrop-blur px-4 py-2 rounded-lg border shadow-sm">
                    <p className="text-sm font-medium text-foreground">
                      🔐 Connectez-vous pour commenter
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button size="sm" className="pointer-events-none opacity-60">
                  Publier
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold mb-1">Aucun commentaire pour le moment</p>
            <p className="text-sm">Soyez le premier à partager votre avis ! 💭</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedComments.map((comment) => (
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
