<<<<<<< HEAD
import { Heart, History, Plus, Settings, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LazyImage } from '@/components/ui/LazyImage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserPreference {
  id: string;
  type: 'tag' | 'author' | 'category';
  value: string;
}

type PreferenceType = 'tag' | 'author' | 'category';

interface Article {
  id: string;
  title: string;
  summary?: string;
  excerpt?: string;
  image_url?: string;
  hero_image_url?: string;
  author: string;
  author_id?: string;
  published_at: string;
}

const Profil = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [newPreference, setNewPreference] = useState<{ type: PreferenceType; value: string }>({ type: 'tag', value: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [readingHistory, setReadingHistory] = useState<Article[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { toast: toastHook } = useToast();

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await Promise.all([
        loadPreferences(),
        loadFavorites(),
        loadHistory(),
        loadAvatar(),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvatar = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      } else {
        setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('id, type, value')
        .eq('user_id', user.id);

      if (error) throw error;
      setPreferences((data ?? []).map((p) => ({ ...p, type: p.type as PreferenceType })));
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    setIsLoadingFavorites(true);
    try {
      const { data: favorites, error } = await supabase
        .from('user_favorites')
        .select(`
          article_id,
          articles:article_id (
            id,
            title,
            excerpt,
            hero_image_url,
            author_id,
            published_at,
            profiles:author_id (
              display_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted: Article[] = (favorites ?? [])
        .filter((f: any) => f.articles)
        .map((f: any) => ({
          id: f.articles.id,
          title: f.articles.title,
          summary: f.articles.excerpt,
          image_url: f.articles.hero_image_url,
          hero_image_url: f.articles.hero_image_url,
          author: f.articles.profiles?.display_name ?? 'Auteur',
          author_id: f.articles.author_id,
          published_at: f.articles.published_at,
        }));

      setFavoriteArticles(formatted);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const loadHistory = async () => {
    if (!user) return;

    setIsLoadingHistory(true);
    try {
      const { data: history, error } = await supabase
        .from('view_tracking')
        .select(`
          article_id,
          viewed_at,
          articles:article_id (
            id,
            title,
            excerpt,
            hero_image_url,
            author_id,
            published_at,
            profiles:author_id (
              display_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formatted: Article[] = (history ?? [])
        .filter((h: any) => h.articles)
        .map((h: any) => ({
          id: h.articles.id,
          title: h.articles.title,
          summary: h.articles.excerpt,
          image_url: h.articles.hero_image_url,
          hero_image_url: h.articles.hero_image_url,
          author: h.articles.profiles?.display_name ?? 'Auteur',
          author_id: h.articles.author_id,
          published_at: h.viewed_at,
        }));

      setReadingHistory(formatted);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // TODO: Implement avatar upload to Supabase Storage
    toastHook({
      title: 'Info',
      description: 'Upload d\'avatar - fonctionnalité en développement',
    });
  };

  const addPreference = async () => {
    if (!user || !newPreference.value.trim()) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          type: newPreference.type,
          value: newPreference.value.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences([...preferences, { ...data, type: data.type as PreferenceType }]);
      setNewPreference({ type: 'tag', value: '' });
      toast.success('Préférence ajoutée');
    } catch (error) {
      console.error('Error adding preference:', error);
      toast.error('Erreur lors de l\'ajout de la préférence');
    }
  };

  const removePreference = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(preferences.filter((pref) => pref.id !== id));
      toast.success('Préférence supprimée');
    } catch (error) {
      console.error('Error removing preference:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const removeFavorite = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', id);

      if (error) throw error;

      setFavoriteArticles(favoriteArticles.filter((article) => article.id !== id));
      toast.success('Article retiré des favoris');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const removeFromHistory = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('view_tracking')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', id);

      if (error) throw error;

      setReadingHistory(readingHistory.filter((article) => article.id !== id));
      toast.success('Article retiré de l\'historique');
    } catch (error) {
      console.error('Error removing from history:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Connectez-vous pour accéder à votre profil</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Mon Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt="Avatar"
                className="w-20 h-20 rounded-full bg-muted"
              />
              <div>
                <h2 className="text-xl font-semibold">{user.email}</h2>
                <p className="text-sm text-muted-foreground">Membre depuis {new Date(user.created_at ?? '').toLocaleDateString('fr-FR')}</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" aria-label="Changer l'avatar">
                <Button variant="outline" size="sm" asChild>
                  <span>Changer l'avatar</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <select
                value={newPreference.type}
                onChange={(e) => setNewPreference({ ...newPreference, type: e.target.value as PreferenceType })}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="tag">Tag</option>
                <option value="author">Auteur</option>
                <option value="category">Catégorie</option>
              </select>
              <Input
                placeholder="Ajouter une préférence..."
                value={newPreference.value}
                onChange={(e) => setNewPreference({ ...newPreference, value: e.target.value })}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addPreference();
                  }
                }}
              />
              <Button onClick={addPreference} size="sm">
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <Badge key={pref.id} variant="secondary" className="gap-1">
                  {pref.type}: {pref.value}
                  <button onClick={() => removePreference(pref.id)} className="ml-1" aria-label="Supprimer">
                    <X size={12} />
                  </button>
                </Badge>
              ))}
              {preferences.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune préférence</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Articles favoris et historique */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart size={16} />
              Favoris ({favoriteArticles.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History size={16} />
              Historique ({readingHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="mt-4">
            {isLoadingFavorites ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : favoriteArticles.length === 0 ? (
              <div className="text-center py-8">
                <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun article en favori</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteArticles.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {article.image_url && (
                          <LazyImage
                            src={article.image_url}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{article.title}</h4>
                          {article.summary && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{article.author}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavorite(article.id)}
                          className="text-destructive hover:text-destructive"
                          aria-label="Retirer des favoris"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement...</p>
              </div>
            ) : readingHistory.length === 0 ? (
              <div className="text-center py-8">
                <History size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun article dans l&apos;historique</p>
              </div>
            ) : (
              <div className="space-y-3">
                {readingHistory.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {article.image_url && (
                          <LazyImage
                            src={article.image_url}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{article.title}</h4>
                          {article.summary && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{article.author}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromHistory(article.id)}
                          className="text-destructive hover:text-destructive"
                          aria-label="Retirer de l'historique"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
=======
import { useState, useEffect } from "react";
import { User, Settings, Heart, Bookmark, Clock, Download, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserPreference {
  id: string;
  type: 'tag' | 'author' | 'category' | 'format';
  value: string;
  weight: number;
}

const mockPreferences: UserPreference[] = [
  { id: "1", type: "tag", value: "technologie", weight: 0.9 },
  { id: "2", type: "tag", value: "ia", weight: 0.8 },
  { id: "3", type: "category", value: "Tech", weight: 0.7 },
  { id: "4", type: "author", value: "Sarah Tech", weight: 0.6 },
  { id: "5", type: "format", value: "article", weight: 0.5 },
];

const Profil = () => {
  const [preferences, setPreferences] = useState(mockPreferences);
  const [newPreference, setNewPreference] = useState({ type: 'tag', value: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 400);
  }, []);

  const addPreference = () => {
    if (newPreference.value.trim()) {
      const preference: UserPreference = {
        id: Date.now().toString(),
        type: newPreference.type as any,
        value: newPreference.value.trim(),
        weight: 0.7
      };
      setPreferences([...preferences, preference]);
      setNewPreference({ type: 'tag', value: '' });
    }
  };

  const removePreference = (id: string) => {
    setPreferences(preferences.filter(p => p.id !== id));
  };

  const getPreferenceTypeLabel = (type: string) => {
    switch (type) {
      case 'tag': return 'Sujet';
      case 'author': return 'Auteur';
      case 'category': return 'Catégorie';
      case 'format': return 'Format';
      default: return type;
    }
  };

  const getPreferenceTypeColor = (type: string) => {
    switch (type) {
      case 'tag': return 'primary';
      case 'author': return 'secondary';
      case 'category': return 'success';
      case 'format': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Mon Profil</h1>
          <p className="text-muted-foreground">user@example.com</p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="settings">Réglages</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  Mes Préférences de Contenu
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Personnalisez votre flux en sélectionnant vos sujets et auteurs favoris.
                </p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="skeleton w-16 h-6 rounded-full" />
                          <div className="skeleton h-5 w-32 rounded" />
                        </div>
                        <div className="skeleton w-8 h-8 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Add new preference */}
                    <div className="flex gap-2 mb-4">
                      <select
                        value={newPreference.type}
                        onChange={(e) => setNewPreference({ ...newPreference, type: e.target.value })}
                        className="px-3 py-2 border border-border rounded-md text-sm"
                      >
                        <option value="tag">Sujet</option>
                        <option value="author">Auteur</option>
                        <option value="category">Catégorie</option>
                        <option value="format">Format</option>
                      </select>
                      <Input
                        placeholder="Ajouter une préférence..."
                        value={newPreference.value}
                        onChange={(e) => setNewPreference({ ...newPreference, value: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addPreference()}
                      />
                      <Button onClick={addPreference} size="sm">
                        <Plus size={16} />
                      </Button>
                    </div>

                    {/* Preferences list */}
                    <div className="space-y-2">
                      {preferences.map(preference => (
                        <div key={preference.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant={getPreferenceTypeColor(preference.type) as any} className="text-xs">
                              {getPreferenceTypeLabel(preference.type)}
                            </Badge>
                            <span className="font-medium">{preference.value}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePreference(preference.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {preferences.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Settings size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Aucune préférence configurée.</p>
                        <p className="text-sm">Ajoutez vos sujets favoris pour personnaliser votre flux.</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark size={20} />
                  Articles Favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-3">
                        <div className="skeleton w-20 h-20 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="skeleton h-5 w-3/4 rounded" />
                          <div className="skeleton h-4 w-1/2 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Aucun article en favori.</p>
                    <p className="text-sm">Vos articles favoris apparaîtront ici.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Historique de Lecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="space-y-2">
                        <div className="skeleton h-3 w-1/4 rounded" />
                        <div className="flex gap-3">
                          <div className="skeleton w-16 h-16 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <div className="skeleton h-4 w-2/3 rounded" />
                            <div className="skeleton h-3 w-1/3 rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Historique vide.</p>
                    <p className="text-sm">Votre historique de lecture sera conservé ici.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de l'Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cache-size">Taille maximale du cache (MB)</Label>
                    <Input id="cache-size" type="number" defaultValue="500" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Limite de stockage hors ligne pour les articles et vidéos.
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications push</h4>
                      <p className="text-sm text-muted-foreground">Recevoir des notifications pour le nouveau contenu</p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Données et Confidentialité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download size={16} className="mr-2" />
                    Exporter mes données (RGPD)
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <Trash2 size={16} className="mr-2" />
                    Supprimer mon compte
                  </Button>
                </CardContent>
              </Card>
            </div>
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profil;