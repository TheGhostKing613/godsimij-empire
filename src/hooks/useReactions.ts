import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addReaction, getPostReactions, getUserReaction } from '@/api/reactions';
import { useAuth } from '@/contexts/AuthContext';
import { ReactionType } from '@/config/reactions';

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
    mutationFn: ({ postId, reactionType }: { postId: string; reactionType: ReactionType }) => {
      if (!user) throw new Error('Must be logged in to react');
      return addReaction(user.id, postId, reactionType);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['reactions', postId] });
      queryClient.invalidateQueries({ queryKey: ['user-reaction', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
