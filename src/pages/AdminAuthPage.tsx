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
import { getBrowser, getOS } from "@/lib/deviceFingerprint";
import { Loader2, Shield, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminAuthPage() {
  const [formData, setFormData] = useState<AdminLoginFormData>({ email: "", password: "" });
  const [step, setStep] = useState<"credentials" | "twoFactor">("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { fingerprint, saveDeviceToken } = useDeviceFingerprint();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const checkIfBlocked = async () => {
      if (formData.email) {
        const blocked = await isUserBlocked(formData.email);
        if (blocked) {
          const resetTime = new Date(Date.now() + 15 * 60 * 1000);
          setBlockedUntil(resetTime);
          setError("Trop de tentatives infructueuses. Veuillez réessayer plus tard.");
        }
      }
    };

    const checkTimer = setTimeout(checkIfBlocked, 500);
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
      const blocked = await isUserBlocked(formData.email);
      if (blocked) {
        setBlockedUntil(new Date(Date.now() + 15 * 60 * 1000));
        setError("Trop de tentatives infructueuses. Veuillez réessayer plus tard.");
        setLoading(false);
        return;
      }

      const rateLimitResult = await checkRateLimit(`login_${formData.email}`);
      if (!rateLimitResult.allowed) {
        setBlockedUntil(rateLimitResult.resetTime || null);
        setError("Trop de tentatives. Veuillez réessayer plus tard.");
        await logFailedAttempt(formData.email);
        setLoading(false);
        return;
      }

      setAttemptsLeft(rateLimitResult.attemptsLeft);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        await logFailedAttempt(formData.email);
        if (authError.message.includes("Invalid login credentials")) {
          toast.error("Informations d'identification invalides");
        } else {
          toast.error(authError.message);
        }
        return;
      }

      const user = data.user;
      if (!user) {
        throw new Error("Aucun utilisateur retourné après connexion");
      }

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

      await logSuccessfulAttempt(formData.email, user.id);

      // Check if 2FA is enabled (localStorage-based)
      const has2fa = localStorage.getItem(`2fa_enabled_${user.id}`) === 'true';

      if (has2fa) {
        setUserId(user.id);
        setStep("twoFactor");
      } else {
        // Save device as trusted
        if (fingerprint) {
          const devices = JSON.parse(localStorage.getItem('trusted_devices') || '[]');
          devices.push({
            id: crypto.randomUUID(),
            fingerprint,
            browser: getBrowser(),
            os: getOS(),
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
          });
          localStorage.setItem('trusted_devices', JSON.stringify(devices));
          const newToken = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          saveDeviceToken(newToken);
        }
        
        toast.success("Connexion réussie !");
        navigate("/admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerified = async () => {
    if (fingerprint) {
      const devices = JSON.parse(localStorage.getItem('trusted_devices') || '[]');
      const existingDevice = devices.find((d: { fingerprint: string }) => d.fingerprint === fingerprint);
      
      if (!existingDevice) {
        devices.push({
          id: crypto.randomUUID(),
          fingerprint,
          browser: getBrowser(),
          os: getOS(),
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
        });
        localStorage.setItem('trusted_devices', JSON.stringify(devices));
      }
    }

    toast.success("Connexion réussie !");
    navigate("/admin");
  };

  const handleTwoFactorCancel = () => {
    setStep("credentials");
    setUserId(null);
  };

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
          </CardTitle>
          <CardDescription>
            {step === "credentials" && "Accédez à votre espace administrateur"}
            {step === "twoFactor" && "Entrez le code de votre application d'authentification"}
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

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Accès réservé au personnel administratif autorisé</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
