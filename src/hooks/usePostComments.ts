import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createNotification } from '@/api/notifications';
import {
  getPostComments,
  createPostComment,
  updatePostComment,
  deletePostComment,
} from '@/api/post-comments';
import { useEffect } from 'react';

export const usePostComments = (postId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['post-comments', postId],
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });

  // Real-time subscription
  useEffect(() => {
    if (!postId) return;

    const channel = supabase
      .channel(`post-comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, queryClient]);

  return query;
};

export const useCreatePostComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content, postOwnerId }: { postId: string; content: string; postOwnerId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const comment = await createPostComment(postId, user.id, content);
      
      // Create notification for post owner if not commenting on own post
      if (postOwnerId && postOwnerId !== user.id) {
        await createNotification({
          user_id: postOwnerId,
          type: 'comment',
          related_user_id: user.id,
          related_post_id: postId,
          related_comment_id: comment.id,
        });
      }
      
      return comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Comment posted successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to post comment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updatePostComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments'] });
      toast({
        title: 'Success',
        description: 'Comment updated successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update comment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Comment deleted successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete comment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};
