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
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Shield, Trash2, UserCheck, Search, Filter, Mail, Calendar, Activity } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  role?: string;
  role_id?: string;
};

export default function UsersManager() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Dialog states
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "moderator" | "user">("user");

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const moderatorCount = users.filter((u) => u.role === "moderator").length;
  const usersWithRoles = users.filter((u) => u.role).length;

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

  // Filter users based on search and role filter
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((u) =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      if (roleFilter === "no-role") {
        filtered = filtered.filter((u) => !u.role);
      } else {
        filtered = filtered.filter((u) => u.role === roleFilter);
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    console.log("🔍 Starting to fetch users...");
    try {
      setLoading(true);
      
      // Simple fetch of user_roles only
      console.log("📊 Fetching user roles...");
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      console.log("📋 User roles response:", { userRoles, rolesError });

      if (rolesError) {
        console.error("❌ Error fetching roles:", rolesError);
        throw new Error(`RLS Error: ${rolesError.message}`);
      }

      if (!userRoles || userRoles.length === 0) {
        console.warn("⚠️ No user roles found");
        setUsers([]);
        toast.info("Aucun rôle d'utilisateur trouvé");
        return;
      }

      // Create simple user list from roles
      const simpleUsers: UserProfile[] = userRoles.map((role) => ({
        id: role.user_id,
        email: `user-${role.user_id.substring(0, 8)}`,
        full_name: "Utilisateur",
        avatar_url: undefined,
        created_at: role.created_at || new Date().toISOString(),
        role: role.role,
        role_id: role.id,
      }));

      console.log("✅ Successfully created user list:", simpleUsers.length);
      setUsers(simpleUsers);
      toast.success(`${simpleUsers.length} utilisateur(s) chargé(s)`);
      
    } catch (error: any) {
      console.error("💥 Fatal error fetching users:", error);
      toast.error(`Erreur: ${error.message || "Impossible de charger"}`);
      setUsers([]);
    } finally {
      setLoading(false);
      console.log("🏁 Fetch complete");
    }
  };

  const handleAddRole = async () => {
    if (!newUserEmail) {
      toast.error("Veuillez entrer un email");
      return;
    }

    try {
      // Find user by email pattern (since we can't access real emails)
      const matchingUser = users.find((u) => 
        u.email.toLowerCase().includes(newUserEmail.toLowerCase()) ||
        u.id.toLowerCase().includes(newUserEmail.toLowerCase())
      );

      if (!matchingUser) {
        toast.error("Utilisateur non trouvé. Utilisez l'ID utilisateur.");
        return;
      }

      // Check if user already has a role
      if (matchingUser.role) {
        toast.error("Cet utilisateur a déjà un rôle. Supprimez-le d'abord.");
        return;
      }

      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: matchingUser.id, role: newUserRole } as any]);

      if (error) throw error;

      toast.success("Rôle attribué avec succès");
      setIsAddRoleOpen(false);
      setNewUserEmail("");
      setNewUserRole("user");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout du rôle");
      console.error(error);
    }
  };

  const handleUpdateRole = async (userId: string, currentRoleId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole as any })
        .eq("id", currentRoleId);

      if (error) throw error;

      toast.success("Rôle mis à jour");
      fetchUsers();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
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

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "moderator":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "user":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-purple-600" />;
      case "moderator":
        return <UserCheck className="h-4 w-4 text-teal-600" />;
      default:
        return <Users className="h-4 w-4 text-blue-600" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-32" />
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
        description="Gérer les utilisateurs, rôles et permissions"
        icon={Users}
        actions={
          <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">
                <UserPlus className="mr-2 h-4 w-4" />
                Attribuer un rôle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attribuer un rôle</DialogTitle>
                <DialogDescription>
                  Recherchez un utilisateur et attribuez-lui un rôle
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email">ID ou Email de l'utilisateur</Label>
                  <Input
                    id="email"
                    placeholder="Entrez l'ID utilisateur..."
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Astuce : Copiez l'ID depuis la liste ci-dessous
                  </p>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddRole}>
                  <Shield className="mr-2 h-4 w-4" />
                  Attribuer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
        statusIndicator={{
          label: `${totalUsers} utilisateurs`,
          color: "green",
        }}
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Utilisateurs"
          value={totalUsers}
          icon={Users}
          color="blue"
          subtitle="Inscrits"
        />
        <StatCard
          title="Avec Rôles"
          value={usersWithRoles}
          icon={Shield}
          color="green"
          subtitle="Assignés"
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

      {/* Search and Filters */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email, nom ou ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="moderator">Modérateurs</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                  <SelectItem value="no-role">Sans rôle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Utilisateurs ({filteredUsers.length})
          </h2>
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-lg border-2 border-dashed">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery || roleFilter !== "all" 
                    ? "Aucun utilisateur trouvé avec ces critères" 
                    : "Aucun utilisateur"}
                </p>
              </div>
            ) : (
              filteredUsers.map((usr) => (
                <div
                  key={usr.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      usr.role === 'admin' ? 'bg-purple-100' :
                      usr.role === 'moderator' ? 'bg-teal-100' :
                      usr.role ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {getRoleIcon(usr.role)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-700">
                          {usr.full_name || "Utilisateur"}
                        </p>
                        {usr.role && (
                          <Badge variant="outline" className={getRoleBadgeColor(usr.role)}>
                            {usr.role}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {usr.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(usr.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        ID: {usr.id.substring(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {usr.role && usr.role_id && (
                      <>
                        <Select
                          value={usr.role}
                          onValueChange={(newRole) => handleUpdateRole(usr.id, usr.role_id!, newRole)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
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
                                Êtes-vous sûr de vouloir retirer le rôle de cet utilisateur ?
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
                      </>
                    )}
                    {!usr.role && (
                      <Badge variant="outline" className="text-muted-foreground">
                        Aucun rôle
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
