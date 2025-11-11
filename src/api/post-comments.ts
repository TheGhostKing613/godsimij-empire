import { supabase } from '@/integrations/supabase/client';
import { PostComment } from '@/types';

export const getPostComments = async (postId: string): Promise<PostComment[]> => {
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        tier
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as PostComment[];
};

export const createPostComment = async (postId: string, userId: string, content: string) => {
  // Validate comment content
  const trimmedContent = content.trim();
  
  if (!trimmedContent) {
    throw new Error('Comment cannot be empty');
  }
  
  if (trimmedContent.length > 2000) {
    throw new Error('Comment must be less than 2,000 characters');
  }

  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content: trimmedContent,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        tier
      )
    `)
    .single();

  if (error) throw error;
  return data as PostComment;
};

export const updatePostComment = async (commentId: string, content: string) => {
  // Validate comment content
  const trimmedContent = content.trim();
  
  if (!trimmedContent) {
    throw new Error('Comment cannot be empty');
  }
  
  if (trimmedContent.length > 2000) {
    throw new Error('Comment must be less than 2,000 characters');
  }

  const { data, error } = await supabase
    .from('post_comments')
    .update({
      content: trimmedContent,
      is_edited: true,
    })
    .eq('id', commentId)
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        tier
      )
    `)
    .single();

  if (error) throw error;
  return data as PostComment;
};

export const deletePostComment = async (commentId: string) => {
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};
