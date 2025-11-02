<<<<<<< HEAD
import { ArrowLeft, Eye } from 'lucide-react';
import { useEffect, useState , useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { ArticleActions } from '@/components/article/ArticleActions';
import { BlockRenderer } from '@/components/article/BlockRenderer';
import { CommentSection, Comment } from '@/components/article/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/LazyImage';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeHtml } from '@/lib/sanitize';

interface Block {
  id?: string;
  type: string;
  content?: unknown;
}
=======
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { ArticleActions } from "@/components/article/ArticleActions";
import { CommentSection, Comment } from "@/components/article/CommentSection";
import { BlockRenderer } from "@/components/article/BlockRenderer";
import { Block } from "@/components/editor/BlockEditor";
import { toast } from "sonner";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

interface Article {
  id: string;
  title: string;
  category: string;
  content_html: string;
  content_blocks?: Block[];
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

<<<<<<< HEAD
interface SupabaseComment {
  id: string;
  user_id: string;
  content: string;
  like_count: number;
  created_at: string;
  parent_id: string | null;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

=======
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(
          `
          *,
          profiles (
            display_name,
            avatar_url
          )
        `
        )
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      setArticle(data as Article);

      // Increment view count
      await supabase
        .from('articles')
        .update({ view_count: (data.view_count ?? 0) + 1 })
        .eq('id', id);
    } catch (_error) {
      toast.error('Article introuvable');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
=======
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
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          *,
          profiles (
            display_name,
            avatar_url
          )
<<<<<<< HEAD
        `
        )
        .eq('article_id', id)
        .is('parent_id', null)
        .order('created_at', { ascending: false });
=======
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

  const fetchComments = async () => {
    try {
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
        .is("parent_id", null)
        .order("created_at", { ascending: false });
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

      if (error) throw error;

      const formattedComments: Comment[] = await Promise.all(
<<<<<<< HEAD
        (data ?? []).map(async (comment: SupabaseComment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(
              `
=======
        (data || []).map(async (comment: any) => {
          const { data: replies } = await supabase
            .from("comments")
            .select(`
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
              *,
              profiles (
                display_name,
                avatar_url
              )
<<<<<<< HEAD
            `
            )
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });
=======
            `)
            .eq("parent_id", comment.id)
            .order("created_at", { ascending: true });
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

          return {
            id: comment.id,
            author: {
              id: comment.user_id,
<<<<<<< HEAD
              name: comment.profiles?.display_name ?? 'Utilisateur',
              avatar:
                comment.profiles?.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`,
            },
            content: comment.content,
            likes: comment.like_count ?? 0,
            isLiked: false,
            createdAt: comment.created_at,
            replies: (replies ?? []).map((reply: SupabaseComment) => ({
              id: reply.id,
              author: {
                id: reply.user_id,
                name: reply.profiles?.display_name ?? 'Utilisateur',
                avatar:
                  reply.profiles?.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user_id}`,
              },
              content: reply.content,
              likes: reply.like_count ?? 0,
=======
              name: comment.profiles?.display_name || "Utilisateur",
              avatar: comment.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`,
            },
            content: comment.content,
            likes: comment.like_count || 0,
            isLiked: false,
            createdAt: comment.created_at,
            replies: (replies || []).map((reply: any) => ({
              id: reply.id,
              author: {
                id: reply.user_id,
                name: reply.profiles?.display_name || "Utilisateur",
                avatar: reply.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.user_id}`,
              },
              content: reply.content,
              likes: reply.like_count || 0,
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
              isLiked: false,
              createdAt: reply.created_at,
              replies: [],
            })),
          };
        })
      );

      setComments(formattedComments);
<<<<<<< HEAD
    } catch (_error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchComments();
    }
  }, [id, fetchArticle, fetchComments]);

  const handleAddComment = async (content: string, parentId?: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
=======
    } catch (error: any) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      return;
    }

    try {
<<<<<<< HEAD
      const { error } = await supabase.from('comments').insert({
        article_id: id,
        user_id: user.id,
        content,
        parent_id: parentId ?? null,
      });

      if (error) throw error;
      toast.success('Commentaire ajouté');
      fetchComments();
    } catch (_error) {
=======
      const { error } = await supabase
        .from("comments")
        .insert({
          article_id: id,
          user_id: user.id,
          content,
          parent_id: parentId || null,
        });

      if (error) throw error;
      toast.success("Commentaire ajouté");
      fetchComments();
    } catch (error: any) {
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleLikeComment = async (commentId: string) => {
<<<<<<< HEAD
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Vous devez être connecté pour liker');
=======
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Vous devez être connecté pour liker");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      return;
    }

    try {
      const { data: existingLike } = await supabase
<<<<<<< HEAD
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        await supabase.from('comment_likes').delete().eq('id', existingLike.id);

        await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
      } else {
        await supabase.from('comment_likes').insert({
          comment_id: commentId,
          user_id: user.id,
        });

        await supabase.rpc('increment_comment_likes', { comment_id: commentId });
      }

      fetchComments();
    } catch (_error) {
      console.error('Error liking comment:', error);
=======
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
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD

=======
        
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        <h1 className="text-4xl font-extrabold leading-tight mb-4 text-foreground">
          {article.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-6">
          <img
<<<<<<< HEAD
            src={
              article.profiles?.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_id}`
            }
            alt={article.profiles?.display_name ?? 'Auteur'}
=======
            src={article.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_id}`}
            alt={article.profiles?.display_name || "Auteur"}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
            className="w-12 h-12 rounded-full bg-muted ring-2 ring-border"
          />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground">
<<<<<<< HEAD
              {article.profiles?.display_name ?? 'Auteur'}
=======
              {article.profiles?.display_name || "Auteur"}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD
        {(article.hero_image_url ?? article.hero_video_url) && (
=======
        {(article.hero_image_url || article.hero_video_url) && (
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          <div className="relative aspect-video mb-8 rounded-2xl overflow-hidden bg-muted">
            {article.hero_video_url ? (
              <div className="relative w-full h-full">
                <video
                  className="w-full h-full object-cover"
<<<<<<< HEAD
                  poster={article.hero_image_url ?? undefined}
=======
                  poster={article.hero_image_url || undefined}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                  controls
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src={article.hero_video_url} type="video/mp4" />
<<<<<<< HEAD
                  <track kind="captions" label="Captions" />
                  Votre navigateur ne supporte pas l'élément vidéo.
=======
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                </video>
              </div>
            ) : (
              <img
<<<<<<< HEAD
                src={article.hero_image_url ?? ''}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                fetchPriority="high"
=======
                src={article.hero_image_url || ''}
                alt={article.title}
                className="w-full h-full object-cover"
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
              />
            )}
          </div>
        )}

        {/* Article Content */}
        {article.content_blocks && article.content_blocks.length > 0 ? (
          <div className="mb-8">
            <BlockRenderer blocks={article.content_blocks} />
          </div>
        ) : (
<<<<<<< HEAD
          <>
            {/* eslint-disable react/no-danger */}
            <div
              className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:font-semibold prose-strong:text-foreground prose-strong:font-bold mb-8"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content_html) }}
            />
            {/* eslint-enable react/no-danger */}
          </>
=======
          <div 
            className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:font-semibold prose-strong:text-foreground prose-strong:font-bold mb-8"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pt-6 border-t border-border/50">
<<<<<<< HEAD
            {article.tags.map((tag) => (
=======
            {article.tags.map(tag => (
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
              <Badge key={tag} variant="secondary" className="text-sm font-medium px-3 py-1.5">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection
            articleId={article.id}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        </div>
      </div>

      {/* Fixed Action Bar */}
      <ArticleActions
        articleId={article.id}
        authorId={article.author_id}
<<<<<<< HEAD
        authorName={article.profiles?.display_name ?? 'Auteur'}
        category={article.category}
        tags={article.tags ?? []}
        initialLikeCount={article.like_count ?? 0}
      />
    </div>
  );
}
=======
        authorName={article.profiles?.display_name || "Auteur"}
        category={article.category}
        tags={article.tags || []}
        initialLikeCount={article.like_count || 0}
      />
    </div>
  );
}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
