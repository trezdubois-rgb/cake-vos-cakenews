import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { ArticleActions } from "@/components/article/ArticleActions";
import { CommentSystem } from "@/components/comments/CommentSystem";
import { ArticleSEO } from "@/components/SEO";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  category: string;
  content_html: string;
  excerpt?: string;
  tags: string[];
  hero_image_url: string | null;
  hero_video_url: string | null;
  view_count: number;
  like_count: number;
  created_at: string;
  author_id: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchComments();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error) throw error;
      setArticle(data as any);

      // Increment view count
      await supabase
        .from("articles")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", id);
    } catch (error: any) {
      toast.error("Article introuvable");
    } finally {
      setLoading(false);
    }
  };



// ... (inside Article component)

  const fetchComments = async () => {
    try {
      // Fetch ALL comments for this article in one query
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq("article_id", id)
        .order("created_at", { ascending: true }); // Get oldest first to build tree correctly

      if (error) throw error;

      if (!data) {
        setComments([]);
        return;
      }

      // Use utility function to build tree
      const rootComments = buildCommentTree(data);
      setComments(rootComments);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Connectez-vous pour commenter");
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          article_id: id,
          user_id: user.id,
          content,
          parent_id: parentId || null,
        });

      if (error) throw error;
      
      // Recharger immédiatement les commentaires
      await fetchComments();
      toast.success("Commentaire publié !");
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Connectez-vous pour liker");
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from("comment_likes")
        .select("id")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingLike) {
        await supabase
          .from("comment_likes")
          .delete()
          .eq("id", existingLike.id);

        await supabase.rpc("decrement_comment_likes", { comment_id: commentId });
      } else {
        await supabase
          .from("comment_likes")
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });

        await supabase.rpc("increment_comment_likes", { comment_id: commentId });
      }

      fetchComments();
    } catch (error: any) {
      console.error("Error liking comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article introuvable</h1>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <ArticleSEO
        title={article.title}
        excerpt={article.excerpt || article.title}
        heroImage={article.hero_image_url || undefined}
        publishedAt={article.created_at}
        authorName={article.profiles?.display_name || "Auteur"}
        tags={article.tags}
        slug={article.id}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>

        {/* Article Header */}
        <Badge variant="destructive" className="mb-4 text-sm font-bold uppercase">
          {article.category}
        </Badge>
        
        <h1 className="text-4xl font-extrabold leading-tight mb-4 text-foreground">
          {article.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={article.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_id}`}
            alt={article.profiles?.display_name || "Auteur"}
            className="w-12 h-12 rounded-full bg-muted ring-2 ring-border"
          />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground">
              {article.profiles?.display_name || "Auteur"}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{article.view_count?.toLocaleString() || 0} vues</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Media */}
        {(article.hero_image_url || article.hero_video_url) && (
          <div className="relative aspect-video mb-8 rounded-2xl overflow-hidden bg-muted">
            {article.hero_video_url ? (
              <div className="relative w-full h-full">
                <video
                  className="w-full h-full object-cover"
                  poster={article.hero_image_url || undefined}
                  controls
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src={article.hero_video_url} type="video/mp4" />
                </video>
              </div>
            ) : (
              <img
                src={article.hero_image_url || ''}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:font-semibold prose-strong:text-foreground prose-strong:font-bold mb-8"
          dangerouslySetInnerHTML={{ __html: article.content_html }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pt-6 border-t border-border/50">
            {article.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-sm font-medium px-3 py-1.5">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSystem articleId={article.id} />
        </div>
      </div>

      {/* Fixed Action Bar */}
      <ArticleActions
        articleId={article.id}
        authorId={article.author_id}
        authorName={article.profiles?.display_name || "Auteur"}
        category={article.category}
        tags={article.tags || []}
        initialLikeCount={article.like_count || 0}
      />
    </div>
  );
}
