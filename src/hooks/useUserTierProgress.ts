import { useQuery } from '@tanstack/react-query';
import { getUserTierProgress } from '@/api/profiles';
import { useAuth } from '@/contexts/AuthContext';

export const useUserTierProgress = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['tier-progress', user?.id],
    queryFn: () => user ? getUserTierProgress(user.id) : null,
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
