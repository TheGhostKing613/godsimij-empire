import { supabase } from '@/integrations/supabase/client';

export interface ProfileUpdateData {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  github_handle?: string;
  interests?: string[];
}

export const getProfileByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, tier, tier_awarded_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, data: ProfileUpdateData) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return profile;
};

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const uploadCoverImage = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/cover-${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const followUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('user_connections')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) throw error;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from('user_connections')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) throw error;
};

export const checkIfFollowing = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from('user_connections')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

export const getFollowers = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_connections')
    .select(`
      follower_id,
      profiles!user_connections_follower_id_fkey(
        id,
        full_name,
        email,
        avatar_url,
        tier
      )
    `)
    .eq('following_id', userId);

  if (error) throw error;
  return data;
};

export const getFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_connections')
    .select(`
      following_id,
      profiles!user_connections_following_id_fkey(
        id,
        full_name,
        email,
        avatar_url,
        tier
      )
    `)
    .eq('follower_id', userId);

  if (error) throw error;
  return data;
};

export const getSuggestedUsers = async (currentUserId?: string, limit = 5) => {
  let query = supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, tier, follower_count')
    .order('follower_count', { ascending: false })
    .limit(limit * 2); // Get more to filter out following
  
  if (currentUserId) {
    query = query.neq('id', currentUserId);
  }
  
  const { data: profiles, error } = await query;
  if (error) throw error;
  
  if (!currentUserId) {
    return profiles?.slice(0, limit) || [];
  }
  
  // Get users already following
  const { data: following } = await supabase
    .from('user_connections')
    .select('following_id')
    .eq('follower_id', currentUserId);
  
  const followingIds = following?.map(f => f.following_id) || [];
  
  // Filter out already following
  const filtered = profiles?.filter(p => !followingIds.includes(p.id)) || [];
  return filtered.slice(0, limit);
};

export const getUserTierProgress = async (userId: string) => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('tier, post_count')
    .eq('id', userId)
    .single();
  
  if (profileError) throw profileError;
  
  // Get reactions received count
  const { data: posts } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', userId);
  
  const postIds = posts?.map(p => p.id) || [];
  
  let reactionsCount = 0;
  if (postIds.length > 0) {
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .in('post_id', postIds);
    
    reactionsCount = count || 0;
  }
  
  const progress = {
    currentTier: profile.tier,
    posts: profile.post_count,
    postsNeeded: 10,
    reactions: reactionsCount,
    reactionsNeeded: 50,
    percentComplete: Math.min(
      ((profile.post_count / 10) + (reactionsCount / 50)) / 2 * 100,
      100
    ),
  };
  
  return progress;
};
