import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDeviceFingerprint } from "@/hooks/useDeviceFingerprint";
import { TwoFactorVerification } from "@/components/auth/TwoFactorVerification";
import { checkRateLimit, logFailedAttempt, logSuccessfulAttempt, isUserBlocked } from "@/lib/security";
import { Loader2, Shield, Smartphone, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AdminLoginFormData {
  email: string;
  password: string;
}

export const AdminAuthPage = () => {
  const [formData, setFormData] = useState<AdminLoginFormData>({ email: "", password: "" });
  const [step, setStep] = useState<"credentials" | "twoFactor" | "deviceApproval">("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { fingerprint, deviceToken, saveDeviceToken } = useDeviceFingerprint();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  // Vérifier si l'utilisateur est bloqué au chargement
  useEffect(() => {
    const checkIfBlocked = async () => {
      if (formData.email) {
        const blocked = await isUserBlocked(formData.email);
        if (blocked) {
          const resetTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
          setBlockedUntil(resetTime);
          setError("Trop de tentatives infructueuses. Veuillez réessayer plus tard.");
        }
      }
    };

    const checkTimer = setTimeout(checkIfBlocked, 500); // Délai pour permettre la mise à jour de formData
    return () => clearTimeout(checkTimer);
  }, [formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Vérifier si l'utilisateur est bloqué
      const blocked = await isUserBlocked(formData.email);
      if (blocked) {
        setBlockedUntil(new Date(Date.now() + 15 * 60 * 1000)); // 15 minutes
        setError("Trop de tentatives infructueuses. Veuillez réessayer plus tard.");
        setLoading(false);
        return;
      }

      // Vérifier le rate limit
      const rateLimitResult = await checkRateLimit(`login_${formData.email}`);
      if (!rateLimitResult.allowed) {
        setBlockedUntil(rateLimitResult.resetTime || null);
        setError("Trop de tentatives. Veuillez réessayer plus tard.");
        await logFailedAttempt(formData.email);
        setLoading(false);
        return;
      }

      setAttemptsLeft(rateLimitResult.attemptsLeft);

      // Tenter d'abord de se connecter avec email/mot de passe
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Enregistrer la tentative échouée
        await logFailedAttempt(formData.email);

        // Vérifier si l'erreur est liée à l'existence de l'utilisateur ou au mot de passe
        if (error.message.includes("Invalid login credentials")) {
          // Pour des raisons de sécurité, on ne révèle pas si l'email existe
          toast.error("Informations d'identification invalides");
        } else {
          toast.error(error.message);
        }
        return;
      }

      const user = data.user;
      if (!user) {
        throw new Error("Aucun utilisateur retourné après connexion");
      }

      // Vérifier si l'utilisateur a le rôle admin
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError || roles?.role !== 'admin') {
        await supabase.auth.signOut();
        await logFailedAttempt(formData.email);
        throw new Error("Accès admin requis");
      }

      // Enregistrer la tentative réussie
      await logSuccessfulAttempt(formData.email, user.id);

      // Vérifier si l'utilisateur a activé le 2FA
      const { data: has2fa, error: twoFaError } = await supabase
        .from('admin_2fa_secrets')
        .select('enabled')
        .eq('user_id', user.id)
        .eq('enabled', true)
        .single();

      if (has2fa && !twoFaError) {
        // L'utilisateur a le 2FA activé, demander le code
        setUserId(user.id);
        setStep("twoFactor");
      } else {
        // Vérifier si l'appareil est approuvé
        if (fingerprint) {
          const { data: trustedDevice, error: deviceError } = await supabase
            .from('trusted_devices')
            .select('*')
            .eq('user_id', user.id)
            .eq('device_fingerprint', fingerprint)
            .single();

          if (!deviceError && trustedDevice) {
            // L'appareil est approuvé, connexion directe
            toast.success("Connexion réussie !");
            navigate("/admin");
          } else {
            // L'appareil n'est pas approuvé, créer une demande d'approbation
            const { data: request, error: requestError } = await supabase
              .from('admin_login_requests')
              .insert({
                user_id: user.id,
                email_used: formData.email,
                status: 'pending',
              })
              .select()
              .single();

            if (requestError) throw requestError;

            setRequestId(request.id);
            setStep("deviceApproval");
            toast.info("Demande de connexion envoyée. Veuillez attendre l'approbation d'un administrateur.");
          }
        } else {
          // Impossible de vérifier le fingerprint, demander l'approbation
          const { data: request, error: requestError } = await supabase
            .from('admin_login_requests')
            .insert({
              user_id: user.id,
              email_used: formData.email,
              status: 'pending',
            })
            .select()
            .single();

          if (requestError) throw requestError;

          setRequestId(request.id);
          setStep("deviceApproval");
          toast.info("Demande de connexion envoyée. Veuillez attendre l'approbation d'un administrateur.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerified = async () => {
    // Lorsque le 2FA est vérifié avec succès
    // Enregistrer l'appareil comme approuvé si ce n'est pas déjà fait
    if (fingerprint) {
      // Vérifier si l'appareil est déjà enregistré
      const { data: existingDevice } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', userId)
        .eq('device_fingerprint', fingerprint)
        .single();

      if (!existingDevice) {
        // Enregistrer l'appareil comme approuvé
        await supabase
          .from('trusted_devices')
          .insert({
            user_id: userId,
            device_fingerprint: fingerprint,
            device_info: {
              browser: getBrowser(),
              os: getOS(),
              userAgent: navigator.userAgent,
              language: navigator.language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              screenResolution: `${screen.width}x${screen.height}`,
            },
            created_at: new Date().toISOString(),
            last_used: new Date().toISOString(),
          });
      }
    }

    toast.success("Connexion réussie !");
    navigate("/admin");
  };

  const handleTwoFactorCancel = () => {
    setStep("credentials");
    setUserId(null);
  };

  const pollForApproval = async () => {
    if (!requestId) return;

    try {
      const { data, error } = await supabase
        .from('admin_login_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) throw error;

      if (data.status === 'approved') {
        // L'administrateur a approuvé la demande
        // Maintenant, on peut demander le code 2FA ou connecter directement
        if (fingerprint) {
          const newToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          saveDeviceToken(newToken);
        }
        
        toast.success("Connexion approuvée ! Redirection...");
        navigate("/admin");
      } else if (data.status === 'rejected') {
        setError("Votre demande de connexion a été rejetée.");
        setStep("credentials");
      }
    } catch (err) {
      console.error("Error polling for approval:", err);
    }
  };

  // Démarrer le polling pour vérifier l'approbation
  useEffect(() => {
    if (step === "deviceApproval" && requestId) {
      const interval = setInterval(pollForApproval, 3000); // Vérifier toutes les 3 secondes
      return () => clearInterval(interval);
    }
  }, [step, requestId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === "credentials" && "Connexion Admin"}
            {step === "twoFactor" && "Vérification à deux facteurs"}
            {step === "deviceApproval" && "En attente d'approbation"}
          </CardTitle>
          <CardDescription>
            {step === "credentials" && "Accédez à votre espace administrateur"}
            {step === "twoFactor" && "Entrez le code de votre application d'authentification"}
            {step === "deviceApproval" && "Veuillez attendre l'approbation d'un administrateur"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blockedUntil && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Compte bloqué temporairement. Réessayez après {blockedUntil.toLocaleTimeString()}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {attemptsLeft < 5 && !blockedUntil && (
            <Alert className="mb-4">
              <AlertDescription>
                Tentatives restantes: {attemptsLeft}
              </AlertDescription>
            </Alert>
          )}

          {step === "credentials" && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@entreprise.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
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
          )}

          {step === "twoFactor" && userId && (
            <TwoFactorVerification
              userId={userId}
              onVerified={handleTwoFactorVerified}
              onCancel={handleTwoFactorCancel}
            />
          )}

          {step === "deviceApproval" && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
              <p className="text-lg font-medium mb-2">En attente d'approbation</p>
              <p className="text-sm text-muted-foreground mb-4">
                Votre demande de connexion a été envoyée. Veuillez attendre qu'un administrateur l'approuve.
              </p>
              <Button variant="outline" onClick={() => setStep("credentials")}>
                Retour
              </Button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Accès réservé au personnel administratif autorisé</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};