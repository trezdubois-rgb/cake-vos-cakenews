import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, UserPlus, AlertCircle } from "lucide-react";
import { loginRateLimitService, signupRateLimitService, loginAttemptLogger } from "@/lib/rateLimitService";
import { checkAdminRoleSecure } from "@/lib/serverAuth";

export default function AuthNew() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const [rateLimitInfo, setRateLimitInfo] = useState<{message?: string, resetTime?: Date} | null>(null);
  const [blockedInfo, setBlockedInfo] = useState<{message: string, resetTime?: Date} | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user && isAuthenticated) {
      // Rediriger vers la bonne page en fonction du rôle de l'utilisateur
      checkUserRoleAndRedirect();
    }
  }, [user, isAuthenticated]);

  const checkUserRoleAndRedirect = async () => {
    if (!user) return;

    try {
      const result = await checkAdminRoleSecure(user.id);

      if (result.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRateLimitInfo(null);
    setBlockedInfo(null);

    // Vérifier le rate limit pour l'inscription
    const rateLimitResult = await signupRateLimitService.checkSignupLimit(email);

    if (!rateLimitResult.allowed) {
      setRateLimitInfo({
        message: rateLimitResult.message,
        resetTime: rateLimitResult.resetTime
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Effacer le rate limit après une inscription réussie
        signupRateLimitService.clearLimit(email);
        toast.success("Compte créé avec succès ! Bienvenue 🎉");
        // L'utilisateur est automatiquement connecté après l'inscription
        checkUserRoleAndRedirect();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRateLimitInfo(null);
    setBlockedInfo(null);

    // Vérifier si l'utilisateur est bloqué
    if (loginAttemptLogger.isUserBlocked(email)) {
      setBlockedInfo({
        message: "Compte temporairement bloqué en raison de trop nombreuses tentatives échouées. Réessayez plus tard."
      });
      setLoading(false);
      return;
    }

    // Vérifier le rate limit pour la connexion
    const rateLimitResult = await loginRateLimitService.checkLoginLimit(email);

    if (!rateLimitResult.allowed) {
      setRateLimitInfo({
        message: rateLimitResult.message,
        resetTime: rateLimitResult.resetTime
      });
      // Enregistrer la tentative échouée pour le blocage
      loginAttemptLogger.logAttempt(email, false);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Enregistrer une tentative réussie
      loginAttemptLogger.logAttempt(email, true);
      // Effacer le rate limit après une connexion réussie
      loginRateLimitService.clearLimit(email);

      toast.success("Connexion réussie !");
      // La redirection se fait automatiquement via le useEffect
    } catch (error: any) {
      // Enregistrer une tentative échouée
      loginAttemptLogger.logAttempt(email, false);

      // Vérifier à nouveau si l'utilisateur est maintenant bloqué
      if (loginAttemptLogger.isUserBlocked(email)) {
        setBlockedInfo({
          message: "Compte temporairement bloqué en raison de trop nombreuses tentatives échouées. Réessayez plus tard."
        });
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
      <Card className="w-full max-w-lg shadow-2xl border-2">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Bienvenue sur CAKENEWS
          </CardTitle>
          <CardDescription className="text-base">
            Créez votre compte ou connectez-vous pour accéder à tous nos contenus
          </CardDescription>
        </CardHeader>

        <CardContent>
          {blockedInfo && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Compte bloqué</p>
                <p className="text-xs text-destructive/80">{blockedInfo.message}</p>
              </div>
            </div>
          )}

          {rateLimitInfo && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Limite dépassée</p>
                <p className="text-xs text-destructive/80">{rateLimitInfo.message}</p>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signup" className="text-sm">
                Inscription
              </TabsTrigger>
              <TabsTrigger value="login" className="text-sm">
                Connexion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 caractères
                  </p>
                </div>

                <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Les administrateurs seront redirigés vers l'interface d'administration après connexion</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}