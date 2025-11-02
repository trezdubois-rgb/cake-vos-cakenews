import { Home, FileText, Image, Palette, Settings, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Accueil", icon: Home, path: "/admin" },
  { id: "articles", label: "Articles", icon: FileText, path: "/admin/articles" },
  { id: "users", label: "Utilisateurs", icon: Users, path: "/admin/users" },
  { id: "design", label: "Design", icon: Palette, path: "/admin/design" },
  { id: "settings", label: "Réglages", icon: Settings, path: "/admin/settings" },
];

export const AdminBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path || 
                          (path !== "/admin" && location.pathname.startsWith(path));
          
          return (
            <Link
              key={id}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all",
                "min-w-0 flex-1 text-xs font-medium",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-transform",
                  isActive && "scale-110"
                )} 
              />
              <span className="truncate text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
