import { Home, Search, ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Error 404 - Page Not Found
 * 
 * Displayed when user tries to access a non-existent route
 */
const Error404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-5xl font-bold text-red-600">404</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Page introuvable
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Que s&apos;est-il passé ?</strong><br />
              L&apos;URL que vous avez saisie ne correspond à aucune page de notre application.
              Cela peut arriver si :
            </p>
            <ul className="mt-2 ml-4 text-sm text-blue-700 list-disc space-y-1">
              <li>L&apos;URL a été mal saisie</li>
              <li>La page a été supprimée ou déplacée</li>
              <li>Le lien que vous avez suivi est obsolète</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Link>
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/mon-flux">
                <Search className="w-4 h-4 mr-2" />
                Mon Flux
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Besoin d&apos;aide ? Contactez notre{' '}
              <Link to="/messages" className="text-blue-600 hover:underline">
                support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error404;