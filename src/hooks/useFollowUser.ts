import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser } from '@/api/profiles';
import { createNotification } from '@/api/notifications';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const followMutation = useMutation({
    mutationFn: (followingId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return followUser(user.id, followingId);
    },
    onSuccess: async (_, followingId) => {
      queryClient.invalidateQueries({ queryKey: ['profile', followingId] });
      queryClient.invalidateQueries({ queryKey: ['followStatus'] });
      queryClient.invalidateQueries({ queryKey: ['follow-status-all'] });
      queryClient.invalidateQueries({ queryKey: ['all-profiles'] });
      
      // Create notification for the followed user
      if (user?.id) {
        try {
          await createNotification({
            user_id: followingId,
            type: 'follow',
            related_user_id: user.id,
          });
        } catch (error) {
          console.error('Failed to create notification:', error);
        }
      }
      
      toast({
        title: 'Success',
        description: 'You are now following this user!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to follow user: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (followingId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return unfollowUser(user.id, followingId);
    },
    onSuccess: (_, followingId) => {
      queryClient.invalidateQueries({ queryKey: ['profile', followingId] });
      queryClient.invalidateQueries({ queryKey: ['followStatus'] });
      queryClient.invalidateQueries({ queryKey: ['follow-status-all'] });
      queryClient.invalidateQueries({ queryKey: ['all-profiles'] });
      toast({
        title: 'Success',
        description: 'You unfollowed this user.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to unfollow user: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    followUser: followMutation.mutate,
    unfollowUser: unfollowMutation.mutate,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  };
};
