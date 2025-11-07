import { useEffect } from "react";
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
import AuthNew from "./pages/AuthNew";
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
import AdminLoginRequests from "./pages/admin/AdminLoginRequests";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestBlocker } from "./components/auth/GuestBlocker";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <GuestBlocker>
      <div className="relative min-h-screen bg-background pb-16 md:pb-0">
        <Header />
        <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/auth" element={<AuthNew />} />
        
        {/* Routes protégées - nécessitent une authentification */}
        <Route path="/mon-flux" element={<ProtectedRoute><MonFlux /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/article/:id" element={<ProtectedRoute><Article /></ProtectedRoute>} />
        
        {/* Routes admin - nécessitent le rôle admin */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
        <Route path="/admin/articles" element={<ProtectedRoute requireAdmin><ArticlesList /></ProtectedRoute>} />
        <Route path="/admin/articles/new" element={<ProtectedRoute requireAdmin><ArticleEditor /></ProtectedRoute>} />
        <Route path="/admin/articles/edit/:id" element={<ProtectedRoute requireAdmin><ArticleEditor /></ProtectedRoute>} />
        <Route path="/admin/ads" element={<ProtectedRoute requireAdmin><AdsManager /></ProtectedRoute>} />
        <Route path="/admin/design" element={<ProtectedRoute requireAdmin><DesignManager /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute requireAdmin><MediaLibrary /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><CategoriesManager /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UsersManager /></ProtectedRoute>} />
        <Route path="/admin/login-requests" element={<ProtectedRoute requireAdmin><AdminLoginRequests /></ProtectedRoute>} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAdminRoute ? <AdminBottomNav /> : <BottomNav />}
      </div>
    </GuestBlocker>
  );
};

const App = () => {
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    const disableCopy = (e: ClipboardEvent) => e.preventDefault();
    const disableSelect = (e: Event) => {
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);
    document.addEventListener("selectstart", disableSelect);

    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCopy);
      document.removeEventListener("selectstart", disableSelect);
      document.head.removeChild(style);
    };
  }, []);

  return (
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
};

export default App;
