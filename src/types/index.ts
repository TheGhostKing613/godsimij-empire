// Core type definitions for the GodsIMiJ Empire platform

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  cover_image_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  github_handle?: string;
  interests?: string[];
  badges?: string[];
  tier: 'wanderer' | 'witness' | 'scribe' | 'flamekeeper' | 'crown';
  tier_awarded_at?: string;
  follower_count: number;
  following_count: number;
  post_count: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: 'discussion' | 'question' | 'announcement' | 'idea';
  visibility: 'public' | 'followers' | 'private';
  category_id?: string;
  media_urls?: string[];
  is_anonymous: boolean;
  display_name?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  categories?: Category;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_ai_generated?: boolean;
  profiles?: Profile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  post_count: number;
  parent_category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'system';
  related_user_id?: string;
  related_post_id?: string;
  related_comment_id?: string;
  is_read: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  profiles?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface ReactionCounts {
  flame: number;
  rebel: number;
  insight: number;
  mindblown: number;
}

export type ReactionType = keyof ReactionCounts;

export interface UserReaction {
  id: string;
  user_id: string;
  post_id: string;
  reaction_type: ReactionType;
  created_at: string;
}
