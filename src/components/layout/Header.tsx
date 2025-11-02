import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchDialog } from './SearchDialog';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { NotificationBadge } from '../notifications/NotificationBadge';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Menu Hamburger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-lg" aria-label="Ouvrir le menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
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

        {/* Logo & Slogan */}
        <Link to="/" className="flex flex-col items-center flex-1">
          <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "'Pacifico', cursive" }}>
            Cake
          </h1>
          <p className="text-xs text-muted-foreground">Vos Cakenews</p>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <SearchDialog />
          <NotificationBadge />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
