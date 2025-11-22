import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Notification } from "@/hooks/useNotifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquare, Heart, Info } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const isRead = !!notification.read_at;

  const getIcon = () => {
    switch (notification.type) {
      case "reply":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMessage = () => {
    const actorName = notification.actor?.display_name || "Un utilisateur";
    switch (notification.type) {
      case "reply":
        return (
          <span>
            <span className="font-semibold">{actorName}</span> a répondu à votre commentaire
          </span>
        );
      case "like":
        return (
          <span>
            <span className="font-semibold">{actorName}</span> a aimé votre commentaire
          </span>
        );
      default:
        return "Nouvelle notification système";
    }
  };

  const getLink = () => {
    if (notification.resource_type === "article") {
      return `/article/${notification.resource_id}`;
    }
    // For comments, we link to the article but ideally we'd anchor to the comment
    // Since we don't have the article ID directly in the notification resource_id for comments (it's the comment ID usually, but our trigger stores article_id in resource_id for simplicity in this MVP)
    // Wait, let's check the SQL trigger.
    // The trigger stores: resource_id = NEW.article_id (for replies) and c.article_id (for likes).
    // So resource_id IS the article ID. Perfect.
    return `/article/${notification.resource_id}`;
  };

  return (
    <Link
      to={getLink()}
      onClick={() => onRead(notification.id)}
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors border-b last:border-0",
        !isRead && "bg-blue-50/50 dark:bg-blue-900/10"
      )}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={notification.actor?.avatar_url || ""} />
          <AvatarFallback>{notification.actor?.display_name?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
          {getIcon()}
        </div>
      </div>
      
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-none text-foreground">
          {getMessage()}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
        </p>
      </div>
      
      {!isRead && (
        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
      )}
    </Link>
  );
};
