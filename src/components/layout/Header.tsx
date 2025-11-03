import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur border-b border-border/40">
      <div className="flex h-full items-center justify-between px-4">
        {/* Menu Hamburger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link 
                to="/" 
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/mon-flux" 
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Mon Flux
              </Link>
              <Link 
                to="/messages" 
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Messages
              </Link>
              <Link 
                to="/profil" 
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Profil
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo CAKENEWS */}
        <h1 className="text-2xl font-bold tracking-wider text-muted-foreground/60">
          CAKENEWS
        </h1>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-muted" />
      </div>
    </header>
  );
};