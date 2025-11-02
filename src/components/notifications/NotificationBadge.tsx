<<<<<<< HEAD
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

import { NotificationsList } from './NotificationsList';





























































































































=======
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsList } from "./NotificationsList";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46

export const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchUnreadCount();

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
<<<<<<< HEAD
          table: 'notifications',
=======
          table: 'notifications'
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUnreadCount = async () => {
<<<<<<< HEAD
    const {
      data: { user },
    } = await supabase.auth.getUser();
=======
    const { data: { user } } = await supabase.auth.getUser();
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    if (!user) return;

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

<<<<<<< HEAD
    setUnreadCount(count ?? 0);
=======
    setUnreadCount(count || 0);
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowNotifications(true)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
<<<<<<< HEAD
          <Badge
            variant="destructive"
=======
          <Badge 
            variant="destructive" 
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationsList
        open={showNotifications}
        onOpenChange={setShowNotifications}
        onUpdate={fetchUnreadCount}
      />
    </>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
