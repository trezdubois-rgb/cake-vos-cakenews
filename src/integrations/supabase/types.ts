export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      ads: {
        Row: {
          active: boolean | null;
          click_count: number | null;
          created_at: string;
          description: string | null;
          expires_at: string | null;
          id: string;
          image_url: string;
          impression_count: number | null;
          link_url: string | null;
          media_type: string | null;
          placement: string;
          schedule_end: string | null;
          schedule_start: string | null;
          target_audience: string | null;
          title: string;
          video_url: string | null;
        };
        Insert: {
          active?: boolean | null;
          click_count?: number | null;
          created_at?: string;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          image_url: string;
          impression_count?: number | null;
          link_url?: string | null;
          media_type?: string | null;
          placement: string;
          schedule_end?: string | null;
          schedule_start?: string | null;
          target_audience?: string | null;
          title: string;
          video_url?: string | null;
        };
        Update: {
          active?: boolean | null;
          click_count?: number | null;
          created_at?: string;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          image_url?: string;
          impression_count?: number | null;
          link_url?: string | null;
          media_type?: string | null;
          placement?: string;
          schedule_end?: string | null;
          schedule_start?: string | null;
          target_audience?: string | null;
          title?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };
      article_media: {
        Row: {
          article_id: string;
          caption: string | null;
          created_at: string;
          id: string;
          media_type: string;
          media_url: string;
          position: number;
        };
        Insert: {
          article_id: string;
          caption?: string | null;
          created_at?: string;
          id?: string;
          media_type: string;
          media_url: string;
          position?: number;
        };
        Update: {
          article_id?: string;
          caption?: string | null;
          created_at?: string;
          id?: string;
          media_type?: string;
          media_url?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'article_media_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
        ];
      };
      article_revisions: {
        Row: {
          article_id: string;
          content_html: string;
          created_at: string;
          created_by: string;
          id: string;
          metadata: Json | null;
          title: string;
        };
        Insert: {
          article_id: string;
          content_html: string;
          created_at?: string;
          created_by: string;
          id?: string;
          metadata?: Json | null;
          title: string;
        };
        Update: {
          article_id?: string;
          content_html?: string;
          created_at?: string;
          created_by?: string;
          id?: string;
          metadata?: Json | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'article_revisions_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
        ];
      };
      articles: {
        Row: {
          audio_url: string | null;
          author_id: string;
          category: string | null;
          category_id: string | null;
          content_blocks: Json | null;
          content_html: string;
          created_at: string;
          excerpt: string | null;
          featured: boolean | null;
          hero_image_url: string | null;
          hero_video_url: string | null;
          id: string;
          like_count: number | null;
          media_type: string | null;
          published: boolean | null;
          published_at: string | null;
          scheduled_publish_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          status: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
          view_count: number | null;
        };
        Insert: {
          audio_url?: string | null;
          author_id: string;
          category?: string | null;
          category_id?: string | null;
          content_blocks?: Json | null;
          content_html: string;
          created_at?: string;
          excerpt?: string | null;
          featured?: boolean | null;
          hero_image_url?: string | null;
          hero_video_url?: string | null;
          id?: string;
          like_count?: number | null;
          media_type?: string | null;
          published?: boolean | null;
          published_at?: string | null;
          scheduled_publish_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
          view_count?: number | null;
        };
        Update: {
          audio_url?: string | null;
          author_id?: string;
          category?: string | null;
          category_id?: string | null;
          content_blocks?: Json | null;
          content_html?: string;
          created_at?: string;
          excerpt?: string | null;
          featured?: boolean | null;
          hero_image_url?: string | null;
          hero_video_url?: string | null;
          id?: string;
          like_count?: number | null;
          media_type?: string | null;
          published?: boolean | null;
          published_at?: string | null;
          scheduled_publish_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'articles_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          display_order: number | null;
          icon: string | null;
          id: string;
          name: string;
          parent_id: string | null;
          slug: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          name: string;
          parent_id?: string | null;
          slug: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          icon?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      comment_likes: {
        Row: {
          comment_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_likes_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
        ];
      };
      comments: {
        Row: {
          article_id: string;
          content: string;
          created_at: string;
          id: string;
          like_count: number | null;
          parent_id: string | null;
          user_id: string;
        };
        Insert: {
          article_id: string;
          content: string;
          created_at?: string;
          id?: string;
          like_count?: number | null;
          parent_id?: string | null;
          user_id: string;
        };
        Update: {
          article_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          like_count?: number | null;
          parent_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
        ];
      };
      media_library: {
        Row: {
          alt_text: string | null;
          caption: string | null;
          created_at: string;
          duration: number | null;
          file_size: number;
          file_type: string;
          filename: string;
          height: number | null;
          id: string;
          metadata: Json | null;
          mime_type: string;
          original_filename: string;
          thumbnail_url: string | null;
          updated_at: string;
          url: string;
          user_id: string;
          width: number | null;
        };
        Insert: {
          alt_text?: string | null;
          caption?: string | null;
          created_at?: string;
          duration?: number | null;
          file_size: number;
          file_type: string;
          filename: string;
          height?: number | null;
          id?: string;
          metadata?: Json | null;
          mime_type: string;
          original_filename: string;
          thumbnail_url?: string | null;
          updated_at?: string;
          url: string;
          user_id: string;
          width?: number | null;
        };
        Update: {
          alt_text?: string | null;
          caption?: string | null;
          created_at?: string;
          duration?: number | null;
          file_size?: number;
          file_type?: string;
          filename?: string;
          height?: number | null;
          id?: string;
          metadata?: Json | null;
          mime_type?: string;
          original_filename?: string;
          thumbnail_url?: string | null;
          updated_at?: string;
          url?: string;
          user_id?: string;
          width?: number | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          link_url: string | null;
          message: string;
          read: boolean;
          related_article_id: string | null;
          related_comment_id: string | null;
          related_user_id: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          link_url?: string | null;
          message: string;
          read?: boolean;
          related_article_id?: string | null;
          related_comment_id?: string | null;
          related_user_id?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          link_url?: string | null;
          message?: string;
          read?: boolean;
          related_article_id?: string | null;
          related_comment_id?: string | null;
          related_user_id?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_related_article_id_fkey';
            columns: ['related_article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_related_comment_id_fkey';
            columns: ['related_comment_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_interactions: {
        Row: {
          article_id: string;
          favorited: boolean | null;
          id: string;
          last_seen_at: string | null;
          liked: boolean | null;
          time_spent_sec: number | null;
          user_id: string;
        };
        Insert: {
          article_id: string;
          favorited?: boolean | null;
          id?: string;
          last_seen_at?: string | null;
          liked?: boolean | null;
          time_spent_sec?: number | null;
          user_id: string;
        };
        Update: {
          article_id?: string;
          favorited?: boolean | null;
          id?: string;
          last_seen_at?: string | null;
          liked?: boolean | null;
          time_spent_sec?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_interactions_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [];
      };
      view_tracking: {
        Row: {
          article_id: string;
          id: string;
          last_view_increment: string;
          user_id: string;
          view_date: string;
          viewed_at: string;
          views_generated: number;
        };
        Insert: {
          article_id: string;
          id?: string;
          last_view_increment?: string;
          user_id: string;
          view_date?: string;
          viewed_at?: string;
          views_generated?: number;
        };
        Update: {
          article_id?: string;
          id?: string;
          last_view_increment?: string;
          user_id?: string;
          view_date?: string;
          viewed_at?: string;
          views_generated?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'view_tracking_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_favorites_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_preferences: {
        Row: {
          id: string;
          id: string;
          type: string;
          user_id: string;
          value: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          type: string;
          user_id: string;
          value: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          type?: string;
          user_id?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrement_comment_likes: {
        Args: { comment_id: string };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: Database['public']['Enums']['app_role'];
          _user_id: string;
        };
        Returns: boolean;
      };
      increment_comment_likes: {
        Args: { comment_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: 'admin' | 'user';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ['admin', 'user'],
    },
  },
} as const;