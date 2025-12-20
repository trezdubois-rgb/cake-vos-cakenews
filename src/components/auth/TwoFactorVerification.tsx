import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { verifyTOTPCode } from "@/lib/totp";
import { toast } from "sonner";
import { Loader2, Smartphone, ShieldAlert } from "lucide-react";

interface TwoFactorVerificationProps {
  userId: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const TwoFactorVerification = ({ userId, onVerified, onCancel }: TwoFactorVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCode = async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer le secret de l'utilisateur
      const { data: secretData, error: secretError } = await supabase
        .from('admin_2fa_secrets')
        .select('secret')
        .eq('user_id', userId)
        .eq('enabled', true)
        .single();

      if (secretError || !secretData) {
        throw new Error("Erreur lors de la récupération des informations 2FA");
      }

      // Vérifier le code TOTP
      if (verifyTOTPCode(secretData.secret, verificationCode)) {
        // Le code est correct, on peut authentifier l'utilisateur
        toast.success("Code 2FA vérifié avec succès !");
        onVerified();
      } else {
        setError("Code incorrect. Veuillez réessayer.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la vérification du code");
      console.error("Error verifying 2FA:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Ne garder que les chiffres
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyCode();
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Vérification à deux facteurs</CardTitle>
        <CardDescription>
          Entrez le code de votre application d'authentification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Code de sécurité</Label>
            <div className="flex justify-center">
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={handleInputChange}
                placeholder="000000"
                maxLength={6}
                autoFocus
                className="text-center text-2xl tracking-widest h-14 text-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              6 chiffres de votre application d'authentification
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={verificationCode.length !== 6 || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};