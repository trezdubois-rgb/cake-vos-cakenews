import { useState, useEffect } from "react";
import { Bell, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: 'notification' | 'admin';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "notification",
    title: "Nouveau contenu disponible",
    content: "3 nouveaux articles dans vos sujets favoris : Technologie, IA",
    timestamp: "2024-09-28T09:30:00Z",
    read: false,
    priority: "medium"
  },
  {
    id: "2",
    type: "admin",
    title: "Bienvenue sur MIMO Flux !",
    content: "Découvrez comment personnaliser votre flux pour une expérience optimale. Explorez les paramètres dans votre profil.",
    timestamp: "2024-09-27T14:00:00Z",
    read: true,
    priority: "high"
  },
  {
    id: "3",
    type: "notification",
    title: "Votre article favori a été mis à jour",
    content: "L'article 'IA révolutionne le quotidien' a été enrichi avec de nouvelles informations.",
    timestamp: "2024-09-27T10:15:00Z",
    read: true,
    priority: "low"
  }
];

const Messages = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const unreadCount = messages.filter(msg => !msg.read).length;
  const notifications = messages.filter(msg => msg.type === 'notification');
  const adminMessages = messages.filter(msg => msg.type === 'admin');

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      default: return 'secondary';
    }
  };

  const MessageCard = ({ message }: { message: Message }) => (
    <Card className={`mb-3 transition-all ${!message.read ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {message.type === 'admin' ? (
              <MessageSquare size={16} className="text-primary mt-0.5" />
            ) : (
              <Bell size={16} className="text-muted-foreground mt-0.5" />
            )}
            <CardTitle className="text-sm font-medium">{message.title}</CardTitle>
            {!message.read && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteMessage(message.id)}
            className="text-muted-foreground hover:text-destructive p-1"
          >
            <Trash2 size={14} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.priority && (
            <Badge variant={getPriorityColor(message.priority) as any} className="text-xs">
              {message.priority}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">{message.content}</p>
        {!message.read && (
          <Button
            variant="link"
            size="sm"
            onClick={() => markAsRead(message.id)}
            className="p-0 h-auto mt-2 text-primary"
          >
            Marquer comme lu
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="px-2 py-1">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Tous ({messages.length})
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="admin">
              Messages ({adminMessages.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="skeleton w-4 h-4 rounded" />
                        <div className="skeleton h-4 w-2/3 rounded" />
                      </div>
                      <div className="skeleton w-8 h-8 rounded" />
                    </div>
                    <div className="skeleton h-3 w-1/3 rounded mb-2" />
                    <div className="skeleton h-3 w-full rounded" />
                  </Card>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun message</h3>
                <p className="text-muted-foreground">
                  Vos notifications et messages apparaîtront ici.
                </p>
              </div>
            ) : (
              messages.map(message => (
                <MessageCard key={message.id} message={message} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Card key={i} className="p-4">
                    <div className="skeleton h-4 w-2/3 rounded mb-2" />
                    <div className="skeleton h-3 w-full rounded" />
                  </Card>
                ))}
              </div>
            ) : (
              notifications.map(message => (
                <MessageCard key={message.id} message={message} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="admin" className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Card key={i} className="p-4">
                    <div className="skeleton h-4 w-2/3 rounded mb-2" />
                    <div className="skeleton h-3 w-full rounded" />
                  </Card>
                ))}
              </div>
            ) : (
              adminMessages.map(message => (
                <MessageCard key={message.id} message={message} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Messages;