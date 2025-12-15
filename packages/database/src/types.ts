export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'super_admin' | 'company_admin' | 'user';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          company_id: string | null;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          job_title: string | null;
          bio: string | null;
          phone: string | null;
          timezone: string;
          language: string;
          preferences: Json;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id?: string | null;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          job_title?: string | null;
          bio?: string | null;
          phone?: string | null;
          timezone?: string;
          language?: string;
          preferences?: Json;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          job_title?: string | null;
          bio?: string | null;
          phone?: string | null;
          timezone?: string;
          language?: string;
          preferences?: Json;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_company_id_fkey';
            columns: ['company_id'];
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          website: string | null;
          description: string | null;
          primary_color: string | null;
          secondary_color: string | null;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          settings: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          contact_name?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          settings?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey';
            columns: ['parent_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      courses: {
        Row: {
          id: string;
          company_id: string | null;
          category_id: string | null;
          instructor_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          thumbnail_url: string | null;
          preview_video_url: string | null;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          duration_minutes: number;
          price: number;
          currency: string;
          is_free: boolean;
          is_featured: boolean;
          is_published: boolean;
          is_active: boolean;
          published_at: string | null;
          requirements: string[] | null;
          objectives: string[] | null;
          tags: string[] | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          category_id?: string | null;
          instructor_id?: string | null;
          title: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          thumbnail_url?: string | null;
          preview_video_url?: string | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          duration_minutes?: number;
          price?: number;
          currency?: string;
          is_free?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          is_active?: boolean;
          published_at?: string | null;
          requirements?: string[] | null;
          objectives?: string[] | null;
          tags?: string[] | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          category_id?: string | null;
          instructor_id?: string | null;
          title?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          thumbnail_url?: string | null;
          preview_video_url?: string | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          duration_minutes?: number;
          price?: number;
          currency?: string;
          is_free?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          is_active?: boolean;
          published_at?: string | null;
          requirements?: string[] | null;
          objectives?: string[] | null;
          tags?: string[] | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'courses_company_id_fkey';
            columns: ['company_id'];
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'courses_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'courses_instructor_id_fkey';
            columns: ['instructor_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'modules_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          content_type: 'video' | 'text' | 'quiz' | 'assignment' | 'scorm' | 'pdf' | 'interactive';
          content: Json;
          duration_minutes: number;
          sort_order: number;
          is_preview: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          content_type?: 'video' | 'text' | 'quiz' | 'assignment' | 'scorm' | 'pdf' | 'interactive';
          content?: Json;
          duration_minutes?: number;
          sort_order?: number;
          is_preview?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          content_type?: 'video' | 'text' | 'quiz' | 'assignment' | 'scorm' | 'pdf' | 'interactive';
          content?: Json;
          duration_minutes?: number;
          sort_order?: number;
          is_preview?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey';
            columns: ['module_id'];
            referencedRelation: 'modules';
            referencedColumns: ['id'];
          }
        ];
      };
      groups: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'groups_company_id_fkey';
            columns: ['company_id'];
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'group_members_group_id_fkey';
            columns: ['group_id'];
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_members_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          company_id: string | null;
          enrolled_by: string | null;
          enrollment_type: 'self' | 'admin' | 'group' | 'subscription';
          status: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'cancelled' | 'suspended';
          progress: number;
          started_at: string | null;
          completed_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          company_id?: string | null;
          enrolled_by?: string | null;
          enrollment_type?: 'self' | 'admin' | 'group' | 'subscription';
          status?: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'cancelled' | 'suspended';
          progress?: number;
          started_at?: string | null;
          completed_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          company_id?: string | null;
          enrolled_by?: string | null;
          enrollment_type?: 'self' | 'admin' | 'group' | 'subscription';
          status?: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'cancelled' | 'suspended';
          progress?: number;
          started_at?: string | null;
          completed_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'enrollments_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'enrollments_company_id_fkey';
            columns: ['company_id'];
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          company_id: string | null;
          certificate_number: string;
          issued_at: string;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          company_id?: string | null;
          certificate_number: string;
          issued_at?: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          company_id?: string | null;
          certificate_number?: string;
          issued_at?: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'certificates_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'certificates_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      company_courses: {
        Row: {
          id: string;
          company_id: string;
          course_id: string;
          is_mandatory: boolean;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          course_id: string;
          is_mandatory?: boolean;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          course_id?: string;
          is_mandatory?: boolean;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'company_courses_company_id_fkey';
            columns: ['company_id'];
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'company_courses_course_id_fkey';
            columns: ['course_id'];
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          company_id: string;
          plan_id: string;
          status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          plan_id: string;
          status?: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          plan_id?: string;
          status?: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_company_id_fkey';
            columns: ['company_id'];
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      invitations: {
        Row: {
          id: string;
          email: string;
          company_id: string;
          role: UserRole;
          invited_by: string;
          status: 'pending' | 'accepted' | 'expired' | 'cancelled';
          token: string;
          metadata: Json;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          company_id: string;
          role?: UserRole;
          invited_by: string;
          status?: 'pending' | 'accepted' | 'expired' | 'cancelled';
          token?: string;
          metadata?: Json;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_id?: string;
          role?: UserRole;
          invited_by?: string;
          status?: 'pending' | 'accepted' | 'expired' | 'cancelled';
          token?: string;
          metadata?: Json;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'invitations_company_id_fkey';
            columns: ['company_id'];
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invitations_invited_by_fkey';
            columns: ['invited_by'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
