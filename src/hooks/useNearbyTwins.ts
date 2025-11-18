import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNearbyTwins = (currentUserId?: string) => {
  const { data: nearbyTwins, isLoading, error } = useQuery({
    queryKey: ['nearby-twins', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      
      // Fetch recently active twins (posted in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('twin_posts')
        .select(`
          twin_id,
          created_at,
          twins:twin_id (
            id,
            twin_username,
            level,
            alignment,
            active,
            user_id,
            current_state,
            profiles:user_id (
              avatar_url
            )
          )
        `)
        .gte('created_at', oneHourAgo)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Deduplicate by twin_id and exclude current user's twin
      const uniqueTwins = Array.from(
        new Map(data?.map(item => [item.twins?.id, item])).values()
      ).filter(item => item.twins && item.twins.user_id !== currentUserId);
      
      return uniqueTwins.map(item => item.twins).slice(0, 8);
    },
    enabled: !!currentUserId
  });

  return {
    nearbyTwins,
    isLoading,
    error
  };
};