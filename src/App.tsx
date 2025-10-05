import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";
import { Header } from "@/components/layout/Header";
import Accueil from "./pages/Accueil";
import MonFlux from "./pages/MonFlux";
import Messages from "./pages/Messages";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Article from "./pages/Article";
import ArticlesList from "./pages/admin/ArticlesList";
import ArticleEditor from "./pages/admin/ArticleEditor";
import AdsManager from "./pages/admin/AdsManager";
import DesignManager from "./pages/admin/DesignManager";
import AdminSettings from "./pages/admin/AdminSettings";
import MediaLibrary from "./pages/admin/MediaLibrary";
import CategoriesManager from "./pages/admin/CategoriesManager";
import UsersManager from "./pages/admin/UsersManager";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen bg-background pb-16 md:pb-0">
      <Header />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/mon-flux" element={<MonFlux />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/articles" element={<ArticlesList />} />
        <Route path="/admin/articles/new" element={<ArticleEditor />} />
        <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
        <Route path="/admin/ads" element={<AdsManager />} />
          <Route path="/admin/design" element={<DesignManager />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/media" element={<MediaLibrary />} />
          <Route path="/admin/categories" element={<CategoriesManager />} />
          <Route path="/admin/users" element={<UsersManager />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAdminRoute ? <AdminBottomNav /> : <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
