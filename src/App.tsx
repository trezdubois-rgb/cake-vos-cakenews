import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative min-h-screen bg-background">
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
