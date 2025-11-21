export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      anonymous_post_limits: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_category_id: string | null
          post_count: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
          post_count?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
          post_count?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_hidden: boolean
          item_id: string
          item_type: string
          moderated_at: string | null
          moderated_by: string | null
          moderation_note: string | null
          status: string
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          item_id: string
          item_type: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_note?: string | null
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          item_id?: string
          item_type?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_note?: string | null
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_rate_limits: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      flame_rituals: {
        Row: {
          allegiance: string
          completed_at: string | null
          id: string
          response_text: string | null
          ritual_text: string
          user_id: string | null
        }
        Insert: {
          allegiance: string
          completed_at?: string | null
          id?: string
          response_text?: string | null
          ritual_text: string
          user_id?: string | null
        }
        Update: {
          allegiance?: string
          completed_at?: string | null
          id?: string
          response_text?: string | null
          ritual_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flame_rituals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          created_by: string | null
          date: string | null
          embed_url: string | null
          file_url: string | null
          id: string
          title: string
          type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          embed_url?: string | null
          file_url?: string | null
          id?: string
          title: string
          type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          embed_url?: string | null
          file_url?: string | null
          id?: string
          title?: string
          type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          related_comment_id: string | null
          related_post_id: string | null
          related_user_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_comment_id?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_comment_id?: string | null
          related_post_id?: string | null
          related_user_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_comment_id_fkey"
            columns: ["related_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_ai_generated: boolean
          is_edited: boolean | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_ai_generated?: boolean
          is_edited?: boolean | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_ai_generated?: boolean
          is_edited?: boolean | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          shared_to: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          shared_to?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          shared_to?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category_id: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          display_name: string | null
          id: string
          is_anonymous: boolean | null
          is_featured: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          media_urls: string[] | null
          post_type: string | null
          shares_count: number | null
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          category_id?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          post_type?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          category_id?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          media_urls?: string[] | null
          post_type?: string | null
          shares_count?: number | null
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          cover_image_url: string | null
          created_at: string | null
          email: string | null
          follower_count: number | null
          following_count: number | null
          full_name: string | null
          github_handle: string | null
          id: string
          interests: string[] | null
          location: string | null
          post_count: number | null
          tier: Database["public"]["Enums"]["user_tier"] | null
          tier_awarded_at: string | null
          twitter_handle: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          email?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          github_handle?: string | null
          id: string
          interests?: string[] | null
          location?: string | null
          post_count?: number | null
          tier?: Database["public"]["Enums"]["user_tier"] | null
          tier_awarded_at?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          email?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string | null
          github_handle?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          post_count?: number | null
          tier?: Database["public"]["Enums"]["user_tier"] | null
          tier_awarded_at?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          image_url: string | null
          link: string | null
          name: string
          status: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          image_url?: string | null
          link?: string | null
          name: string
          status?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          image_url?: string | null
          link?: string | null
          name?: string
          status?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      seasonal_events: {
        Row: {
          active: boolean | null
          effects: Json | null
          end_date: string
          id: string
          name: string
          start_date: string
        }
        Insert: {
          active?: boolean | null
          effects?: Json | null
          end_date: string
          id?: string
          name: string
          start_date: string
        }
        Update: {
          active?: boolean | null
          effects?: Json | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      twin_lore: {
        Row: {
          created_at: string | null
          id: string
          level: number
          lore_entry: string
          twin_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          lore_entry: string
          twin_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          lore_entry?: string
          twin_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "twin_lore_twin_id_fkey"
            columns: ["twin_id"]
            isOneToOne: false
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
        ]
      }
      twin_memories: {
        Row: {
          content: string
          created_at: string | null
          id: string
          twin_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          twin_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          twin_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "twin_memories_twin_id_fkey"
            columns: ["twin_id"]
            isOneToOne: false
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
        ]
      }
      twin_memory_shards: {
        Row: {
          created_at: string | null
          id: string
          rarity: string | null
          twin_id: string | null
          type: string
          value: string
          xp: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rarity?: string | null
          twin_id?: string | null
          type: string
          value: string
          xp?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rarity?: string | null
          twin_id?: string | null
          type?: string
          value?: string
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "twin_memory_shards_twin_id_fkey"
            columns: ["twin_id"]
            isOneToOne: false
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
        ]
      }
      twin_post_likes: {
        Row: {
          created_at: string | null
          id: string
          reaction_type: string
          twin_post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reaction_type?: string
          twin_post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reaction_type?: string
          twin_post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "twin_post_likes_twin_post_id_fkey"
            columns: ["twin_post_id"]
            isOneToOne: false
            referencedRelation: "twin_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "twin_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      twin_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          post_type: string | null
          twin_id: string
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_type?: string | null
          twin_id: string
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_type?: string | null
          twin_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "twin_posts_twin_id_fkey"
            columns: ["twin_id"]
            isOneToOne: false
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
        ]
      }
      twin_quests: {
        Row: {
          completed: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          quest: string
          twin_id: string
          xp_reward: number
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          quest: string
          twin_id: string
          xp_reward: number
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          quest?: string
          twin_id?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "twin_quests_twin_id_fkey"
            columns: ["twin_id"]
            isOneToOne: false
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
        ]
      }
      twin_relations: {
        Row: {
          created_at: string | null
          id: string
          relation_type: string
          strength: number | null
          target_twin_id: string
          twin_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          relation_type: string
          strength?: number | null
          target_twin_id: string
          twin_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          relation_type?: string
          strength?: number | null
          target_twin_id?: string
          twin_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "twin_relations_target_twin_id_fkey"
            columns: ["target_twin_id"]
            isOneToOne: false
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "twin_relations_twin_id_fkey"
            columns: ["twin_id"]
            isOneToOne: false
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
        ]
      }
      twin_stats: {
        Row: {
          chaos: number | null
          clarity: number | null
          harmony: number | null
          id: string
          level: number | null
          shadow: number | null
          specialization: string | null
          twin_id: string | null
          wisdom: number | null
          xp: number | null
        }
        Insert: {
          chaos?: number | null
          clarity?: number | null
          harmony?: number | null
          id?: string
          level?: number | null
          shadow?: number | null
          specialization?: string | null
          twin_id?: string | null
          wisdom?: number | null
          xp?: number | null
        }
        Update: {
          chaos?: number | null
          clarity?: number | null
          harmony?: number | null
          id?: string
          level?: number | null
          shadow?: number | null
          specialization?: string | null
          twin_id?: string | null
          wisdom?: number | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "twin_stats_twin_id_fkey"
            columns: ["twin_id"]
            isOneToOne: true
            referencedRelation: "twins"
            referencedColumns: ["id"]
          },
        ]
      }
      twins: {
        Row: {
          active: boolean | null
          alignment: string | null
          auto_reply_enabled: boolean | null
          created_at: string | null
          current_state: string | null
          id: string
          level: number | null
          memory: Json | null
          personality: string
          tone: string | null
          traits: Json | null
          twin_username: string
          updated_at: string | null
          user_id: string
          visibility: string | null
          xp: number | null
        }
        Insert: {
          active?: boolean | null
          alignment?: string | null
          auto_reply_enabled?: boolean | null
          created_at?: string | null
          current_state?: string | null
          id?: string
          level?: number | null
          memory?: Json | null
          personality?: string
          tone?: string | null
          traits?: Json | null
          twin_username: string
          updated_at?: string | null
          user_id: string
          visibility?: string | null
          xp?: number | null
        }
        Update: {
          active?: boolean | null
          alignment?: string | null
          auto_reply_enabled?: boolean | null
          created_at?: string | null
          current_state?: string | null
          id?: string
          level?: number | null
          memory?: Json | null
          personality?: string
          tone?: string | null
          traits?: Json | null
          twin_username?: string
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "twins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_unlocks: {
        Row: {
          id: string
          portal: string
          unlocked: boolean | null
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          portal: string
          unlocked?: boolean | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          portal?: string
          unlocked?: boolean | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_tier_promotion: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["user_tier"]
      }
      get_or_create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      user_tier: "wanderer" | "witness" | "scribe" | "flamekeeper" | "crown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      user_tier: ["wanderer", "witness", "scribe", "flamekeeper", "crown"],
    },
  },
} as const
