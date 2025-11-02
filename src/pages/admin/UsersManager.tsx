import { ArrowLeft, UserPlus, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserData, UserRole } from '@/types/userTypes';

type UserWithRole = UserData & {
  role?: string;
  role_id?: string;
};

export default function UsersManager() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator' | 'user'>('user');

  // Hooks doivent être appelés avant toute condition de retour
  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await supabase.functions.invoke<UserData[]>('get-users');
      const data = response.data;
      const error = response.error;

      if (error) {
        throw error;
      }

      // Fetch all users with their roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('id, user_id, role')
        .returns<UserRole[]>();

      if (rolesError) throw rolesError;

      // Create a map of user_id to role info
      const roleMap = new Map<string, { role: string; role_id: number }>(
        userRoles?.map((r) => [r.user_id, { role: r.role, role_id: r.id }]) || []
      );

      const usersWithRoles = data.map((user) => ({
        ...user,
        role: roleMap.get(user.id)?.role ?? 'user',
        role_id: roleMap.get(user.id)?.role_id,
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!newUserEmail) {
      toast.error('Veuillez entrer un email');
      return;
    }

    try {
      const userResponse = await supabase.functions.invoke<{ data: UserData | null }>('get-user-by-email', {
        body: { email: newUserEmail },
      });
      const user = userResponse.data;
      const userError = userResponse.error;

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const { error: insertError } = await supabase.from('user_roles').insert([
        { user_id: user.id, role: newUserRole },
      ]);

      if (insertError) {
        throw insertError;
      }

      toast.success('Rôle ajouté avec succès');
      fetchUsers();
      setNewUserEmail('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle", error);
      toast.error("Erreur lors de l'ajout du rôle");
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('id', roleId);

      if (error) throw error;

      toast.success('Rôle supprimé avec succès');
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression du rôle", error);
      toast.error("Erreur lors de la suppression du rôle");
    }
  };

  // Vérifications d'authentification après les hooks
  if (!authLoading && !isAdmin) {
    navigate('/auth');
    return null;
  }

  if (authLoading ?? loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={`skeleton-users-${i}`} className="h-24" />
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
          <h1 className="text-3xl md:text-4xl font-bold">Gestion des Utilisateurs</h1>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Ajouter un rôle
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Email de l&apos;utilisateur</Label>
              <Input
                type="email"
                placeholder="utilisateur@exemple.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select
                value={newUserRole}
                onValueChange={(value) => setNewUserRole(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="moderator">Modérateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddRole} className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Attribuer le rôle
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Utilisateurs avec rôles</h2>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-muted-foreground">Aucun utilisateur avec rôle</p>
            ) : (
              users.map((usr) => (
                <div
                  key={usr.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{usr.email}</p>
                    <p className="text-sm text-muted-foreground capitalize">{usr.role}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le rôle</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est
                          irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => usr.role_id ? handleRemoveRole(usr.role_id) : undefined}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}