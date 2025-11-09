import { formatDistanceToNow } from 'date-fns';
import { Bell, Heart, MessageCircle, UserPlus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import type { Notification } from '@/api/notifications';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'follow':
      return <UserPlus className="w-5 h-5 text-primary" />;
    case 'like':
      return <Heart className="w-5 h-5 text-destructive" />;
    case 'comment':
      return <MessageCircle className="w-5 h-5 text-primary" />;
    default:
      return <Bell className="w-5 h-5" />;
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
    return `/feed`;
  }
  return '/feed';
};

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No notifications yet</p>
              <p className="text-sm">
                When someone follows you, likes your posts, or comments, you'll see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={getNotificationLink(notification)}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors',
                      !notification.is_read && 'bg-muted/30'
                    )}
                  >
                    {/* User Avatar */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={notification.related_user?.avatar_url || undefined} />
                      <AvatarFallback>
                        {notification.related_user?.full_name?.[0] ||
                          notification.related_user?.email[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        {getNotificationIcon(notification.type)}
                        <p className="text-sm font-medium">
                          {getNotificationText(notification)}
                        </p>
                      </div>
                      
                      {notification.related_post?.content && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 pl-7">
                          "{notification.related_post.content}"
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2 pl-7">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
