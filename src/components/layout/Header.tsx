import { Menu, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
      setMenuOpen(false);
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b border-border/40">
      <div className="flex h-full items-center justify-between px-4">
        {/* Menu Hamburger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <nav className="flex flex-col gap-2 mt-8">
              <Link 
                to="/" 
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent/10 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Accueil
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/mon-flux" 
                    className="text-lg font-medium hover:text-primary p-3 hover:bg-accent/10 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mon Flux
                  </Link>
                  <Link 
                    to="/messages" 
                    className="text-lg font-medium hover:text-primary p-3 hover:bg-accent/10 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <Link 
                    to="/profil" 
                    className="text-lg font-medium hover:text-primary p-3 hover:bg-accent/10 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  
                  <div className="border-t border-border my-4" />
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 text-lg font-medium text-destructive p-3 hover:bg-destructive/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-border my-4" />
                  <Link 
                    to="/auth" 
                    className="flex items-center gap-3 text-lg font-medium text-primary p-3 hover:bg-primary/10 rounded-lg transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    Se connecter
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wider text-primary">
          CAKENEWS
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link to="/profil">
                <Avatar className="h-9 w-9 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/auth">
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
