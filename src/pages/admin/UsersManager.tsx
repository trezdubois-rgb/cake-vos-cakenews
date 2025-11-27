import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, Shield, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
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
} from "@/components/ui/alert-dialog";

type UserWithRole = {
  id: string;
  email: string;
  role?: string;
  role_id?: string;
};

export default function UsersManager() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "moderator" | "user">("user");

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const moderatorCount = users.filter((u) => u.role === "moderator").length;

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role");

      if (rolesError) throw rolesError;

      const roleMap = new Map(
        userRoles?.map(r => [r.user_id, { role: r.role, role_id: r.id }]) || []
      );

      const usersWithRoles = Array.from(roleMap.entries()).map(([userId, roleInfo]) => ({
        id: userId,
        email: userId,
        role: roleInfo.role,
        role_id: roleInfo.role_id,
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!newUserEmail) {
      toast.error("Veuillez entrer un email");
      return;
    }

    try {
      toast.info("Cette fonctionnalité nécessite l'UUID de l'utilisateur");
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout du rôle");
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;

      toast.success("Rôle supprimé avec succès");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression du rôle");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
      <AdminPageHeader
        title="Gestion des Utilisateurs"
        description="Gérer les rôles et permissions des utilisateurs"
        icon={Users}
        statusIndicator={{
          label: `${totalUsers} utilisateurs avec rôles`,
          color: "green",
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Utilisateurs"
          value={totalUsers}
          icon={Users}
          color="blue"
          subtitle="Avec rôles"
        />
        <StatCard
          title="Administrateurs"
          value={adminCount}
          icon={Shield}
          color="purple"
          subtitle="Accès complet"
        />
        <StatCard
          title="Modérateurs"
          value={moderatorCount}
          icon={UserCheck}
          color="teal"
          subtitle="Modération"
        />
      </div>

      {/* Add Role Form */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Attribuer un rôle
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Email de l'utilisateur</Label>
              <Input
                type="email"
                placeholder="utilisateur@exemple.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                <SelectTrigger className="mt-1">
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
        </div>
      </Card>

      {/* Users List */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Utilisateurs avec rôles
          </h2>
          <div className="space-y-3">
            {users.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-lg border-2 border-dashed">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun utilisateur avec rôle</p>
              </div>
            ) : (
              users.map((usr) => (
                <div
                  key={usr.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      usr.role === 'admin' ? 'bg-purple-100' :
                      usr.role === 'moderator' ? 'bg-teal-100' :
                      'bg-blue-100'
                    }`}>
                      <Shield className={`h-5 w-5 ${
                        usr.role === 'admin' ? 'text-purple-600' :
                        usr.role === 'moderator' ? 'text-teal-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{usr.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">{usr.role}</p>
                    </div>
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
                          Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveRole(usr.role_id!)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
