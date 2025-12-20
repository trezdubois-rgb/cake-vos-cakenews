import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Notification } from "@/hooks/useNotifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquare, Heart, Info } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const isRead = notification.read;

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

  const getLink = () => {
    if (notification.link_url) return notification.link_url;
    if (notification.related_article_id) return `/article/${notification.related_article_id}`;
    return "/";
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
          <AvatarFallback>{notification.title?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
          {getIcon()}
        </div>
      </div>
      
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none text-foreground">
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {notification.message}
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