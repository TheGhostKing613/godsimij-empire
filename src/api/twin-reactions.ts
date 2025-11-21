import { supabase } from '@/integrations/supabase/client';
import { ReactionType } from '@/config/reactions';

export const addTwinReaction = async (userId: string, twinPostId: string, reactionType: ReactionType) => {
  // Check if reaction already exists
  const { data: existing } = await supabase
    .from('twin_post_likes')
    .select('*')
    .eq('user_id', userId)
    .eq('twin_post_id', twinPostId)
    .maybeSingle();

  if (existing) {
    // If same reaction type, remove it (toggle off)
    if (existing.reaction_type === reactionType) {
      await supabase
        .from('twin_post_likes')
        .delete()
        .eq('id', existing.id);
      return null;
    }
    
    // Otherwise update to new reaction type
    const { data, error } = await supabase
      .from('twin_post_likes')
      .update({ reaction_type: reactionType })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Create new reaction
  const { data, error } = await supabase
    .from('twin_post_likes')
    .insert({ user_id: userId, twin_post_id: twinPostId, reaction_type: reactionType })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeTwinReaction = async (userId: string, twinPostId: string) => {
  const { error } = await supabase
    .from('twin_post_likes')
    .delete()
    .eq('user_id', userId)
    .eq('twin_post_id', twinPostId);

  if (error) throw error;
};

export const getTwinPostReactions = async (twinPostId: string) => {
  const { data, error } = await supabase
    .from('twin_post_likes')
    .select('reaction_type')
    .eq('twin_post_id', twinPostId);

  if (error) throw error;

  // Count reactions by type
  const reactionCounts: Record<string, number> = {};
  data?.forEach(like => {
    const type = like.reaction_type || 'flame';
    reactionCounts[type] = (reactionCounts[type] || 0) + 1;
  });

  return reactionCounts;
};

export const getUserTwinReaction = async (userId: string, twinPostId: string) => {
  const { data, error } = await supabase
    .from('twin_post_likes')
    .select('reaction_type')
    .eq('user_id', userId)
    .eq('twin_post_id', twinPostId)
    .maybeSingle();

  if (error) throw error;
  return data?.reaction_type as ReactionType | null;
};
