<<<<<<< HEAD
import { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
=======
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
<<<<<<< HEAD
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
=======
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-destructive">404</h1>
        <p className="text-xl text-muted-foreground">Page introuvable</p>
<<<<<<< HEAD
        <Link to="/accueil" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold">
          Retour à l&apos;accueil
        </Link>
=======
        <a href="/accueil" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold">
          Retour à l'accueil
        </a>
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default NotFound;
=======
export default NotFound;
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
