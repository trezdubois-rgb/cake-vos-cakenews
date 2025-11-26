import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Palette, 
  Settings, 
  Image, 
  Video, 
  FolderTree, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, path: "/admin/dashboard" },
  { id: "articles", label: "Articles", icon: FileText, path: "/admin/articles" },
  { id: "media", label: "Médiathèque", icon: Image, path: "/admin/media" },
  { id: "ads", label: "Publicités", icon: Video, path: "/admin/ads" },
  { id: "categories", label: "Catégories", icon: FolderTree, path: "/admin/categories" },
  { id: "users", label: "Utilisateurs", icon: Users, path: "/admin/users" },
  { id: "design", label: "Design", icon: Palette, path: "/admin/design" },
  { id: "settings", label: "Réglages", icon: Settings, path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className="hidden md:flex flex-col w-72 border-r bg-card/50 backdrop-blur-xl h-screen sticky top-0 left-0 overflow-y-auto shadow-xl z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/admin")}>
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Cake Admin</h1>
            <p className="text-xs text-muted-foreground">v2.4.0</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Menu Principal
        </p>
        <nav className="space-y-1">
          {navItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = location.pathname === path || 
                            (path !== "/admin" && location.pathname.startsWith(path));
            
            return (
              <Link
                key={id}
                to={path}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="font-medium text-sm">{label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.email?.substring(0, 2).toUpperCase() || "AD"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">Administrateur</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-2 bg-background hover:bg-accent" 
              onClick={() => navigate("/")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Voir le site
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
