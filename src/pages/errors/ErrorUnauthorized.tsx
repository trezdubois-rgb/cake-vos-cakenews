import { Home, Lock, LogIn } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Error 401/403 - Unauthorized Access
 * 
 * Displayed when user tries to access a protected resource without proper permissions
 */
const ErrorUnauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
            <Lock className="w-12 h-12 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Accès non autorisé
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Que s&apos;est-il passé ?</strong><br />
              Cette page nécessite des permissions spéciales que vous ne possédez pas actuellement.
            </p>
            <ul className="mt-2 ml-4 text-sm text-yellow-700 list-disc space-y-1">
              <li>Vous n&apos;êtes peut-être pas connecté</li>
              <li>Votre compte n&apos;a pas les droits d&apos;administrateur</li>
              <li>Votre session a peut-être expiré</li>
              <li>Cette page est réservée aux administrateurs</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Que faire ?</strong>
            </p>
            <ol className="mt-2 ml-4 text-sm text-blue-700 list-decimal space-y-1">
              <li>Vérifiez que vous êtes connecté avec le bon compte</li>
              <li>Contactez un administrateur pour obtenir les permissions</li>
              <li>Retournez à l&apos;accueil et reconnectez-vous</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="default"
              className="w-full"
              asChild
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/profil">
                <LogIn className="w-4 h-4 mr-2" />
                Mon profil
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Code d&apos;erreur : <span className="font-mono font-semibold">403</span>
              {' • '}
              <Link to="/messages" className="text-blue-600 hover:underline">
                Demander l&apos;accès
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorUnauthorized;