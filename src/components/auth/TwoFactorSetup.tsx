import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { generateTOTPSecret, generateTOTPQRUrl, verifyTOTPCode } from "@/lib/totp";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Shield, QrCode, Smartphone, CheckCircle, AlertCircle } from "lucide-react";

interface TwoFactorSetupProps {
  onComplete?: () => void;
}

export const TwoFactorSetup = ({ onComplete }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<number>(1); // 1: Generate secret, 2: Verify, 3: Complete
  const [secret, setSecret] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setAccountName(user.email || user.id);
    }
  }, [user]);

  const handleGenerateSecret = () => {
    setLoading(true);
    setError(null);
    
    try {
      const newSecret = generateTOTPSecret();
      setSecret(newSecret);
      
      if (accountName) {
        const newQrUrl = generateTOTPQRUrl(newSecret, accountName);
        setQrUrl(newQrUrl);
        setStep(2);
      }
    } catch (err) {
      setError("Erreur lors de la génération du secret");
      console.error("Error generating secret:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (verifyTOTPCode(secret, verificationCode)) {
        // Sauvegarder le secret dans la base de données
        if (user) {
          const { error } = await supabase
            .from('admin_2fa_secrets')
            .upsert({
              user_id: user.id,
              secret: secret,
              created_at: new Date().toISOString(),
              enabled: true,
            });
          
          if (error) throw error;
          
          setStep(3);
          toast.success("2FA activé avec succès !");
          onComplete?.();
        }
      } else {
        setError("Code incorrect. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Erreur lors de la vérification du code");
      console.error("Error verifying code:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSecret("");
    setQrUrl("");
    setVerificationCode("");
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Authentification à deux facteurs</CardTitle>
            <CardDescription>
              Sécurisez votre compte avec le 2FA
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Étape 1: Génération du secret */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                L'authentification à deux facteurs (2FA) ajoute une couche de sécurité à votre compte en exigeant 
                une deuxième forme de vérification en plus de votre mot de passe.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountName">Nom du compte</Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Votre email"
                disabled={loading}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleGenerateSecret} 
              disabled={!accountName || loading}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Activer le 2FA
            </Button>
          </div>
        )}

        {/* Étape 2: Affichage du QR code et vérification */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">
                Étape 1 sur 2
              </Badge>
              <h3 className="font-medium mb-2">Scannez le QR code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Utilisez une application d'authentification comme Google Authenticator ou Authy
              </p>
              
              {qrUrl && (
                <div className="flex justify-center mb-4">
                  <div className="border-2 border-border p-2 rounded-lg inline-block">
                    <div className="bg-white p-2">
                      <QrCode className="h-32 w-32 text-foreground" />
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mb-4">
                Ou entrez manuellement ce code secret : <br />
                <span className="font-mono bg-muted px-2 py-1 rounded mt-1 inline-block">
                  {secret}
                </span>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Code de vérification</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  disabled={loading}
                />
                <Smartphone className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Entrez le code de votre application d'authentification
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Retour
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleVerifyCode} 
                disabled={!verificationCode || verificationCode.length !== 6 || loading}
              >
                Vérifier
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Confirmation */}
        {step === 3 && (
          <div className="text-center py-6">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">2FA activé avec succès !</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Votre compte est maintenant protégé par une authentification à deux facteurs.
            </p>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
              <Button onClick={() => onComplete?.()}>
                Terminer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};