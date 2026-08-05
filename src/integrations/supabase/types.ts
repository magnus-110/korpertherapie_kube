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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      appointment_types: {
        Row: {
          behandler_id: string | null
          created_at: string
          dauer_minuten: number | null
          gebuehren: number | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          behandler_id?: string | null
          created_at?: string
          dauer_minuten?: number | null
          gebuehren?: number | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          behandler_id?: string | null
          created_at?: string
          dauer_minuten?: number | null
          gebuehren?: number | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          behandler_id: string | null
          created_at: string
          ende: string
          id: string
          patient_id: string
          start: string
          status: Database["public"]["Enums"]["appointment_status"]
          type_id: string | null
          updated_at: string
        }
        Insert: {
          behandler_id?: string | null
          created_at?: string
          ende: string
          id?: string
          patient_id: string
          start: string
          status?: Database["public"]["Enums"]["appointment_status"]
          type_id?: string | null
          updated_at?: string
        }
        Update: {
          behandler_id?: string | null
          created_at?: string
          ende?: string
          id?: string
          patient_id?: string
          start?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          type_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "appointment_types"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          absender: string | null
          betrag: number
          created_at: string
          datum: string
          id: string
          matched_invoice_id: string | null
          status: Database["public"]["Enums"]["bank_transaction_status"]
          updated_at: string
          verwendungszweck: string | null
        }
        Insert: {
          absender?: string | null
          betrag: number
          created_at?: string
          datum: string
          id?: string
          matched_invoice_id?: string | null
          status?: Database["public"]["Enums"]["bank_transaction_status"]
          updated_at?: string
          verwendungszweck?: string | null
        }
        Update: {
          absender?: string | null
          betrag?: number
          created_at?: string
          datum?: string
          id?: string
          matched_invoice_id?: string | null
          status?: Database["public"]["Enums"]["bank_transaction_status"]
          updated_at?: string
          verwendungszweck?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_matched_invoice_id_fkey"
            columns: ["matched_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          betrag: number
          bezeichnung: string
          created_at: string
          id: string
          invoice_id: string
          updated_at: string
        }
        Insert: {
          betrag: number
          bezeichnung: string
          created_at?: string
          id?: string
          invoice_id: string
          updated_at?: string
        }
        Update: {
          betrag?: number
          bezeichnung?: string
          created_at?: string
          id?: string
          invoice_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          betrag: number
          created_at: string
          datum: string
          id: string
          patient_id: string
          rechnungsnummer: string
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          betrag: number
          created_at?: string
          datum: string
          id?: string
          patient_id: string
          rechnungsnummer: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          betrag?: number
          created_at?: string
          datum?: string
          id?: string
          patient_id?: string
          rechnungsnummer?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          id: string
          kontakt: string | null
          name: string
          notizen: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kontakt?: string | null
          name: string
          notizen?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kontakt?: string | null
          name?: string
          notizen?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          betrag: number
          created_at: string
          datum: string
          id: string
          invoice_id: string
          quelle: Database["public"]["Enums"]["payment_source"]
          updated_at: string
        }
        Insert: {
          betrag: number
          created_at?: string
          datum: string
          id?: string
          invoice_id: string
          quelle?: Database["public"]["Enums"]["payment_source"]
          updated_at?: string
        }
        Update: {
          betrag?: number
          created_at?: string
          datum?: string
          id?: string
          invoice_id?: string
          quelle?: Database["public"]["Enums"]["payment_source"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_voll: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "voll" | "eingeschraenkt"
      appointment_status: "geplant" | "abgehakt"
      bank_transaction_status: "offen" | "zugeordnet"
      invoice_status: "offen" | "bezahlt" | "angemahnt"
      payment_source: "kontoauszug" | "manuell"
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
      app_role: ["voll", "eingeschraenkt"],
      appointment_status: ["geplant", "abgehakt"],
      bank_transaction_status: ["offen", "zugeordnet"],
      invoice_status: ["offen", "bezahlt", "angemahnt"],
      payment_source: ["kontoauszug", "manuell"],
    },
  },
} as const
