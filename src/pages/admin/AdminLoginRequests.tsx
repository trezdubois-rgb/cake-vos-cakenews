import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Shield } from "lucide-react";

interface LoginRequest {
  id: string;
  user_id: string;
  email_used: string;
  status: string;
  created_at: string;
  validated_by?: string;
  validated_at?: string;
}

export default function AdminLoginRequests() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<LoginRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
    if (!authLoading && user && !isAdmin) {
      navigate("/");
    }
  }, [user, authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
      
      // Real-time subscription
      const channel = supabase
        .channel("admin_login_requests_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "admin_login_requests",
          },
          () => {
            fetchRequests();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_login_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data || []) as LoginRequest[]);
    } catch (error) {
      console.error("Error fetching login requests:", error);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("admin_login_requests")
        .update({
          status: "approved",
          validated_by: user?.id,
          validated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Connexion approuvée !");
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("admin_login_requests")
        .update({
          status: "rejected",
          validated_by: user?.id,
          validated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Connexion refusée");
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Erreur lors du refus");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const historyRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Demandes de connexion</h1>
          <p className="text-muted-foreground">
            Validez les connexions des membres de l'équipe
          </p>
        </div>
      </div>

      {/* Demandes en attente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Demandes en attente
            {pendingRequests.length > 0 && (
              <Badge variant="destructive">{pendingRequests.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Demandes nécessitant votre validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucune demande en attente
            </p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {request.email_used}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(request.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(request.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Refuser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>
            Demandes déjà traitées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun historique
            </p>
          ) : (
            <div className="space-y-3">
              {historyRequests.slice(0, 10).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {request.email_used}
                    </p>
                  </div>
                  <Badge
                    variant={
                      request.status === "approved" ? "default" : "destructive"
                    }
                  >
                    {request.status === "approved" ? "Approuvé" : "Refusé"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
