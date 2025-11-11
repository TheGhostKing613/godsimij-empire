import { supabase } from '@/integrations/supabase/client';

export interface CreatePostData {
  content: string;
  post_type: 'discussion' | 'question' | 'announcement' | 'idea';
  visibility: 'public' | 'followers' | 'private';
  category_id?: string;
  media_urls?: string[];
  is_anonymous?: boolean;
  display_name?: string;
}

export const createPost = async (userId: string, data: CreatePostData) => {
  // Validate content length
  const trimmedContent = data.content.trim();
  
  if (!trimmedContent) {
    throw new Error('Post content cannot be empty');
  }
  
  if (trimmedContent.length > 10000) {
    throw new Error('Post content must be less than 10,000 characters');
  }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      ...data,
      content: trimmedContent,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        tier
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
        avatar_url,
        tier
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
        avatar_url,
        tier
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
        avatar_url,
        tier
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

export const checkAnonymousPostLimit = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('anonymous_post_limits')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  if (error) throw error;
  return (data?.length || 0) < 3;
};

export const getPostsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        tier
      ),
      categories (
        id,
        name,
        slug,
        icon,
        color
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getLikedPostsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('post_likes')
    .select(`
      post_id,
      posts (
        *,
        profiles:user_id (
          id,
          full_name,
          avatar_url,
          tier
        ),
        categories (
          id,
          name,
          slug,
          icon,
          color
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(like => like.posts).filter(Boolean);
};

export const getTrendingCategories = async (limit = 5) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('posts')
    .select('category_id, categories(id, name, icon, color, slug)')
    .gte('created_at', sevenDaysAgo)
    .not('category_id', 'is', null);
  
  if (error) throw error;
  
  // Count posts per category
  const categoryCounts = data.reduce((acc: any, post: any) => {
    const catId = post.category_id;
    if (!acc[catId] && post.categories) {
      acc[catId] = { ...post.categories, count: 0 };
    }
    if (acc[catId]) {
      acc[catId].count++;
    }
    return acc;
  }, {});
  
  return Object.values(categoryCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, limit);
};
