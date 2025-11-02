<<<<<<< HEAD
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { NotificationBadge } from '../notifications/NotificationBadge';
import { SearchDialog } from './SearchDialog';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // SUPPRESSION: const { t } = useTranslation();
=======
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchDialog } from "./SearchDialog";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { NotificationBadge } from "../notifications/NotificationBadge";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Menu Hamburger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
<<<<<<< HEAD
            <button className="p-2 hover:bg-accent rounded-lg" aria-label="Ouvrir le menu">
=======
            <button className="p-2 hover:bg-accent rounded-lg">
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <nav className="flex flex-col gap-4 mt-8">
<<<<<<< HEAD
              <Link
                to="/"
=======
              <Link 
                to="/" 
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Accueil
              </Link>
<<<<<<< HEAD
              <Link
                to="/mon-flux"
=======
              <Link 
                to="/mon-flux" 
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Mon Flux
              </Link>
<<<<<<< HEAD
              <Link
                to="/messages"
=======
              <Link 
                to="/messages" 
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Messages
              </Link>
<<<<<<< HEAD
              <Link
                to="/profil"
=======
              <Link 
                to="/profil" 
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Profil
              </Link>
<<<<<<< HEAD
              <Link
                to="/privacy-policy"
                className="text-lg font-medium hover:text-primary p-3 hover:bg-accent rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Politique de confidentialité
              </Link>
=======
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
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
<<<<<<< HEAD
=======
          <ThemeSwitcher />
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        </div>
      </div>
    </header>
  );
};