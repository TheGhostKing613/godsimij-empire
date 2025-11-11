import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    tier: string;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants: {
    id: string;
    user_id: string;
    last_read_at: string;
    profiles: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      tier: string;
    };
  }[];
  last_message?: Message;
  unread_count?: number;
}

export const checkConversationRateLimit = async (userId: string): Promise<boolean> => {
  // Check if user has created more than 10 conversations in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('conversation_rate_limits')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', oneHourAgo);
  
  if (error) throw error;
  return (data?.length || 0) < 10;
};

export const getOrCreateConversation = async (currentUserId: string, otherUserId: string) => {
  // Check rate limit
  const canCreate = await checkConversationRateLimit(currentUserId);
  if (!canCreate) {
    throw new Error('Too many conversations created. Please try again later.');
  }

  const { data, error } = await supabase.rpc('get_or_create_conversation', {
    user1_id: currentUserId,
    user2_id: otherUserId,
  });

  if (error) throw error;

  // Log the rate limit
  await supabase
    .from('conversation_rate_limits')
    .insert({ user_id: currentUserId });

  return data as string;
};

export const getUserConversations = async (userId: string) => {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants(
        id,
        user_id,
        last_read_at,
        profiles(id, full_name, avatar_url, tier)
      )
    `)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Get last message and unread count for each conversation
  const conversationsWithDetails = await Promise.all(
    (conversations || []).map(async (conv) => {
      // Get last message
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, tier)')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get unread count
      const participant = conv.participants.find((p: any) => p.user_id === userId);
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .neq('sender_id', userId)
        .gt('created_at', participant?.last_read_at || '1970-01-01');

      return {
        ...conv,
        last_message: lastMessage as Message,
        unread_count: count || 0,
      };
    })
  );

  return conversationsWithDetails as Conversation[];
};

export const getConversationMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, tier)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
};

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
  const trimmedContent = content.trim();
  
  if (!trimmedContent) {
    throw new Error('Message cannot be empty');
  }
  
  if (trimmedContent.length > 2000) {
    throw new Error('Message must be less than 2000 characters');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: trimmedContent,
    })
    .select('*, sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, tier)')
    .single();

  if (error) throw error;
  return data as Message;
};

export const markConversationAsRead = async (conversationId: string, userId: string) => {
  const { error } = await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);

  if (error) throw error;
};

export const deleteMessage = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
};
