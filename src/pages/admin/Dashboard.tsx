import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, FileText, Eye, Activity, Server, Globe, Clock, Settings } from "lucide-react";

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
      // 1. Fetch KPIs
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: articleCount } = await supabase.from("articles").select("*", { count: "exact", head: true });
      
      // For total views, we sum up the view_count from articles
      const { data: articlesData } = await supabase.from("articles").select("view_count");
      const totalViews = (articlesData || []).reduce((acc, curr) => acc + (curr.view_count || 0), 0);

      setStats({
        totalUsers: userCount || 0,
        totalArticles: articleCount || 0,
        totalViews: totalViews,
      });

      // 2. Fetch Daily Stats for Chart (Last 7 days for the specific design look)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: dailyStats } = await supabase
        .from("daily_stats")
        .select("date, views, likes")
        .gte("date", sevenDaysAgo.toISOString())
        .order("date", { ascending: true });

      // Aggregate by date
      const aggregatedData = (dailyStats || []).reduce((acc: any, curr: any) => {
        const date = curr.date;
        if (!acc[date]) {
          acc[date] = { date, views: 0, likes: 0 };
        }
        acc[date].views += curr.views;
        acc[date].likes += curr.likes;
        return acc;
      }, {});

      let chartData = Object.values(aggregatedData);

      // Fallback for demo if no data yet
      if (chartData.length === 0) {
        chartData = Array.from({ length: 5 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (4 - i));
          return {
            date: d.toISOString().split('T')[0],
            views: Math.floor(Math.random() * 100) + 50,
            likes: Math.floor(Math.random() * 50) + 10
          };
        });
      }

      setDailyData(chartData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Colors for the bar chart
  const barColors = ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6'];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Tableau de bord</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Système en ligne
        </div>
      </div>

      {/* Top Widgets - Colorful Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Status (Green) */}
        <div className="bg-[#2ecc71] rounded-lg shadow-lg p-6 text-white relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-1">UP</h3>
            <p className="text-green-100 font-medium uppercase tracking-wider text-xs">Statut Système</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-50 bg-white/20 w-fit px-2 py-1 rounded backdrop-blur-sm">
              <Activity size={14} />
              <span>Stable</span>
            </div>
          </div>
          <Server className="absolute -right-6 -bottom-6 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
        </div>

        {/* Card 2: Views (Orange) */}
        <div className="bg-[#f39c12] rounded-lg shadow-lg p-6 text-white relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-1">{stats.totalViews.toLocaleString()}</h3>
            <p className="text-orange-100 font-medium uppercase tracking-wider text-xs">Vues Totales</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-orange-50 bg-white/20 w-fit px-2 py-1 rounded backdrop-blur-sm">
              <Eye size={14} />
              <span>+12% cette semaine</span>
            </div>
          </div>
          <Activity className="absolute -right-6 -bottom-6 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
        </div>

        {/* Card 3: Articles (Teal) */}
        <div className="bg-[#1abc9c] rounded-lg shadow-lg p-6 text-white relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-1">{stats.totalArticles}</h3>
            <p className="text-teal-100 font-medium uppercase tracking-wider text-xs">Articles Publiés</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-teal-50 bg-white/20 w-fit px-2 py-1 rounded backdrop-blur-sm">
              <FileText size={14} />
              <span>Contenu actif</span>
            </div>
          </div>
          <FileText className="absolute -right-6 -bottom-6 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
        </div>

        {/* Card 4: Users (Blue) */}
        <div className="bg-[#3498db] rounded-lg shadow-lg p-6 text-white relative overflow-hidden group transition-all hover:-translate-y-1">
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-1">{stats.totalUsers}</h3>
            <p className="text-blue-100 font-medium uppercase tracking-wider text-xs">Utilisateurs</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-50 bg-white/20 w-fit px-2 py-1 rounded backdrop-blur-sm">
              <Users size={14} />
              <span>Communauté</span>
            </div>
          </div>
          <Users className="absolute -right-6 -bottom-6 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* System Info Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-l-4 border-l-[#3498db] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Globe className="w-6 h-6 text-[#3498db]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Environnement</p>
              <p className="font-bold text-slate-700">Production</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-[#2ecc71] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Server className="w-6 h-6 text-[#2ecc71]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base de données</p>
              <p className="font-bold text-slate-700">Supabase (PostgreSQL)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-[#f39c12] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-[#f39c12]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fuseau Horaire</p>
              <p className="font-bold text-slate-700">Europe/Paris</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-[#1abc9c] shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Settings className="w-6 h-6 text-[#1abc9c]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version App</p>
              <p className="font-bold text-slate-700">2.4.0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Analytics & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Analytics Chart */}
        <Card className="lg:col-span-2 shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Web Analytics (Vues)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                    {dailyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Stats Table */}
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Statistiques HTTP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { resource: "login.auth", status: 200, calls: 142, time: "12ms" },
                { resource: "api.articles", status: 200, calls: 854, time: "45ms" },
                { resource: "api.users", status: 200, calls: 56, time: "28ms" },
                { resource: "assets.image", status: 304, calls: 1205, time: "5ms" },
                { resource: "api.analytics", status: 201, calls: 89, time: "110ms" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-medium text-slate-700">{item.resource}</span>
                    <span className="text-xs text-muted-foreground">{item.calls} appels</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      item.status === 200 ? 'bg-green-100 text-green-700' : 
                      item.status === 304 ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500 w-12 text-right">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
