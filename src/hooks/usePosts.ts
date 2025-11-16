import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createPost, 
  getFeedPosts, 
  getFollowingFeedPosts, 
  getPostsByCategory, 
  getPostsByUser,
  getLikedPostsByUser,
  getTrendingCategories,
  CreatePostData 
} from '@/api/posts';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useFeedPosts = (feedType: 'discover' | 'following' = 'discover') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['posts', feedType, user?.id],
    queryFn: () => {
      if (feedType === 'following' && user?.id) {
        return getFollowingFeedPosts(user.id);
      }
      return getFeedPosts(user?.id);
    },
  });
};

export const useCategoryPosts = (categoryId: string) => {
  return useQuery({
    queryKey: ['posts', 'category', categoryId],
    queryFn: () => getPostsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => getPostsByUser(userId),
    enabled: !!userId,
  });
};

export const useUserLikedPosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', 'liked', userId],
    queryFn: () => getLikedPostsByUser(userId),
    enabled: !!userId,
  });
};

export const useTrendingCategories = (limit = 5) => {
  return useQuery({
    queryKey: ['categories', 'trending', limit],
    queryFn: () => getTrendingCategories(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: CreatePostData) => {
      if (!user?.id) throw new Error('User not authenticated');
      return createPost(user.id, data);
    },
    onSuccess: async (post, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });

      // Check if user has a twin, if not create one
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data: existingTwin } = await supabase
          .from('twins')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingTwin) {
          // Create twin on first post
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          await supabase.functions.invoke('create-twin', {
            body: {
              userId: user.id,
              username: profile?.full_name?.replace(/\s+/g, '_').toLowerCase() || 'user',
              seedContent: variables.content
            }
          });

          toast({
            title: 'Mirror Twin Awakened! 🔥',
            description: 'Your AI reflection has been born from your first post.',
          });
        }
      } catch (error) {
        console.warn('Twin creation failed:', error);
      }

      // Trigger AI comment generation asynchronously (non-blocking)
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase.functions.invoke('generate-post-comment', {
          body: {
            postId: post.id,
            postContent: variables.content,
            postType: variables.post_type,
            categoryName: post.categories?.name,
            userId: post.user_id,
          },
        });

        if (!error) {
          toast({
            title: 'AI Assistant',
            description: 'AURA-BREE commented on your post!',
          });
          // Refresh comments after AI generates one
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      } catch (error) {
        // Silently handle AI comment errors - don't disrupt user experience
        console.warn('AI comment generation failed:', error);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create post: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};
