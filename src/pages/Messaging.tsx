import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, MessageSquare, Info } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Messaging = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState("notifications");

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-4">
        <MessageSquare className="w-12 h-12 text-primary mb-2" />
        <h2 className="text-2xl font-bold">Messagerie</h2>
        <p className="text-muted-foreground max-w-md">
          Connectez-vous pour voir vos notifications et messages.
        </p>
        <Button onClick={() => navigate("/auth")}>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Messagerie</h1>

      <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="notifications" className="relative">
            <Bell className="w-4 h-4 mr-2" />
            Notifs
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="system">
            <Info className="w-4 h-4 mr-2" />
            Système
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Récents</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>
                Tout marquer comme lu
              </Button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucune notification pour le moment</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Messages Directs</h3>
              <p className="text-muted-foreground max-w-xs mb-4">
                La messagerie privée entre utilisateurs arrive bientôt !
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Annonces Cakenews</h3>
              <p className="text-muted-foreground max-w-xs">
                Aucune annonce système pour le moment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messaging;
