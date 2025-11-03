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
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-[hsl(217,91%,60%)]/95 backdrop-blur border-t border-[hsl(217,91%,70%)]">
      <div className="h-full flex items-center justify-around px-2">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={id}
              to={path}
              className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-white/90 min-w-[70px]"
            >
              <Icon size={24} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};