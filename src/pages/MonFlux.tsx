import { useEffect, useState, useMemo } from 'react';

import ArticleViewer from '../components/article-viewer/ArticleViewer';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';

interface FeedArticle {
  id: string;
  title: string;
  excerpt?: string;
  contentHtml: string;
  heroSrc?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  category: string;
  engagement: {
    likes: number;
    views: number;
    shares: number;
  };
  publishedAt: string;
}

const MonFlux = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<FeedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<{ type: string; value: string }[]>([]);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  useEffect(() => {
    loadArticles();
  }, [preferences]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('type, value')
        .eq('user_id', user.id);

      if (error) throw error;
      setPreferences(data ?? []);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from('articles')
        .select(
          `
          id,
          title,
          excerpt,
          content_html,
          hero_image_url,
          tags,
          category,
          like_count,
          view_count,
          published_at,
          author_id,
          profiles:author_id (
            display_name,
            avatar_url
          )
        `
        )
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(20);

      const { data, error } = await query;

      if (error) throw error;

      const formattedArticles: FeedArticle[] = (data ?? []).map((article: any) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        contentHtml: article.content_html,
        heroSrc: article.hero_image_url,
        author: {
          id: article.author_id,
          name: article.profiles?.display_name ?? 'Auteur',
          avatar:
            article.profiles?.avatar_url ??
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_id}`,
        },
        tags: article.tags ?? [],
        category: article.category ?? 'Général',
        engagement: {
          likes: article.like_count ?? 0,
          views: article.view_count ?? 0,
          shares: 0, // TODO: Add share tracking
        },
        publishedAt: article.published_at ?? article.created_at,
      }));

      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    if (preferences.length === 0) return articles;

    return articles.filter((article) => {
      // Match by tags
      const tagMatches = preferences.some(
        (pref) =>
          pref.type === 'tag' &&
          article.tags.some((tag) => tag.toLowerCase().includes(pref.value.toLowerCase()))
      );

      // Match by author
      const authorMatches = preferences.some(
        (pref) =>
          pref.type === 'author' &&
          article.author.name.toLowerCase().includes(pref.value.toLowerCase())
      );

      // Match by category
      const categoryMatches = preferences.some(
        (pref) =>
          pref.type === 'category' &&
          article.category.toLowerCase().includes(pref.value.toLowerCase())
      );

      return tagMatches || authorMatches || categoryMatches;
    });
  }, [articles, preferences]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du feed...</p>
        </div>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Aucun article ne correspond à vos préférences</p>
          <p className="text-sm text-muted-foreground">
            Modifiez vos préférences dans votre profil pour voir plus de contenu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ArticleViewer articles={filteredArticles} />
    </div>
  );
};

export default MonFlux;
