import { supabase } from '@/integrations/supabase/client';
import { ReactionType } from '@/config/reactions';

export const addReaction = async (userId: string, postId: string, reactionType: ReactionType) => {
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id, reaction_type')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();
  
  if (existing) {
    if (existing.reaction_type === reactionType) {
      return removeReaction(userId, postId);
    } else {
      const { error } = await supabase
        .from('post_likes')
        .update({ reaction_type: reactionType })
        .eq('id', existing.id);
      
      if (error) throw error;
      return { action: 'updated', reactionType };
    }
  } else {
    const { error } = await supabase
      .from('post_likes')
      .insert({ user_id: userId, post_id: postId, reaction_type: reactionType });
    
    if (error) throw error;
    return { action: 'created', reactionType };
  }
};

export const removeReaction = async (userId: string, postId: string) => {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);
  
  if (error) throw error;
  return { action: 'removed' };
};

export const getPostReactions = async (postId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .select('reaction_type')
    .eq('post_id', postId);
  
  if (error) throw error;
  
  const counts: Record<ReactionType, number> = {
    flame: 0,
    rebel: 0,
    insight: 0,
    mindblown: 0,
  };
  
  data?.forEach(like => {
    const type = like.reaction_type as ReactionType;
    if (type in counts) {
      counts[type]++;
    }
  });
  
  return counts;
};

export const getUserReaction = async (userId: string, postId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .select('reaction_type')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .maybeSingle();
  
  if (error) return null;
  return data?.reaction_type as ReactionType | null;
};
