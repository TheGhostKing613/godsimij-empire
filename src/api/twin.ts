import { supabase } from '@/integrations/supabase/client';

export const getTwinByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('twins')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createTwin = async (userId: string, username: string, seedContent?: string) => {
  const { data, error } = await supabase.functions.invoke('create-twin', {
    body: { userId, username, seedContent }
  });

  if (error) throw error;
  return data;
};

export const updateTwinActive = async (twinId: string, active: boolean) => {
  const { error } = await supabase
    .from('twins')
    .update({ active })
    .eq('id', twinId);

  if (error) throw error;
};

export const getTwinPosts = async (limit = 50) => {
  const { data, error } = await supabase
    .from('twin_posts')
    .select(`
      *,
      twins:twin_id (
        id,
        twin_username,
        personality,
        user_id,
        profiles:user_id (
          avatar_url,
          full_name
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
};