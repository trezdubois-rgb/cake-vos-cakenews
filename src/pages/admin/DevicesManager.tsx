import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Shield, Trash2, Clock, Calendar, MapPin, Smartphone } from "lucide-react";

interface TrustedDevice {
  id: string;
  user_id: string;
  device_fingerprint: string;
  device_info: {
    browser: string;
    os: string;
    userAgent: string;
    language: string;
    timezone: string;
    screenResolution: string;
  };
  created_at: string;
  last_used: string;
  ip_address?: string;
}

export default function DevicesManager() {
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrustedDevices();
  }, []);

  const fetchTrustedDevices = async () => {
    try {
      const { data, error } = await supabase
        .from("trusted_devices") // Cette table n'existe peut-être pas encore dans la base
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDevices((data as TrustedDevice[]) || []);
    } catch (error) {
      console.error("Error fetching trusted devices:", error);
      toast.error("Erreur lors du chargement des appareils approuvés");
      // Pour l'instant, on affiche un message d'information
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from("trusted_devices")
        .delete()
        .eq("id", deviceId);

      if (error) throw error;

      toast.success("Appareil révoqué avec succès");
      fetchTrustedDevices(); // Recharger la liste
    } catch (error) {
      console.error("Error revoking device:", error);
      toast.error("Erreur lors de la révocation de l'appareil");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Gestion des appareils</h1>
          <p className="text-muted-foreground">
            Appareils approuvés pour l'accès administratif
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Appareils approuvés
              </CardTitle>
              <CardDescription>
                Liste des appareils autorisés à accéder à l'espace administratif
              </CardDescription>
            </div>
            <Badge variant="secondary">{devices.length} appareils</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-12">
              <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun appareil approuvé</h3>
              <p className="text-muted-foreground mb-4">
                Les appareils approuvés apparaîtront ici après que vous ayez validé une demande de connexion.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {device.device_info.browser} sur {device.device_info.os}
                      </div>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{device.ip_address || "IP non enregistrée"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Ajouté: {new Date(device.created_at).toLocaleString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Dernière utilisation: {new Date(device.last_used).toLocaleString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeDevice(device.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Révoquer
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Shield className="h-5 w-5" />
            Sécurité des appareils
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start gap-2">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <span>Chaque appareil doit être approuvé par un administrateur avant d'accéder à l'espace admin</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <span>Les informations d'appareil sont stockées pour prévenir les accès non autorisés</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <span>Vous pouvez révoquer l'accès à tout moment depuis cette interface</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}