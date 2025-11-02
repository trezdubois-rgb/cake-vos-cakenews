import { Heart, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ArticleActionsProps {
  articleId: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  initialLikeCount: number;
}

export function ArticleActions({
  articleId,
  initialLikeCount,
}: ArticleActionsProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && articleId) {
      loadUserInteractions();
    }
  }, [user, articleId]);

  const loadUserInteractions = async () => {
    if (!user || !articleId) return;

    try {
      const { data: interaction } = await supabase
        .from('user_interactions')
        .select('liked, favorited')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .maybeSingle();

      if (interaction) {
        setLiked(interaction.liked ?? false);
        setFavorited(interaction.favorited ?? false);
      }

      const { data: favorite } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .maybeSingle();

      if (favorite) {
        setFavorited(true);
      }
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Connectez-vous pour liker un article');
      return;
    }

    if (loading) return;

    setLoading(true);
    const newLiked = !liked;

    try {
      // Upsert user_interactions
      const { error: interactionError } = await supabase
        .from('user_interactions')
        .upsert(
          {
            user_id: user.id,
            article_id: articleId,
            liked: newLiked,
          },
          {
            onConflict: 'user_id,article_id',
          }
        );

      if (interactionError) throw interactionError;

      // Update article like_count
      const increment = newLiked ? 1 : -1;
      const { error: updateError } = await supabase.rpc('increment_likes', {
        article_id: articleId,
        increment_value: increment,
      });

      if (updateError) {
        // Fallback: direct update if RPC doesn't exist
        const { data: article } = await supabase
          .from('articles')
          .select('like_count')
          .eq('id', articleId)
          .single();

        if (article) {
          await supabase
            .from('articles')
            .update({ like_count: (article.like_count ?? 0) + increment })
            .eq('id', articleId);
        }
      }

      setLiked(newLiked);
      setLikeCount((prev) => prev + increment);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Erreur lors du like');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }

    if (loading) return;

    setLoading(true);
    const newFavorited = !favorited;

    try {
      if (newFavorited) {
        // Add to favorites
        const { error: favError } = await supabase.from('user_favorites').insert({
          user_id: user.id,
          article_id: articleId,
        });

        if (favError && favError.code !== '23505') throw favError;

        // Update user_interactions
        await supabase
          .from('user_interactions')
          .upsert(
            {
              user_id: user.id,
              article_id: articleId,
              favorited: true,
            },
            {
              onConflict: 'user_id,article_id',
            }
          );

        toast.success('Ajouté aux favoris');
      } else {
        // Remove from favorites
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId);

        // Update user_interactions
        await supabase
          .from('user_interactions')
          .update({ favorited: false })
          .eq('user_id', user.id)
          .eq('article_id', articleId);

        toast.success('Retiré des favoris');
      }

      setFavorited(newFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });

        // Track share (optional)
        if (user) {
          try {
            await supabase.from('user_interactions').upsert(
              {
                user_id: user.id,
                article_id: articleId,
              },
              {
                onConflict: 'user_id,article_id',
              }
            );
          } catch {
            // Silent fail for tracking
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          fallbackShare(url);
        }
      }
    } else {
      fallbackShare(url);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Lien copié dans le presse-papiers');
      })
      .catch(() => {
        toast.error('Impossible de copier le lien');
      });
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      role="toolbar"
      aria-label="Actions sur l'article"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={liked ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            disabled={loading}
            aria-label={liked ? 'Retirer le like' : 'Liker l\'article'}
            aria-pressed={liked}
            className="gap-2"
          >
            <Heart
              size={18}
              className={liked ? 'fill-current' : ''}
              aria-hidden="true"
            />
            <span>{likeCount}</span>
          </Button>

          <Button
            variant={favorited ? 'default' : 'outline'}
            size="sm"
            onClick={handleFavorite}
            disabled={loading}
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={favorited}
            className="gap-2"
          >
            {favorited ? (
              <BookmarkCheck size={18} aria-hidden="true" />
            ) : (
              <Bookmark size={18} aria-hidden="true" />
            )}
            <span className="sr-only">Favoris</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            aria-label="Partager l'article"
            className="gap-2"
          >
            <Share2 size={18} aria-hidden="true" />
            <span>Partager</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

