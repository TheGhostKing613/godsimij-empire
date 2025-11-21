import { supabase } from '@/integrations/supabase/client';

export const getTwinPostComments = async (twinPostId: string) => {
  const { data, error } = await supabase
    .from('twin_post_comments')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        tier
      )
    `)
    .eq('twin_post_id', twinPostId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addTwinPostComment = async (
  userId: string,
  twinPostId: string,
  content: string
) => {
  const { data, error } = await supabase
    .from('twin_post_comments')
    .insert({
      user_id: userId,
      twin_post_id: twinPostId,
      content,
      is_ai_generated: false,
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

  // Trigger AI response from twin
  try {
    await supabase.functions.invoke('generate-twin-comment', {
      body: { twinPostId, userComment: content }
    });
  } catch (aiError) {
    console.error('Error generating twin response:', aiError);
    // Don't throw - user comment was saved successfully
  }

  return data;
};

export const updateTwinPostComment = async (commentId: string, content: string) => {
  const { data, error } = await supabase
    .from('twin_post_comments')
    .update({ content, is_edited: true, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTwinPostComment = async (commentId: string) => {
  const { error } = await supabase
    .from('twin_post_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};
