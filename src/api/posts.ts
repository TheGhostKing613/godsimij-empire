import { supabase } from '@/integrations/supabase/client';

export interface CreatePostData {
  content: string;
  post_type: 'discussion' | 'question' | 'announcement' | 'idea';
  visibility: 'public' | 'followers' | 'private';
  category_id?: string;
  media_urls?: string[];
}

export const createPost = async (userId: string, data: CreatePostData) => {
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      ...data,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        avatar_url
      ),
      categories (
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .single();

  if (error) throw error;
  return post;
};

export const getFeedPosts = async (userId?: string) => {
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        avatar_url
      ),
      categories (
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(50);

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const getFollowingFeedPosts = async (userId: string) => {
  // Get list of users the current user follows
  const { data: connections, error: connectionsError } = await supabase
    .from('user_connections')
    .select('following_id')
    .eq('follower_id', userId);

  if (connectionsError) throw connectionsError;

  const followingIds = connections?.map(c => c.following_id) || [];

  if (followingIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        avatar_url
      ),
      categories (
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .in('user_id', followingIds)
    .in('visibility', ['public', 'followers'])
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

export const getPostsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        avatar_url
      ),
      categories (
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .eq('category_id', categoryId)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};
