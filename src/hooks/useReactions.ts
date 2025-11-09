import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addReaction, getPostReactions, getUserReaction } from '@/api/reactions';
import { createNotification } from '@/api/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { ReactionType } from '@/config/reactions';
import { supabase } from '@/integrations/supabase/client';

export const usePostReactions = (postId: string) => {
  return useQuery({
    queryKey: ['reactions', postId],
    queryFn: () => getPostReactions(postId),
  });
};

export const useUserReaction = (postId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-reaction', postId, user?.id],
    queryFn: () => user ? getUserReaction(user.id, postId) : null,
    enabled: !!user,
  });
};

export const useReactToPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ postId, reactionType }: { postId: string; reactionType: ReactionType }) => {
      if (!user) throw new Error('Must be logged in to react');
      return addReaction(user.id, postId, reactionType);
    },
    onSuccess: async (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['reactions', postId] });
      queryClient.invalidateQueries({ queryKey: ['user-reaction', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Create notification for post owner
      if (user) {
        try {
          // Get the post owner's user_id
          const { data: post } = await supabase
            .from('posts')
            .select('user_id')
            .eq('id', postId)
            .single();
          
          // Don't notify if user liked their own post
          if (post && post.user_id !== user.id) {
            await createNotification({
              user_id: post.user_id,
              type: 'like',
              related_user_id: user.id,
              related_post_id: postId,
            });
          }
        } catch (error) {
          console.error('Failed to create notification:', error);
        }
      }
    },
  });
};
