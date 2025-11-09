import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/api/posts';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};
