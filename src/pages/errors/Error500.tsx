import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Error 500 - Internal Server Error
 * 
 * Displayed when a server error occurs
 */
const Error500: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Erreur serveur
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Une erreur inattendue s&apos;est produite sur nos serveurs.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Que s&apos;est-il passé ?</strong><br />
              Nos serveurs ont rencontré une erreur lors du traitement de votre demande.
              Nos équipes ont été automatiquement notifiées.
            </p>
            <ul className="mt-2 ml-4 text-sm text-red-700 list-disc space-y-1">
              <li>Le problème est temporaire dans la plupart des cas</li>
              <li>Vos données sont en sécurité</li>
              <li>Nous travaillons à résoudre le problème</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Que faire ?</strong>
            </p>
            <ol className="mt-2 ml-4 text-sm text-blue-700 list-decimal space-y-1">
              <li>Attendez quelques minutes et réessayez</li>
              <li>Rechargez la page</li>
              <li>Si le problème persiste, contactez le support</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="default"
              className="w-full"
              onClick={handleReload}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recharger la page
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Code d&apos;erreur : <span className="font-mono font-semibold">500</span>
              {' • '}
              <Link to="/messages" className="text-blue-600 hover:underline">
                Contacter le support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error500;