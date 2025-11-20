import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTwinRecognition = (currentTwinId?: string, visibleTwinIds?: string[]) => {
  const queryClient = useQueryClient();

  // Fetch existing relations for the current twin
  const { data: relations } = useQuery({
    queryKey: ['twin-relations', currentTwinId],
    queryFn: async () => {
      if (!currentTwinId) return [];
      
      const { data, error } = await supabase
        .from('twin_relations')
        .select('*')
        .eq('twin_id', currentTwinId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentTwinId,
  });

  // Recognize twin mutation
  const recognizeTwin = useMutation({
    mutationFn: async ({ twinId, targetTwinId }: { twinId: string; targetTwinId: string }) => {
      const { data, error } = await supabase.functions.invoke('recognize-twin', {
        body: { twinId, targetTwinId },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin-relations'] });
    },
  });

  // Auto-recognize nearby twins
  useEffect(() => {
    if (!currentTwinId || !visibleTwinIds || visibleTwinIds.length === 0) return;

    const recognizeNearbyTwins = async () => {
      // Check which twins haven't been recognized yet
      const unrecognizedTwinIds = visibleTwinIds.filter(
        id => id !== currentTwinId && !relations?.some(r => r.target_twin_id === id)
      );

      // Recognize each new twin (throttled to avoid spam)
      for (const targetTwinId of unrecognizedTwinIds.slice(0, 3)) {
        try {
          await recognizeTwin.mutateAsync({ twinId: currentTwinId, targetTwinId });
        } catch (error) {
          console.warn('Twin recognition failed:', error);
        }
      }
    };

    recognizeNearbyTwins();
  }, [currentTwinId, visibleTwinIds?.join(',')]);

  return {
    relations,
    recognizeTwin: recognizeTwin.mutate,
  };
};

export const useGetTwinRelation = (twinId?: string, targetTwinId?: string) => {
  return useQuery({
    queryKey: ['twin-relation', twinId, targetTwinId],
    queryFn: async () => {
      if (!twinId || !targetTwinId) return null;
      
      const { data, error } = await supabase
        .from('twin_relations')
        .select('*')
        .eq('twin_id', twinId)
        .eq('target_twin_id', targetTwinId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!twinId && !!targetTwinId,
  });
};
