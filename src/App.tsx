import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { AdminBottomNav } from "./components/layout/AdminBottomNav";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestBlocker } from "./components/auth/GuestBlocker";

// Public pages - loaded immediately
import Accueil from "./pages/Accueil";
import Article from "./pages/Article";

// Admin pages - lazy loaded to reduce initial bundle
const AuthNew = lazy(() => import("./pages/AuthNew"));
const Admin = lazy(() => import("./pages/Admin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ArticleEditor = lazy(() => import("./pages/admin/ArticleEditor"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const TagSearchPage = lazy(() => import("./pages/TagSearchPage"));
const MyFeed = lazy(() => import("./pages/MyFeed"));
const Messaging = lazy(() => import("./pages/Messaging"));
const Profile = lazy(() => import("./pages/Profile"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const AppContent = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased pb-16 md:pb-0">
      <Header />
      <main className="container mx-auto px-0 md:px-4 py-4 max-w-7xl">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <GuestBlocker>
                  <Accueil />
                </GuestBlocker>
              }
            />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/tags" element={<TagSearchPage />} />
            <Route path="/auth" element={<AuthNew />} />
            <Route path="/my-feed" element={<MyFeed />} />
            <Route path="/messages" element={<Messaging />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/articles"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/articles/new"
              element={
                <ProtectedRoute requireAdmin>
                  <ArticleEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/articles/:id"
              element={
                <ProtectedRoute requireAdmin>
                  <ArticleEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <BottomNav />
      <AdminBottomNav />
    </div>
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
