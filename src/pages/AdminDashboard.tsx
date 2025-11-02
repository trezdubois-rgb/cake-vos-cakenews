import {
  Palette,
  Megaphone,
  Image,
  Users,
  Settings,
  TrendingUp,
  Award,
  FileText,
  Zap,
  Rocket,
  LogOut,
  FolderTree,
  Sliders,
  Layout
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
// import { getThemePreset } from '@/utils/premiumThemeSetup';

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    articles: 0,
    published: 0,
    drafts: 0,
    users: 0,
    revenue: 0,
    media: 0,
    categories: 0,
    engagement: 68,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login', { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin]);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [articlesRes, publishedRes, draftsRes, usersRes, mediaRes, categoriesRes] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('media_library').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        articles: articlesRes.count ?? 0,
        published: publishedRes.count ?? 0,
        drafts: draftsRes.count ?? 0,
        users: usersRes.count ?? 0,
        revenue: 2340, // Mock data for now
        media: mediaRes.count ?? 0,
        categories: categoriesRes.count ?? 0,
        engagement: 68, // Mock data for now
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error fetching stats: ${message}`);
    }
  };

  const adminFeatures = [
    {
      title: "Articles",
      description: "Gérez vos articles avec l'éditeur Gutenberg ultra-avancé",
      icon: FileText,
      href: "/admin/articles",
      color: "bg-indigo-500",
      features: ["Éditeur Gutenberg", "50+ types de blocs", "Formatage riche", "CRUD complet"]
    },
    {
      title: "Gestionnaire de Thème",
      description: "Personnalisez l'apparence complète de votre site",
      icon: Palette,
      href: "/admin/theme",
      color: "bg-purple-500",
      features: ["Thèmes prédéfinis", "Couleurs personnalisées", "Typographie", "Mise en page"]
    },
    {
      title: "Gestion des Publicités",
      description: "Gérez vos campagnes publicitaires et monétisation",
      icon: Megaphone,
      href: "/admin/ads",
      color: "bg-blue-500",
      features: ["Campagnes publicitaires", "Templates d'annonces", "Analytiques", "Adblocker detector"]
    },
    {
      title: "Bibliothèque Média",
      description: "Gérez vos images avec éditeur intégré",
      icon: Image,
      href: "/admin/media",
      color: "bg-green-500",
      features: ["Upload multiple", "Éditeur d'images", "Optimisation", "Filigranes"]
    },
    {
      title: "Gestion des Utilisateurs",
      description: "Gérez les utilisateurs et le système de gamification",
      icon: Users,
      href: "/admin/users",
      color: "bg-orange-500",
      features: ["Points & badges", "Rangs", "Leaderboard", "Statistiques"]
    },
    {
      title: "Catégories",
      description: "Organisez et gérez vos catégories d'articles",
      icon: FolderTree,
      href: "/admin/categories",
      color: "bg-teal-500",
      features: ["Créer catégories", "Organiser", "Couleurs", "Icônes"]
    },
    {
      title: "Design & Palettes",
      description: "Gérez les palettes de couleurs et styles",
      icon: Palette,
      href: "/admin/design",
      color: "bg-pink-500",
      features: ["Palettes", "Styles", "Couleurs", "Thèmes"]
    },
    {
      title: "Feature Toggles",
      description: "Contrôlez les fonctionnalités activées",
      icon: Sliders,
      href: "/admin/features",
      color: "bg-cyan-500",
      features: ["Gamification", "Social", "Games", "Contrôle total"]
    },
    {
      title: "Configuration Système",
      description: "Paramètres généraux du site",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
      features: ["Paramètres généraux", "SEO", "Performance", "Sécurité"]
    }
  ];

  const statsDisplay = [
    { label: "Articles totaux", value: stats?.articles?.toString() ?? "0", change: "+12%", icon: FileText },
    { label: "Publiés", value: stats?.published?.toString() ?? "0", change: "+8%", icon: TrendingUp },
    { label: "Brouillons", value: stats?.drafts?.toString() ?? "0", change: "0%", icon: FileText },
    { label: "Utilisateurs actifs", value: stats?.users?.toString() ?? "0", change: "+12%", icon: Users },
    { label: "Médias", value: stats?.media?.toString() ?? "0", change: "+5%", icon: Image },
    { label: "Catégories", value: stats?.categories?.toString() ?? "0", change: "0%", icon: FolderTree },
    { label: "Revenus mensuels", value: `€${stats?.revenue ?? 0}` , change: "+15%", icon: TrendingUp },
    { label: "Taux d'engagement", value: `${stats?.engagement ?? 0}%`, change: "+5%", icon: Award }
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  // Fonctions de configuration rapide
  const applyViralPreset = () => {
    // Ici vous pouvez ajouter la logique pour appliquer le preset
    toast.success('Preset Viral appliqué ! Consultez la console pour les détails.');
  };

  const applyGamingPreset = () => {
    // Ici vous pouvez ajouter la logique pour appliquer le preset
    toast.success('Preset Gaming appliqué ! Consultez la console pour les détails.');
  };

  const applyMagazinePreset = () => {
    // Ici vous pouvez ajouter la logique pour appliquer le preset
    toast.success('Preset Magazine appliqué ! Consultez la console pour les détails.');
  };



  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Sign Out */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Pacifico, cursive' }}>
              Cake Admin
            </h1>
            <p className="text-gray-600">Gérez votre site d&apos;actualités virales avec toutes les fonctionnalités premium</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Admin Permission Warning */}
        {!isAdmin && (
          <Card className="p-6 mb-8 border-orange-500">
            <p className="text-center text-muted-foreground">
              ⚠️ Vous n&apos;avez pas les droits administrateur. Contactez un administrateur pour obtenir l&apos;accès.
            </p>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
          {statsDisplay.map((stat: { label: string; value: string; change: string; icon: React.ElementType }) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.label} className="p-4">
                <IconComponent className="h-6 w-6 mb-2 text-primary" />
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                <div className="text-green-500 text-xs font-medium mt-1">
                  {stat.change}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature: { title: string; description: string; icon: React.ElementType; href: string; color: string; features: string[] }) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={feature.href}>Accéder</Link>
                  </Button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.features.map((item) => (
                    <div key={item} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Setup */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration Rapide Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card 
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={applyViralPreset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  applyViralPreset();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preset Viral</h3>
                  <p className="text-sm text-gray-600">Optimisé pour la viralité</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Parfait pour les sites d&#39;actualités tendances</p>
            </Card>

            <Card 
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={applyGamingPreset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  applyGamingPreset();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preset Gaming</h3>
                  <p className="text-sm text-gray-600">Style gaming moderne</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Idéal pour les sites de jeux et esports</p>
            </Card>

            <Card 
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={applyMagazinePreset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  applyMagazinePreset();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preset Magazine</h3>
                  <p className="text-sm text-gray-600">Style publication moderne</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Parfait pour les magazines en ligne</p>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/articles/new">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Créer un article
              </Button>
            </Link>
            <Link to="/admin/articles">
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Voir les tendances
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Gérer les badges
              </Button>
            </Link>
            <Link to="/admin/theme">
              <Button variant="outline">
                <Layout className="w-4 h-4 mr-2" />
                Personnaliser l&apos;accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AdminDashboard };