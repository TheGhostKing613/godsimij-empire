import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addTwinReaction, getTwinPostReactions, getUserTwinReaction } from '@/api/twin-reactions';
import { useAuth } from '@/contexts/AuthContext';
import { ReactionType } from '@/config/reactions';

export const useTwinPostReactions = (twinPostId: string) => {
  return useQuery({
    queryKey: ['twin-reactions', twinPostId],
    queryFn: () => getTwinPostReactions(twinPostId),
  });
};

export const useUserTwinReaction = (twinPostId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-twin-reaction', twinPostId, user?.id],
    queryFn: () => user ? getUserTwinReaction(user.id, twinPostId) : null,
    enabled: !!user,
  });
};

export const useReactToTwinPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ twinPostId, reactionType }: { twinPostId: string; reactionType: ReactionType }) => {
      if (!user) throw new Error('Must be logged in to react');
      return addTwinReaction(user.id, twinPostId, reactionType);
    },
    onSuccess: async (_, { twinPostId }) => {
      queryClient.invalidateQueries({ queryKey: ['twin-reactions', twinPostId] });
      queryClient.invalidateQueries({ queryKey: ['user-twin-reaction', twinPostId] });
      queryClient.invalidateQueries({ queryKey: ['twin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['unified-feed'] });
    },
  });
};
