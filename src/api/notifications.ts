import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  created_at: string;
  is_read: boolean;
  related_comment_id?: string;
  related_post_id?: string;
  related_user_id?: string;
  // Joined data
  related_user?: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    tier: string;
  };
  related_post?: {
    id: string;
    content: string;
  };
}

export const getNotifications = async (userId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      related_user:profiles!notifications_related_user_id_fkey(
        id,
        full_name,
        email,
        avatar_url,
        tier
      ),
      related_post:posts!notifications_related_post_id_fkey(
        id,
        content
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Notification[];
};

export const getUnreadCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
};

export const markAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const markAllAsRead = async (userId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
};

export const createNotification = async (data: {
  user_id: string;
  type: string;
  related_user_id?: string;
  related_post_id?: string;
  related_comment_id?: string;
}) => {
  const { error } = await supabase
    .from('notifications')
    .insert(data);

  if (error) throw error;
};
