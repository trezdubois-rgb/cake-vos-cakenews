import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SimpleLayout from '@/components/layout/SimpleLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';

const Accueil = lazy(() => import('@/pages/Accueil'));
const MonFlux = lazy(() => import('@/pages/MonFlux'));
const Messages = lazy(() => import('@/pages/Messages'));
const Profil = lazy(() => import('@/pages/Profil'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const MediaLibrary = lazy(() => import('@/pages/admin/MediaLibrary'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const UsersManager = lazy(() => import('@/pages/admin/UsersManager'));
const ArticlesList = lazy(() => import('@/pages/admin/ArticlesList'));
const QuickArticleCreator = lazy(() => import('@/pages/admin/QuickArticleCreator'));
const ArticleEditor = lazy(() => import('@/pages/admin/ArticleEditor'));
const CategoriesManager = lazy(() => import('@/pages/admin/CategoriesManager'));
const AnalyticsDashboard = lazy(() => import('@/pages/admin/AnalyticsDashboard'));
const ArticleViewGutenberg = lazy(() => import('@/pages/ArticleViewGutenberg'));
const GutenbergDemo = lazy(() => import('@/pages/GutenbergDemo'));
const Error404 = lazy(() => import('@/pages/errors/Error404'));
const Error500 = lazy(() => import('@/pages/errors/Error500'));
const ErrorNetwork = lazy(() => import('@/pages/errors/ErrorNetwork'));
const ErrorUnauthorized = lazy(() => import('@/pages/errors/ErrorUnauthorized'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

const SkeletonFallback = () => (
  <div className="min-h-screen bg-background p-4 md:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <SimpleLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<Login />} path="/login" />
            <Route element={<Signup />} path="/signup" />
            <Route element={<Accueil />} path="/" />
            <Route element={<MonFlux />} path="/mon-flux" />
            <Route element={<Messages />} path="/messages" />
            <Route element={<Profil />} path="/profil" />
            <Route element={<Error404 />} path="/404" />
            <Route element={<Error500 />} path="/500" />
            <Route element={<ErrorNetwork />} path="/error/network" />
            <Route element={<ErrorUnauthorized />} path="/unauthorized" />
            
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <MediaLibrary />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/media"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <AdminSettings />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/settings"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <UsersManager />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/users"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <ArticlesList />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/articles"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <QuickArticleCreator />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/articles/create"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <ArticleEditor />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/articles/new"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <ArticleEditor />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/articles/:id/edit"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <CategoriesManager />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/categories"
            />
            <Route
              element={
                <Suspense fallback={<SkeletonFallback />}>
                  <ProtectedRoute requireAdmin>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                </Suspense>
              }
              path="/admin/analytics"
            />
            
            <Route element={<GutenbergDemo />} path="/gutenberg-demo" />
            <Route element={<ArticleViewGutenberg />} path="/article-gutenberg/:id" />
            <Route element={<Error404 />} path="*" />
          </Routes>
        </Suspense>
        <Toaster />
      </SimpleLayout>
    </BrowserRouter>
  );
};

export default App;
