import { Home, FileText, Image, Settings, Users, FolderTree, Video, Palette } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Accueil", icon: Home, path: "/admin" },
  { id: "articles", label: "Articles", icon: FileText, path: "/admin/articles" },
  { id: "categories", label: "Catégories", icon: FolderTree, path: "/admin/categories" },
  { id: "media", label: "Médias", icon: Image, path: "/admin/media" },
  { id: "users", label: "Utilisateurs", icon: Users, path: "/admin/users" },
  { id: "ads", label: "Pubs", icon: Video, path: "/admin/ads" },
  { id: "design", label: "Design", icon: Palette, path: "/admin/design" },
  { id: "settings", label: "Réglages", icon: Settings, path: "/admin/settings" },
];

export const AdminBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path || 
                          (path !== "/admin" && location.pathname.startsWith(path));
          
          return (
            <Link
              key={id}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg transition-all",
                "text-[10px] font-medium",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon 
                size={18} 
                className={cn(
                  "transition-transform",
                  isActive && "scale-110"
                )} 
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
