import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, UserPlus, Shield, Trash2, UserCheck, Search, Filter, 
  Mail, Calendar, Ban, AlertTriangle, Eye, MoreVertical, X
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserProfile = {
  id: string;
  display_name?: string;
  avatar_url?: string | null;
  created_at: string;
  role?: string;
  role_id?: string;
  is_suspended?: boolean;
  restrictions_count?: number;
};

type ContentRestriction = {
  id: string;
  user_id: string;
  restriction_type: string;
  restriction_value: string;
  reason?: string | null;
  created_at: string | null;
};

type Suspension = {
  id: string;
  user_id: string;
  reason: string;
  suspended_at: string;
  suspended_until?: string;
  is_permanent: boolean;
};

export default function UsersManager() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("user");
  
  // Restriction dialog
  const [isRestrictionDialogOpen, setIsRestrictionDialogOpen] = useState(false);
  const [restrictionType, setRestrictionType] = useState<"category" | "tag" | "keyword">("category");
  const [restrictionValue, setRestrictionValue] = useState("");
  const [restrictionReason, setRestrictionReason] = useState("");
  
  // Suspension dialog
  const [isSuspensionDialogOpen, setIsSuspensionDialogOpen] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState<"1d" | "7d" | "30d" | "permanent">("7d");
  
  // View restrictions dialog
  const [isViewRestrictionsOpen, setIsViewRestrictionsOpen] = useState(false);
  const [userRestrictions, setUserRestrictions] = useState<ContentRestriction[]>([]);
  
  // Delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  
  // Bulk action
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"role" | "suspend" | "delete">("role");

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const suspendedCount = users.filter((u) => u.is_suspended).length;
  const withRestrictionsCount = users.filter((u) => (u.restrictions_count || 0) > 0).length;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (searchQuery) {
      filtered = filtered.filter((u) =>
        u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      if (roleFilter === "suspended") {
        filtered = filtered.filter((u) => u.is_suspended);
      } else if (roleFilter === "restricted") {
        filtered = filtered.filter((u) => (u.restrictions_count || 0) > 0);
      } else if (roleFilter === "no-role") {
        filtered = filtered.filter((u) => !u.role);
      } else {
        filtered = filtered.filter((u) => u.role === roleFilter);
      }
    }
    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles } = await supabase.from("user_roles").select("*");
      const { data: suspensions } = await supabase
        .from("user_suspensions")
        .select("*")
        .is("lifted_at", null);
      const { data: restrictions } = await supabase
        .from("user_content_restrictions")
        .select("user_id");

      const rolesMap = new Map<string, { role: string; role_id: string }>();
      userRoles?.forEach((role) => {
        rolesMap.set(role.user_id, { role: role.role, role_id: role.id });
      });

      const suspendedIds = new Set(
        suspensions?.filter(s => 
          s.is_permanent || 
          (s.suspended_until && new Date(s.suspended_until) > new Date())
        ).map(s => s.user_id) || []
      );

      const restrictionsCount = new Map<string, number>();
      restrictions?.forEach((r) => {
        restrictionsCount.set(r.user_id, (restrictionsCount.get(r.user_id) || 0) + 1);
      });

      const combinedUsers: UserProfile[] = (profilesData || []).map((profile) => {
        const roleInfo = rolesMap.get(profile.id);
        return {
          id: profile.id,
          display_name: profile.display_name || "Utilisateur",
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          role: roleInfo?.role,
          role_id: roleInfo?.role_id,
          is_suspended: suspendedIds.has(profile.id),
          restrictions_count: restrictionsCount.get(profile.id) || 0,
        };
      });

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!targetUserId) return;
    
    try {
      const existingUser = users.find(u => u.id === targetUserId);
      
      if (existingUser?.role_id) {
        await supabase.from("user_roles").update({ role: selectedRole as any }).eq("id", existingUser.role_id);
      } else {
        await supabase.from("user_roles").insert([{ user_id: targetUserId, role: selectedRole as any }]);
      }
      
      toast.success("Rôle attribué avec succès");
      setIsRoleDialogOpen(false);
      setTargetUserId(null);
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de l'attribution du rôle");
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      await supabase.from("user_roles").delete().eq("id", roleId);
      toast.success("Rôle supprimé");
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de la suppression du rôle");
    }
  };

  const handleAddRestriction = async () => {
    if (!targetUserId || !restrictionValue.trim()) return;
    
    try {
      await supabase.from("user_content_restrictions").insert([{
        user_id: targetUserId,
        restriction_type: restrictionType,
        restriction_value: restrictionValue.trim(),
        reason: restrictionReason || null,
        created_by: user!.id,
      }]);
      
      toast.success("Restriction ajoutée");
      setIsRestrictionDialogOpen(false);
      setRestrictionValue("");
      setRestrictionReason("");
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la restriction");
    }
  };

  const handleSuspendUser = async () => {
    if (!targetUserId || !suspensionReason.trim()) return;
    
    try {
      let suspendedUntil: string | null = null;
      if (suspensionDuration !== "permanent") {
        const days = suspensionDuration === "1d" ? 1 : suspensionDuration === "7d" ? 7 : 30;
        suspendedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }
      
      await supabase.from("user_suspensions").insert([{
        user_id: targetUserId,
        reason: suspensionReason,
        suspended_until: suspendedUntil,
        is_permanent: suspensionDuration === "permanent",
        created_by: user!.id,
      }]);
      
      toast.success("Utilisateur suspendu");
      setIsSuspensionDialogOpen(false);
      setSuspensionReason("");
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de la suspension");
    }
  };

  const handleLiftSuspension = async (userId: string) => {
    try {
      await supabase
        .from("user_suspensions")
        .update({ lifted_at: new Date().toISOString(), lifted_by: user!.id })
        .eq("user_id", userId)
        .is("lifted_at", null);
      
      toast.success("Suspension levée");
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de la levée de suspension");
    }
  };

  const handleViewRestrictions = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_content_restrictions")
        .select("*")
        .eq("user_id", userId);
      
      setUserRestrictions(data || []);
      setTargetUserId(userId);
      setIsViewRestrictionsOpen(true);
    } catch (error) {
      toast.error("Erreur lors du chargement des restrictions");
    }
  };

  const handleRemoveRestriction = async (restrictionId: string) => {
    try {
      await supabase.from("user_content_restrictions").delete().eq("id", restrictionId);
      toast.success("Restriction supprimée");
      if (targetUserId) handleViewRestrictions(targetUserId);
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleBulkAction = async () => {
    if (selectedUsers.size === 0) return;
    
    try {
      const userIds = Array.from(selectedUsers);
      
      if (bulkAction === "role") {
        for (const userId of userIds) {
          const existingUser = users.find(u => u.id === userId);
          if (existingUser?.role_id) {
            await supabase.from("user_roles").update({ role: selectedRole as any }).eq("id", existingUser.role_id);
          } else {
            await supabase.from("user_roles").insert([{ user_id: userId, role: selectedRole as any }]);
          }
        }
        toast.success(`Rôle attribué à ${userIds.length} utilisateurs`);
      } else if (bulkAction === "suspend") {
        for (const userId of userIds) {
          await supabase.from("user_suspensions").insert([{
            user_id: userId,
            reason: suspensionReason || "Action en masse",
            suspended_until: null,
            is_permanent: true,
            created_by: user!.id,
          }]);
        }
        toast.success(`${userIds.length} utilisateurs suspendus`);
      }
      
      setIsBulkActionDialogOpen(false);
      setSelectedUsers(new Set());
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de l'action en masse");
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700 border-purple-200";
      case "moderator": return "bg-teal-100 text-teal-700 border-teal-200";
      case "user": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-background min-h-full">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-background min-h-full">
      <AdminPageHeader
        title="Gestion des Utilisateurs"
        description="Gérer les utilisateurs, rôles, restrictions et suspensions"
        icon={Users}
        statusIndicator={{ label: `${totalUsers} utilisateurs`, color: "green" }}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total" value={totalUsers} icon={Users} color="blue" subtitle="Utilisateurs" />
        <StatCard title="Admins" value={adminCount} icon={Shield} color="purple" subtitle="Accès complet" />
        <StatCard title="Suspendus" value={suspendedCount} icon={Ban} color="red" subtitle="Bloqués" />
        <StatCard title="Restreints" value={withRestrictionsCount} icon={AlertTriangle} color="orange" subtitle="Restrictions actives" />
      </div>

      {/* Search and Filters */}
      <Card className="border-none shadow-md">
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="admin">Administrateurs</SelectItem>
              <SelectItem value="moderator">Modérateurs</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
              <SelectItem value="no-role">Sans rôle</SelectItem>
              <SelectItem value="suspended">Suspendus</SelectItem>
              <SelectItem value="restricted">Avec restrictions</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedUsers.size > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setBulkAction("role");
                setIsBulkActionDialogOpen(true);
              }}
            >
              Actions ({selectedUsers.size})
            </Button>
          )}
        </div>
      </Card>

      {/* Users List */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Utilisateurs ({filteredUsers.length})</h2>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                onCheckedChange={toggleAllUsers}
              />
              <span className="text-sm text-muted-foreground">Tout sélectionner</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center bg-muted/50 rounded-lg border-2 border-dashed">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              filteredUsers.map((usr) => (
                <div
                  key={usr.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    usr.is_suspended ? "bg-destructive/10" : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Checkbox
                      checked={selectedUsers.has(usr.id)}
                      onCheckedChange={() => toggleUserSelection(usr.id)}
                    />
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {usr.avatar_url ? (
                        <img src={usr.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Users className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">{usr.display_name}</p>
                        {usr.role && (
                          <Badge variant="outline" className={getRoleBadgeClass(usr.role)}>
                            {usr.role}
                          </Badge>
                        )}
                        {usr.is_suspended && (
                          <Badge variant="destructive" className="text-xs">
                            <Ban className="h-3 w-3 mr-1" />
                            Suspendu
                          </Badge>
                        )}
                        {(usr.restrictions_count || 0) > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {usr.restrictions_count} restriction(s)
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(usr.created_at).toLocaleDateString("fr-FR")}
                        </span>
                        <span className="font-mono text-xs">ID: {usr.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setTargetUserId(usr.id);
                        setSelectedRole((usr.role as any) || "user");
                        setIsRoleDialogOpen(true);
                      }}>
                        <Shield className="h-4 w-4 mr-2" />
                        {usr.role ? "Modifier le rôle" : "Attribuer un rôle"}
                      </DropdownMenuItem>
                      
                      {usr.role_id && (
                        <DropdownMenuItem
                          onClick={() => handleRemoveRole(usr.role_id!)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Retirer le rôle
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => {
                        setTargetUserId(usr.id);
                        setIsRestrictionDialogOpen(true);
                      }}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Ajouter restriction
                      </DropdownMenuItem>
                      
                      {(usr.restrictions_count || 0) > 0 && (
                        <DropdownMenuItem onClick={() => handleViewRestrictions(usr.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir restrictions ({usr.restrictions_count})
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      {usr.is_suspended ? (
                        <DropdownMenuItem onClick={() => handleLiftSuspension(usr.id)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Lever la suspension
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            setTargetUserId(usr.id);
                            setIsSuspensionDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspendre
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attribuer un rôle</DialogTitle>
            <DialogDescription>Sélectionnez le rôle à attribuer</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={(v: any) => setSelectedRole(v)}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAssignRole}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restriction Dialog */}
      <Dialog open={isRestrictionDialogOpen} onOpenChange={setIsRestrictionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une restriction</DialogTitle>
            <DialogDescription>Restreindre l'accès à certains contenus</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Type de restriction</Label>
              <Select value={restrictionType} onValueChange={(v: any) => setRestrictionType(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Catégorie</SelectItem>
                  <SelectItem value="tag">Tag/Sujet</SelectItem>
                  <SelectItem value="keyword">Mot-clé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valeur</Label>
              <Input
                value={restrictionValue}
                onChange={(e) => setRestrictionValue(e.target.value)}
                placeholder="Ex: Politique, Violence..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Raison (optionnel)</Label>
              <Textarea
                value={restrictionReason}
                onChange={(e) => setRestrictionReason(e.target.value)}
                placeholder="Raison de la restriction..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestrictionDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddRestriction}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspension Dialog */}
      <Dialog open={isSuspensionDialogOpen} onOpenChange={setIsSuspensionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspendre l'utilisateur</DialogTitle>
            <DialogDescription>L'utilisateur ne pourra plus accéder à l'application</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Durée</Label>
              <Select value={suspensionDuration} onValueChange={(v: any) => setSuspensionDuration(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 jour</SelectItem>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Raison</Label>
              <Textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Raison de la suspension..."
                className="mt-1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspensionDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleSuspendUser}>Suspendre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Restrictions Dialog */}
      <Dialog open={isViewRestrictionsOpen} onOpenChange={setIsViewRestrictionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restrictions actives</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-80 overflow-y-auto">
            {userRestrictions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune restriction</p>
            ) : (
              userRestrictions.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Badge variant="outline" className="mb-1">{r.restriction_type}</Badge>
                    <p className="font-medium">{r.restriction_value}</p>
                    {r.reason && <p className="text-xs text-muted-foreground">{r.reason}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRestriction(r.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Action en masse ({selectedUsers.size} utilisateurs)</DialogTitle>
          </DialogHeader>
          <Tabs value={bulkAction} onValueChange={(v: any) => setBulkAction(v)}>
            <TabsList className="w-full">
              <TabsTrigger value="role" className="flex-1">Rôle</TabsTrigger>
              <TabsTrigger value="suspend" className="flex-1">Suspendre</TabsTrigger>
            </TabsList>
            <TabsContent value="role" className="py-4">
              <Label>Rôle à attribuer</Label>
              <Select value={selectedRole} onValueChange={(v: any) => setSelectedRole(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="moderator">Modérateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>
            <TabsContent value="suspend" className="py-4">
              <Label>Raison de suspension</Label>
              <Textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Raison..."
                className="mt-1"
              />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionDialogOpen(false)}>Annuler</Button>
            <Button
              variant={bulkAction === "suspend" ? "destructive" : "default"}
              onClick={handleBulkAction}
            >
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
