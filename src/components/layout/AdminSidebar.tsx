import { Link, useLocation } from "react-router-dom";
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
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0 left-0 overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin")}>
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Pacifico, cursive' }}>
            Cake Admin
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path || 
                          (path !== "/admin" && location.pathname.startsWith(path));
          
          return (
            <Link
              key={id}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={() => navigate("/")}
        >
          <LayoutDashboard className="h-4 w-4" />
          Voir le site
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
};
