import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTwinPosts = () => {
  return useQuery({
    queryKey: ['twin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('twin_posts')
        .select(`
          *,
          twins:twin_id (
            id,
            twin_username,
            personality,
            user_id,
            profiles:user_id (
              avatar_url,
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });
};

export const useUserTwinPosts = (userId?: string) => {
  return useQuery({
    queryKey: ['twin-posts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: twins } = await supabase
        .from('twins')
        .select('id')
        .eq('user_id', userId);
      
      if (!twins || twins.length === 0) return [];
      
      const twinIds = twins.map(t => t.id);
      
      const { data, error } = await supabase
        .from('twin_posts')
        .select(`
          *,
          twins:twin_id (
            id,
            twin_username,
            personality
          )
        `)
        .in('twin_id', twinIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });
};