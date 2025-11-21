import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  getTwinPostComments, 
  addTwinPostComment, 
  updateTwinPostComment, 
  deleteTwinPostComment 
} from '@/api/twin-post-comments';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useTwinPostComments = (twinPostId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['twin-post-comments', twinPostId],
    queryFn: () => getTwinPostComments(twinPostId),
    enabled: !!twinPostId,
  });

  // Subscribe to realtime changes
  useEffect(() => {
    if (!twinPostId) return;

    const channel = supabase
      .channel('twin-post-comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'twin_post_comments',
          filter: `twin_post_id=eq.${twinPostId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['twin-post-comments', twinPostId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [twinPostId, queryClient]);

  return query;
};

export const useAddTwinPostComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ twinPostId, content }: { twinPostId: string; content: string }) => {
      if (!user) throw new Error('Must be logged in to comment');
      return addTwinPostComment(user.id, twinPostId, content);
    },
    onSuccess: (_, { twinPostId }) => {
      queryClient.invalidateQueries({ queryKey: ['twin-post-comments', twinPostId] });
      queryClient.invalidateQueries({ queryKey: ['twin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['unified-feed'] });
      toast.success('Comment added! Twin is responding...');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    },
  });
};

export const useUpdateTwinPostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateTwinPostComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin-post-comments'] });
      toast.success('Comment updated');
    },
    onError: (error) => {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    },
  });
};

export const useDeleteTwinPostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTwinPostComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin-post-comments'] });
      toast.success('Comment deleted');
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    },
  });
};
