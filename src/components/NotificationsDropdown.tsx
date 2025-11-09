import { formatDistanceToNow } from 'date-fns';
import { Bell, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import type { Notification } from '@/api/notifications';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'follow':
      return <UserPlus className="w-4 h-4 text-primary" />;
    case 'like':
      return <Heart className="w-4 h-4 text-destructive" />;
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-primary" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

const getNotificationText = (notification: Notification) => {
  const userName = notification.related_user?.full_name || 'Someone';
  
  switch (notification.type) {
    case 'follow':
      return `${userName} started following you`;
    case 'like':
      return `${userName} liked your post`;
    case 'comment':
      return `${userName} commented on your post`;
    default:
      return 'New notification';
  }
};

const getNotificationLink = (notification: Notification) => {
  if (notification.type === 'follow' && notification.related_user_id) {
    return `/profile/${notification.related_user_id}`;
  }
  if (notification.related_post_id) {
    return `/feed`; // Could be enhanced to link to specific post
  }
  return '/feed';
};

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-background z-50">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              className="h-auto py-1 px-2 text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  asChild
                  className={cn(
                    'px-4 py-3 cursor-pointer',
                    !notification.is_read && 'bg-muted/50'
                  )}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <Link to={getNotificationLink(notification)}>
                    <div className="flex items-start gap-3 w-full">
                      {/* User Avatar */}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.related_user?.avatar_url || undefined} />
                        <AvatarFallback>
                          {notification.related_user?.full_name?.[0] ||
                            notification.related_user?.email[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <p className="text-sm">
                              {getNotificationText(notification)}
                            </p>
                            {notification.related_post?.content && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                "{notification.related_post.content}"
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full" size="sm" asChild>
                <Link to="/notifications">View all notifications</Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
