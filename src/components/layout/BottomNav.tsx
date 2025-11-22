import { Home, Sparkles, MessageSquare, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      label: "Accueil",
      icon: Home,
      path: "/",
    },
    {
      label: "Mon Feed",
      icon: Sparkles,
      path: "/my-feed",
    },
    {
      label: "Messagerie",
      icon: MessageSquare,
      path: "/messages",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: "Profil",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <item.icon
                  className={`w-6 h-6 ${active ? "fill-current" : ""}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};