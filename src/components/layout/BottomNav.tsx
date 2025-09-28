import { Home, Sparkles, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "home", label: "Accueil", icon: Home, path: "/" },
  { id: "personal", label: "Mon Flux", icon: Sparkles, path: "/mon-flux" },
  { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages" },
  { id: "profile", label: "Profil", icon: User, path: "/profil" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={id}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all",
                "min-w-0 flex-1 text-xs font-medium",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                size={20} 
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