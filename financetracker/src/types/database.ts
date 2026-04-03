export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          currency: string;
          budget_alert_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          currency?: string;
          budget_alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          currency?: string;
          budget_alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: "income" | "expense";
          amount: number;
          category: string;
          note: string | null;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "income" | "expense";
          amount: number;
          category: string;
          note?: string | null;
          date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "income" | "expense";
          amount?: number;
          category?: string;
          note?: string | null;
          date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          monthly_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          monthly_limit: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          monthly_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      monthly_summaries: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          total_income: number;
          total_expense: number;
          category_breakdown: Record<string, number>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          total_income?: number;
          total_expense?: number;
          category_breakdown?: Record<string, number>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          total_income?: number;
          total_expense?: number;
          category_breakdown?: Record<string, number>;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "monthly_summaries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
