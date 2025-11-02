<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const MonFlux = () => {
  const [personalizedItems, setPersonalizedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalizedArticles();
  }, []);

  const fetchPersonalizedArticles = async () => {
    try {
      // TODO: Filter based on user preferences stored in profiles table
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
        setPersonalizedItems([]);
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

      setPersonalizedItems(formattedItems);
    } catch (error) {
      console.error("Error fetching personalized articles:", error);
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="h-full">
      <ArticleViewer articles={filteredArticles} />
=======
    <div className="min-h-screen bg-background">
      {/* Header with preferences button */}
      <div className="absolute top-safe-area left-4 right-4 z-20 flex justify-between items-center">
        <h1 className="text-white font-semibold text-lg drop-shadow-lg">Mon Flux</h1>
        <Link to="/profil">
          <Button variant="ghost" size="sm" className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
            <Settings size={18} />
            <span className="ml-2 hidden sm:inline">Préférences</span>
          </Button>
        </Link>
      </div>

      <FeedContainer items={personalizedItems} personalFilter={true} />

      {/* Empty state if no personalized content */}
      {personalizedItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center p-6 bg-card rounded-lg shadow-lg max-w-sm mx-4">
            <h2 className="text-xl font-semibold mb-2">Personnalisez your flux</h2>
            <p className="text-muted-foreground mb-4">
              Configurez vos préférences pour voir du contenu adapté à vos intérêts.
            </p>
            <Link to="/profil">
              <Button>Configurer mes préférences</Button>
            </Link>
          </div>
        </div>
      )}
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    </div>
  );
};

<<<<<<< HEAD
export default MonFlux;
=======
export default MonFlux;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
