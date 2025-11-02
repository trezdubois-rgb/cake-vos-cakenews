<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Accueil = () => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
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
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      if (!data || data.length === 0) {
        setFeedItems([]);
        setLoading(false);
        return;
      }

      const formattedItems = data.map((article: any) => ({
        id: article.id,
        type: "article" as const,
        slug: article.id,
        category: article.category || "Non catégorisé",
        title: article.title,
        excerpt: article.excerpt || article.title,
        contentHtml: article.content_html,
        heroSrc: article.hero_image_url || "/placeholder.svg",
        heroLqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z",
        videoHls: article.hero_video_url,
        author: {
          id: article.author_id,
          name: article.profiles?.display_name || "Auteur",
          avatar: article.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author_id}`,
        },
        tags: article.tags || [],
        engagement: {
          likes: article.like_count || 0,
          views: article.view_count || 0,
          shares: 0,
        },
        publishedAt: article.published_at || article.created_at,
      }));

      setFeedItems(formattedItems);
    } catch (error) {
      console.error("Error fetching articles:", error);
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des articles...</p>
=======
      <div className="min-h-screen bg-background p-4">
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (feedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Aucun article disponible</h2>
          <p className="text-muted-foreground">Les articles publiés apparaîtront ici.</p>
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-background">
      <FeedContainer items={feedItems} />
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    </div>
  );
};

<<<<<<< HEAD
export default Accueil;
=======
export default Accueil;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
