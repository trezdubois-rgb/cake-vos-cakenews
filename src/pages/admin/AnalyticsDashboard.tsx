import { BarChart3, TrendingUp, Users, Eye, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalArticles: number;
  publishedArticles: number;
  totalViews: number;
  totalLikes: number;
  totalUsers: number;
  articlesPerDay: Array<{ date: string; count: number }>;
  viewsPerDay: Array<{ date: string; views: number }>;
  topArticles: Array<{ title: string; views: number; likes: number }>;
  userGrowth: Array<{ date: string; users: number }>;
}

export default function AnalyticsDashboard() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalArticles: 0,
    publishedArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalUsers: 0,
    articlesPerDay: [],
    viewsPerDay: [],
    topArticles: [],
    userGrowth: [],
  });

  useEffect(() => {
    if (user && isAdmin) {
      loadAnalytics();
    }
  }, [user, isAdmin]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load basic stats
      const [articlesRes, usersRes] = await Promise.all([
        supabase
          .from('articles')
          .select('id, view_count, like_count, published_at, published, title')
          .order('published_at', { ascending: false }),
        supabase.from('profiles').select('id, created_at'),
      ]);

      if (articlesRes.error) throw articlesRes.error;
      if (usersRes.error) throw usersRes.error;

      const articles = articlesRes.data ?? [];
      const users = usersRes.data ?? [];
      const published = articles.filter((a) => a.published);

      // Calculate totals
      const totalViews = articles.reduce((sum, a) => sum + (a.view_count ?? 0), 0);
      const totalLikes = articles.reduce((sum, a) => sum + (a.like_count ?? 0), 0);

      // Articles per day (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const articlesPerDayMap = new Map<string, number>();
      const viewsPerDayMap = new Map<string, number>();

      published
        .filter((a) => a.published_at && new Date(a.published_at) >= thirtyDaysAgo)
        .forEach((article) => {
          const date = new Date(article.published_at).toISOString().split('T')[0];
          articlesPerDayMap.set(date, (articlesPerDayMap.get(date) ?? 0) + 1);
          viewsPerDayMap.set(date, (viewsPerDayMap.get(date) ?? 0) + (article.view_count ?? 0));
        });

      const articlesPerDay = Array.from(articlesPerDayMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const viewsPerDay = Array.from(viewsPerDayMap.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Top articles
      const topArticles = [...published]
        .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
        .slice(0, 10)
        .map((a) => ({
          title: a.title.length > 40 ? a.title.substring(0, 40) + '...' : a.title,
          views: a.view_count ?? 0,
          likes: a.like_count ?? 0,
        }));

      // User growth (last 30 days)
      const userGrowthMap = new Map<string, number>();
      let cumulativeUsers = 0;

      users
        .filter((u) => u.created_at && new Date(u.created_at) >= thirtyDaysAgo)
        .forEach((user) => {
          const date = new Date(user.created_at).toISOString().split('T')[0];
          cumulativeUsers++;
          userGrowthMap.set(date, cumulativeUsers);
        });

      const userGrowth = Array.from(userGrowthMap.entries())
        .map(([date, users]) => ({ date, users }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setAnalytics({
        totalArticles: articles.length,
        publishedArticles: published.length,
        totalViews,
        totalLikes,
        totalUsers: users.length,
        articlesPerDay,
        viewsPerDay,
        topArticles,
        userGrowth,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Analyse des performances de votre application</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalArticles}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.publishedArticles} publiés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalViews > 0
                  ? ((analytics.totalLikes / analytics.totalViews) * 100).toFixed(1)
                  : '0'}
                %
              </div>
              <p className="text-xs text-muted-foreground">Taux de like</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Articles publiés (30 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.articlesPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff005c" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vues par jour (30 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.viewsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#ff005c" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.topArticles} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={200} />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Vues" />
                <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        {analytics.userGrowth.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Croissance utilisateurs (30 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}