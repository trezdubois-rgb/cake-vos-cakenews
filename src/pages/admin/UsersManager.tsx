import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserPlus, Shield, Trash2, Search, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
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
  email: string; // Note: This is actually the ID in the current implementation due to RLS/Access restrictions on auth.users
  display_name?: string;
  avatar_url?: string;
  role?: string;
  role_id?: string;
};

export default function UsersManager() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "moderator" | "user">("user");

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

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (u) => 
          (u.display_name?.toLowerCase() || "").includes(query) ||
          (u.email?.toLowerCase() || "").includes(query) ||
          (u.role?.toLowerCase() || "").includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role");

      if (rolesError) throw rolesError;

      // 2. Fetch profiles to get display names and avatars
      // Note: We can't easily get emails from auth.users on the client side without an edge function
      // So we'll rely on profiles.
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url");

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const roleMap = new Map(userRoles?.map(r => [r.user_id, r]) || []);

      // Combine data. 
      // We start with profiles as the base list of users we can see
      const combinedUsers: UserWithRole[] = (profiles || []).map(profile => {
        const roleData = roleMap.get(profile.id);
        return {
          id: profile.id,
          email: "Email masqué", // Placeholder as we can't access auth.users directly
          display_name: profile.display_name || "Utilisateur sans nom",
          avatar_url: profile.avatar_url,
          role: roleData?.role || "user",
          role_id: roleData?.id
        };
      });

      setUsers(combinedUsers);
      setFilteredUsers(combinedUsers);

    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    // This is still limited by the fact we need a User ID, not an email, to insert into user_roles
    // In a real app, you'd have an Edge Function to lookup ID by Email.
    toast.info("Fonctionnalité limitée : Nécessite l'ID utilisateur (UUID) pour le moment.");
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
      case "admin": return "bg-red-500 hover:bg-red-600";
      case "moderator": return "bg-blue-500 hover:bg-blue-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Utilisateurs
          </h1>
          <p className="text-muted-foreground">Gérez les rôles et les accès</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Role Card */}
        <Card className="md:col-span-1 border-none shadow-md bg-gradient-to-br from-card to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Attribuer un rôle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>ID Utilisateur (UUID)</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID..."
                  className="pl-9"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Entrez l'UUID de l'utilisateur pour lui attribuer un rôle.
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
            <Button onClick={handleAddRole} className="w-full bg-primary hover:bg-primary/90">
              <Shield className="mr-2 h-4 w-4" />
              Attribuer le rôle
            </Button>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="md:col-span-2 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des utilisateurs ({users.length})</CardTitle>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filtrer..."
                  className="pl-9 bg-background/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                filteredUsers.map((usr) => (
                  <div
                    key={usr.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarImage src={usr.avatar_url} />
                        <AvatarFallback className="bg-primary/5 text-primary">
                          {usr.display_name?.substring(0, 2).toUpperCase() || "UN"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm md:text-base">{usr.display_name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="hidden md:inline">ID: {usr.id.substring(0, 8)}...</span>
                          <Badge className={`${getRoleBadgeColor(usr.role)} text-white border-none`}>
                            {usr.role}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {usr.role !== 'user' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Révoquer le rôle ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              L'utilisateur perdra ses privilèges {usr.role}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveRole(usr.role_id!)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Révoquer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
