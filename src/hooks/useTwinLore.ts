import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTwinLore = (twinId?: string) => {
  const { data: loreEntries, isLoading, error } = useQuery({
    queryKey: ['twin-lore', twinId],
    queryFn: async () => {
      if (!twinId) return [];
      
      const { data, error } = await supabase
        .from('twin_lore')
        .select('*')
        .eq('twin_id', twinId)
        .order('level', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!twinId
  });

  return {
    loreEntries,
    isLoading,
    error
  };
};