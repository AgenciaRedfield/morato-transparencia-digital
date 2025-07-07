export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      formulario_respostas: {
        Row: {
          created_at: string
          formulario_id: string | null
          id: string
          ip_address: string | null
          respostas: Json
        }
        Insert: {
          created_at?: string
          formulario_id?: string | null
          id?: string
          ip_address?: string | null
          respostas: Json
        }
        Update: {
          created_at?: string
          formulario_id?: string | null
          id?: string
          ip_address?: string | null
          respostas?: Json
        }
        Relationships: [
          {
            foreignKeyName: "formulario_respostas_formulario_id_fkey"
            columns: ["formulario_id"]
            isOneToOne: false
            referencedRelation: "formularios"
            referencedColumns: ["id"]
          },
        ]
      }
      formularios: {
        Row: {
          ativo: boolean
          campos: Json
          created_at: string
          descricao: string | null
          email_destino: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          campos: Json
          created_at?: string
          descricao?: string | null
          email_destino: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          campos?: Json
          created_at?: string
          descricao?: string | null
          email_destino?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      legislaturas: {
        Row: {
          ativa: boolean
          created_at: string
          descricao: string | null
          id: string
          numero: number
          periodo_fim: string
          periodo_inicio: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          numero: number
          periodo_fim: string
          periodo_inicio: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          numero?: number
          periodo_fim?: string
          periodo_inicio?: string
        }
        Relationships: []
      }
      mesa_diretora: {
        Row: {
          ativo: boolean
          cargo: string
          created_at: string
          email_institucional: string | null
          id: string
          periodo_fim: string | null
          periodo_inicio: string
          telefone_institucional: string | null
          vereador_id: string | null
        }
        Insert: {
          ativo?: boolean
          cargo: string
          created_at?: string
          email_institucional?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio: string
          telefone_institucional?: string | null
          vereador_id?: string | null
        }
        Update: {
          ativo?: boolean
          cargo?: string
          created_at?: string
          email_institucional?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string
          telefone_institucional?: string | null
          vereador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mesa_diretora_vereador_id_fkey"
            columns: ["vereador_id"]
            isOneToOne: false
            referencedRelation: "vereadores"
            referencedColumns: ["id"]
          },
        ]
      }
      noticias: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string
          data_publicacao: string | null
          destaque: boolean
          id: string
          imagem_destaque: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          subtitulo: string | null
          titulo: string
          updated_at: string
          visualizacoes: number
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string
          data_publicacao?: string | null
          destaque?: boolean
          id?: string
          imagem_destaque?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          subtitulo?: string | null
          titulo: string
          updated_at?: string
          visualizacoes?: number
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string
          data_publicacao?: string | null
          destaque?: boolean
          id?: string
          imagem_destaque?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
          visualizacoes?: number
        }
        Relationships: []
      }
      ouvidoria: {
        Row: {
          anexo_url: string | null
          assunto: string
          created_at: string
          email: string
          id: string
          mensagem: string
          nome: string
          respondido_em: string | null
          respondido_por: string | null
          resposta: string | null
          status: string
          telefone: string | null
        }
        Insert: {
          anexo_url?: string | null
          assunto: string
          created_at?: string
          email: string
          id?: string
          mensagem: string
          nome: string
          respondido_em?: string | null
          respondido_por?: string | null
          resposta?: string | null
          status?: string
          telefone?: string | null
        }
        Update: {
          anexo_url?: string | null
          assunto?: string
          created_at?: string
          email?: string
          id?: string
          mensagem?: string
          nome?: string
          respondido_em?: string | null
          respondido_por?: string | null
          resposta?: string | null
          status?: string
          telefone?: string | null
        }
        Relationships: []
      }
      paginas: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string
          id: string
          meta_description: string | null
          ordem_menu: number | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          titulo: string
          updated_at: string
          visivel_menu: boolean
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string
          id?: string
          meta_description?: string | null
          ordem_menu?: number | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          titulo: string
          updated_at?: string
          visivel_menu?: boolean
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          ordem_menu?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          titulo?: string
          updated_at?: string
          visivel_menu?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      proposicoes: {
        Row: {
          ano: number
          arquivo_url: string | null
          autor_id: string | null
          created_at: string
          data_apresentacao: string
          ementa: string
          id: string
          numero: string
          situacao: string
          status: Database["public"]["Enums"]["content_status"]
          tipo: Database["public"]["Enums"]["proposition_type"]
          updated_at: string
        }
        Insert: {
          ano: number
          arquivo_url?: string | null
          autor_id?: string | null
          created_at?: string
          data_apresentacao: string
          ementa: string
          id?: string
          numero: string
          situacao?: string
          status?: Database["public"]["Enums"]["content_status"]
          tipo: Database["public"]["Enums"]["proposition_type"]
          updated_at?: string
        }
        Update: {
          ano?: number
          arquivo_url?: string | null
          autor_id?: string | null
          created_at?: string
          data_apresentacao?: string
          ementa?: string
          id?: string
          numero?: string
          situacao?: string
          status?: Database["public"]["Enums"]["content_status"]
          tipo?: Database["public"]["Enums"]["proposition_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposicoes_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "vereadores"
            referencedColumns: ["id"]
          },
        ]
      }
      simbolos_oficiais: {
        Row: {
          arquivo_url: string | null
          ativo: boolean
          conteudo_html: string | null
          created_at: string
          descricao: string | null
          id: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          ativo?: boolean
          conteudo_html?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          ativo?: boolean
          conteudo_html?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      transparencia: {
        Row: {
          arquivo_url: string
          autor_id: string
          categoria: string
          created_at: string
          data_documento: string | null
          data_publicacao: string
          descricao: string | null
          id: string
          tamanho_arquivo: number | null
          tipo_arquivo: string
          titulo: string
        }
        Insert: {
          arquivo_url: string
          autor_id: string
          categoria: string
          created_at?: string
          data_documento?: string | null
          data_publicacao?: string
          descricao?: string | null
          id?: string
          tamanho_arquivo?: number | null
          tipo_arquivo: string
          titulo: string
        }
        Update: {
          arquivo_url?: string
          autor_id?: string
          categoria?: string
          created_at?: string
          data_documento?: string | null
          data_publicacao?: string
          descricao?: string | null
          id?: string
          tamanho_arquivo?: number | null
          tipo_arquivo?: string
          titulo?: string
        }
        Relationships: []
      }
      vereadores: {
        Row: {
          ativo: boolean
          biografia: string | null
          created_at: string
          email: string | null
          foto_url: string | null
          id: string
          nome: string
          ordem_exibicao: number | null
          partido: string
          redes_sociais: Json | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          biografia?: string | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          ordem_exibicao?: number | null
          partido: string
          redes_sociais?: Json | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          biografia?: string | null
          created_at?: string
          email?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          ordem_exibicao?: number | null
          partido?: string
          redes_sociais?: Json | null
          telefone?: string | null
          updated_at?: string
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
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      content_status: "draft" | "published" | "archived"
      proposition_type:
        | "projeto_lei"
        | "requerimento"
        | "indicacao"
        | "mocao"
        | "emenda"
      user_role: "admin" | "editor" | "operador"
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
      content_status: ["draft", "published", "archived"],
      proposition_type: [
        "projeto_lei",
        "requerimento",
        "indicacao",
        "mocao",
        "emenda",
      ],
      user_role: ["admin", "editor", "operador"],
    },
  },
} as const
