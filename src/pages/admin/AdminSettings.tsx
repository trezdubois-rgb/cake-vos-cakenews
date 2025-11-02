import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
// SUPPRESSION: import { t } from "@/lib/i18n";
// SUPPRESSION: import { useTranslation } from 'react-i18next';

export default function AdminSettings() {
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  // Ne rediriger que si le chargement est terminé et que l'utilisateur n'est pas admin
  if (!authLoading && !isAdmin) {
    navigate('/auth');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={`skeleton-settings-${i}`} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Paramètres</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Compte Utilisateur</h2>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={user.email ?? ''} disabled />
              </div>
              <div>
                <Label>Modifier le mot de passe</Label>
                <Button variant="outline" className="w-full">
                  Changer mon mot de passe
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les nouveaux articles
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des résumés hebdomadaires
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sauvegarde & Export</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Exporter tous les articles (JSON)
              </Button>
              <Button variant="outline" className="w-full">
                Restaurer depuis une sauvegarde
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-destructive">
            <h2 className="text-2xl font-bold mb-4 text-destructive">Zone de Danger</h2>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}