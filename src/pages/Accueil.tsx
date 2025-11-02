import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ArticleViewer from '../components/article-viewer/ArticleViewer';
import { Button } from '../components/ui/button';
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

const Accueil = () => {
  const [articles, setArticles] = useState<FeedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
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
          shares: 0,
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div className="absolute top-4 right-4 z-10">
        <Link to="/admin">
          <Button size="sm" variant="outline" className="gap-2">
            <Settings size={16} />
            Admin
          </Button>
        </Link>
      </div>
      <ArticleViewer articles={articles} />
    </div>
  );
};

export default Accueil;
