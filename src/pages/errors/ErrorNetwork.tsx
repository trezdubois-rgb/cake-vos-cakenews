import { RefreshCw, WifiOff } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Network Error - Connection Lost
 * 
 * Displayed when network connection is lost or unavailable
 */
const ErrorNetwork: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/health', { method: 'HEAD' });
      if (response.ok) {
        window.location.reload();
      } else {
        alert("La connexion n'est pas encore rétablie. Veuillez réessayer.");
      }
    } catch (_error) {
      alert("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Connexion perdue
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Impossible de se connecter au serveur. Vérifiez votre connexion internet.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Que s&apos;est-il passé ?</strong><br />
              Votre appareil ne peut pas communiquer avec nos serveurs.
              Cela peut être dû à :
            </p>
            <ul className="mt-2 ml-4 text-sm text-blue-700 list-disc space-y-1">
              <li>Une perte de connexion internet</li>
              <li>Un problème avec votre réseau Wi-Fi ou données mobiles</li>
              <li>Un pare-feu ou proxy bloquant la connexion</li>
              <li>Une maintenance temporaire de nos serveurs</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Solutions :</strong>
            </p>
            <ol className="mt-2 ml-4 text-sm text-green-700 list-decimal space-y-1">
              <li>Vérifiez que vous êtes connecté à internet</li>
              <li>Essayez de désactiver/réactiver le Wi-Fi ou les données mobiles</li>
              <li>Vérifiez que d&apos;autres sites web fonctionnent</li>
              <li>Attendez quelques minutes et réessayez</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="default"
              className="w-full"
              onClick={checkConnection}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Vérifier la connexion
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReload}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recharger la page
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Mode hors ligne disponible •{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Accéder au contenu en cache
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorNetwork;