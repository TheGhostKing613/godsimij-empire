import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['search', 'posts', query],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            avatar_url,
            tier
          ),
          categories (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('visibility', 'public')
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: query.trim().length > 0,
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['search', 'users', query],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, bio, tier, follower_count, post_count')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: query.trim().length > 0,
  });
};

export const useSearchCategories = (query: string) => {
  return useQuery({
    queryKey: ['search', 'categories', query],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('post_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: query.trim().length > 0,
  });
};
