import { useQuery } from '@tanstack/react-query';
import { getProfileByUserId, checkIfFollowing } from '@/api/profiles';
import { useAuth } from '@/contexts/AuthContext';

export const useUserProfile = (userId: string) => {
  const { user } = useAuth();

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfileByUserId(userId),
    enabled: !!userId,
  });

  const followStatusQuery = useQuery({
    queryKey: ['followStatus', user?.id, userId],
    queryFn: () => {
      if (!user?.id || user.id === userId) return false;
      return checkIfFollowing(user.id, userId);
    },
    enabled: !!user?.id && !!userId && user.id !== userId,
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    isFollowing: followStatusQuery.data ?? false,
    refetch: profileQuery.refetch,
  };
};
