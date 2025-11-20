import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export type FeedItem = {
  id: string;
  content: string;
  created_at: string;
  type: 'post' | 'twin_post';
  likes_count: number;
  comments_count: number;
  user_id?: string;
  twin_id?: string;
  post_type?: string;
  visibility?: string;
  category_id?: string;
  is_anonymous?: boolean;
  display_name?: string;
  media_urls?: string[];
  profiles?: any;
  categories?: any;
  twins?: any;
};

export const useUnifiedFeed = (feedType: 'discover' | 'following' = 'discover', userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['unified-feed', feedType, userId],
    queryFn: async () => {
      // Fetch regular posts
      let postsQuery = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            tier
          ),
          categories:category_id (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(25);

      if (feedType === 'following' && userId) {
        const { data: following } = await supabase
          .from('user_connections')
          .select('following_id')
          .eq('follower_id', userId);
        
        const followingIds = following?.map(f => f.following_id) || [];
        if (followingIds.length === 0) {
          postsQuery = postsQuery.in('user_id', ['00000000-0000-0000-0000-000000000000']); // No results
        } else {
          postsQuery = postsQuery.in('user_id', followingIds);
        }
      }

      const { data: posts, error: postsError } = await postsQuery;
      if (postsError) throw postsError;

      // Fetch twin posts (always public)
      const { data: twinPosts, error: twinPostsError } = await supabase
        .from('twin_posts')
        .select(`
          *,
          twins:twin_id (
            id,
            twin_username,
            personality,
            user_id,
            level,
            alignment,
            tone,
            current_state,
            traits,
            profiles:user_id (
              id,
              avatar_url,
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(25);

      if (twinPostsError) throw twinPostsError;

      // Merge and sort by created_at
      const regularFeedItems: FeedItem[] = (posts || []).map(p => ({
        ...p,
        type: 'post' as const,
      }));

      const twinFeedItems: FeedItem[] = (twinPosts || []).map(p => ({
        ...p,
        type: 'twin_post' as const,
      }));

      const merged = [...regularFeedItems, ...twinFeedItems].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return merged;
    },
  });

  // Setup realtime subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('unified-feed-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['unified-feed'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'twin_posts'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['unified-feed'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};
