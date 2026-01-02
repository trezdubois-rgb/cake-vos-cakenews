import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestBlocker } from "./components/auth/GuestBlocker";
import { UserLayout } from "./components/layout/UserLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Public pages - loaded immediately
import Accueil from "./pages/Accueil";
import Article from "./pages/Article";

// Auth pages - lazy loaded
const AuthNew = lazy(() => import("./pages/AuthNew"));

// Admin pages - lazy loaded to reduce initial bundle
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ArticleEditor = lazy(() => import("./pages/admin/ArticleEditor"));
const ArticlesList = lazy(() => import("./pages/admin/ArticlesList"));
const UsersManager = lazy(() => import("./pages/admin/UsersManager"));
const DesignManager = lazy(() => import("./pages/admin/DesignManager"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const CategoriesManager = lazy(() => import("./pages/admin/CategoriesManager"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AdsManager = lazy(() => import("./pages/admin/AdsManager"));

const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const TagSearchPage = lazy(() => import("./pages/TagSearchPage"));
const MonFlux = lazy(() => import("./pages/MonFlux"));
const Messaging = lazy(() => import("./pages/Messaging"));
const Profil = lazy(() => import("./pages/Profil"));

// Admin devices management - lazy loaded
const DevicesManager = lazy(() => import("./pages/admin/DevicesManager"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const AppContent = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* USER INTERFACE - Public & Authenticated User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/tags" element={<TagSearchPage />} />
          <Route path="/auth" element={<AuthNew />} />
          <Route path="/my-feed" element={<MonFlux />} />
          <Route path="/mon-flux" element={<MonFlux />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/profile" element={<Profil />} />
          <Route path="/profil" element={<Profil />} />
        </Route>

        {/* ADMIN INTERFACE - Strictly Separated */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/new" element={<ArticleEditor />} />
          <Route path="articles/:id" element={<ArticleEditor />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="design" element={<DesignManager />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="ads" element={<AdsManager />} />
          <Route path="devices" element={<DevicesManager />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

const App = () => {
  // Aggressive user blocking removed for better UX and accessibility
  useEffect(() => {
    // Optional: Add a console warning or lightweight protection if absolutely necessary
    // But for now, we favor a standard web experience.
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
