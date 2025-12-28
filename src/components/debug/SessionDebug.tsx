import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SessionDebug = () => {
  const { user, session, loading, isAuthenticated } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setRole(data?.role || null);
      setRoleLoading(false);
    };

    if (!loading) {
      fetchRole();
    }
  }, [user, loading]);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <Card className="fixed bottom-20 right-4 z-[9999] w-80 bg-background/95 backdrop-blur border-2 border-primary/20 shadow-xl">
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center gap-2">
          🔧 Debug Session & Rôle
          <Badge variant="outline" className="text-xs">DEV</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2 space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Auth Loading:</span>
          <Badge variant={loading ? "secondary" : "outline"}>
            {loading ? "true" : "false"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">isAuthenticated:</span>
          <Badge variant={isAuthenticated ? "default" : "destructive"}>
            {isAuthenticated ? "true" : "false"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">user.id:</span>
          <span className="text-foreground truncate max-w-[140px]">
            {user?.id || "null"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">email:</span>
          <span className="text-foreground truncate max-w-[140px]">
            {user?.email || "null"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Role Loading:</span>
          <Badge variant={roleLoading ? "secondary" : "outline"}>
            {roleLoading ? "true" : "false"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">isAdmin:</span>
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {role === "admin" ? "true" : "false"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Role:</span>
          <Badge variant="outline">{role || "none"}</Badge>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Session:</span>
          <Badge variant={session ? "default" : "destructive"}>
            {session ? "active" : "null"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
