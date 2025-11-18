import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTwinQuests = (twinId?: string) => {
  const queryClient = useQueryClient();

  const { data: quests, isLoading, error } = useQuery({
    queryKey: ['twin-quests', twinId],
    queryFn: async () => {
      if (!twinId) return [];
      
      const { data, error } = await supabase
        .from('twin_quests')
        .select('*')
        .eq('twin_id', twinId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!twinId
  });

  const assignQuests = useMutation({
    mutationFn: async () => {
      if (!twinId) throw new Error('Twin ID required');
      
      const { data, error } = await supabase.functions.invoke('assign-daily-quests', {
        body: { twinId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin-quests', twinId] });
      toast.success('Daily quests assigned! 🔥');
    },
    onError: (error) => {
      console.error('Failed to assign quests:', error);
      toast.error('Failed to assign quests');
    }
  });

  const completeQuest = useMutation({
    mutationFn: async (questId: string) => {
      const { error } = await supabase
        .from('twin_quests')
        .update({ completed: true })
        .eq('id', questId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin-quests', twinId] });
      toast.success('Quest completed! +XP 🔥');
    },
    onError: (error) => {
      console.error('Failed to complete quest:', error);
      toast.error('Failed to complete quest');
    }
  });

  return {
    quests,
    isLoading,
    error,
    assignQuests,
    completeQuest
  };
};