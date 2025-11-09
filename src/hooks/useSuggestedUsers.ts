import { useQuery } from '@tanstack/react-query';
import { getSuggestedUsers } from '@/api/profiles';
import { useAuth } from '@/contexts/AuthContext';

export const useSuggestedUsers = (limit = 5) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['users', 'suggested', user?.id, limit],
    queryFn: () => getSuggestedUsers(user?.id, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
