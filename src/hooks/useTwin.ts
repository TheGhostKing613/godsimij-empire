import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTwin = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: twin, isLoading, error } = useQuery({
    queryKey: ['twin', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('twins')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const createTwin = useMutation({
    mutationFn: async ({ username, seedContent }: { username: string; seedContent?: string }) => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase.functions.invoke('create-twin', {
        body: { userId, username, seedContent }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin', userId] });
      toast.success('Mirror Twin awakened! 🔥');
    },
    onError: (error) => {
      console.error('Failed to create twin:', error);
      toast.error('Failed to awaken twin');
    }
  });

  const toggleTwinActive = useMutation({
    mutationFn: async (active: boolean) => {
      if (!twin?.id) throw new Error('No twin found');
      
      const { error } = await supabase
        .from('twins')
        .update({ active })
        .eq('id', twin.id);

      if (error) throw error;
      return active;
    },
    onSuccess: (active) => {
      queryClient.invalidateQueries({ queryKey: ['twin', userId] });
      toast.success(active ? 'Twin activated! 🔥' : 'Twin deactivated');
    },
    onError: (error) => {
      console.error('Failed to toggle twin:', error);
      toast.error('Failed to update twin status');
    }
  });

  const generateTwinPost = useMutation({
    mutationFn: async (context?: string) => {
      if (!twin?.id) throw new Error('No twin found');
      
      const { data, error } = await supabase.functions.invoke('generate-twin-post', {
        body: { twinId: twin.id, context }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Twin posted! 🔥');
    },
    onError: (error) => {
      console.error('Failed to generate twin post:', error);
      toast.error('Failed to generate post');
    }
  });

  return {
    twin,
    isLoading,
    error,
    createTwin,
    toggleTwinActive,
    generateTwinPost
  };
};