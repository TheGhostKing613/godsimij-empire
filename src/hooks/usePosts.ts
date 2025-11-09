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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });
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
