import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, FileText, Eye, Activity, Server, Clock, Globe, 
  Cpu, ArrowUpRight, ArrowDownRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalViews: 0,
  });
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: articleCount } = await supabase.from("articles").select("*", { count: "exact", head: true });
      
      const { data: articlesData } = await supabase.from("articles").select("view_count");
      const totalViews = (articlesData || []).reduce((acc, curr) => acc + (curr.view_count || 0), 0);

      setStats({
        totalUsers: userCount || 0,
        totalArticles: articleCount || 0,
        totalViews: totalViews,
      });

      // Mock daily data for demonstration if DB is empty
      const mockData = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return {
          date: d.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 500) + 100,
          visitors: Math.floor(Math.random() * 300) + 50,
          likes: Math.floor(Math.random() * 50) + 10,
        };
      });
      setDailyData(mockData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-8 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Tableau de Bord
          </h2>
          <p className="text-muted-foreground">Vue d'ensemble de votre application</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 bg-green-500/10 text-green-500 border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Système Opérationnel
          </Badge>
        </div>
      </div>

      {/* System Status Widgets (Inspired by Screen 1) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 font-medium mb-1">Status</p>
                <h3 className="text-3xl font-bold">UP</h3>
              </div>
              <Activity className="h-8 w-8 text-green-200 opacity-80" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-100">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Stable depuis 24h
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 font-medium mb-1">Uptime</p>
                <h3 className="text-3xl font-bold">99.9%</h3>
              </div>
              <Clock className="h-8 w-8 text-orange-200 opacity-80" />
            </div>
            <div className="mt-4 text-sm text-orange-100">
              0h 0m 24s downtime
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 font-medium mb-1">Threads</p>
                <h3 className="text-3xl font-bold">36</h3>
              </div>
              <Cpu className="h-8 w-8 text-blue-200 opacity-80" />
            </div>
            <div className="mt-4 text-sm text-blue-100">
              Charge CPU: 12%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 font-medium mb-1">Sessions</p>
                <h3 className="text-3xl font-bold">1</h3>
              </div>
              <Globe className="h-8 w-8 text-purple-200 opacity-80" />
            </div>
            <div className="mt-4 text-sm text-purple-100">
              Actives maintenant
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +2.5% ce mois
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Publiés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +4 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues Totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              +12% vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-7 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Trafic & Visiteurs</CardTitle>
            <CardDescription>Aperçu des 14 derniers jours</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/50" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" name="Vues" />
                  <Area type="monotone" dataKey="visitors" stroke="#82ca9d" fillOpacity={1} fill="url(#colorVisitors)" name="Visiteurs" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-7 lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Répartition par Appareil</CardTitle>
            <CardDescription>Mobile vs Desktop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Mobile', value: 65 },
                      { name: 'Desktop', value: 30 },
                      { name: 'Tablette', value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#0088FE] mr-2" />
                Mobile (65%)
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#00C49F] mr-2" />
                Desktop (30%)
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FFBB28] mr-2" />
                Tablette (5%)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base">Serveur</CardTitle>
              <CardDescription>Linux / Ubuntu 22.04 LTS</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-base">Version App</CardTitle>
              <CardDescription>v2.4.0 (Build 2025.11.26)</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
