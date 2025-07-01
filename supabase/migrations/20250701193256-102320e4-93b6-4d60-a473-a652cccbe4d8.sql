
-- Criar enum para níveis de permissão
CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'operador');

-- Criar enum para status de conteúdo
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

-- Criar enum para tipos de proposição
CREATE TYPE public.proposition_type AS ENUM ('projeto_lei', 'requerimento', 'indicacao', 'mocao', 'emenda');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'operador',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de logs de auditoria
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de vereadores
CREATE TABLE public.vereadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  partido TEXT NOT NULL,
  biografia TEXT,
  foto_url TEXT,
  email TEXT,
  telefone TEXT,
  redes_sociais JSONB,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem_exibicao INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela da mesa diretora
CREATE TABLE public.mesa_diretora (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vereador_id UUID REFERENCES public.vereadores ON DELETE CASCADE,
  cargo TEXT NOT NULL,
  telefone_institucional TEXT,
  email_institucional TEXT,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de legislaturas
CREATE TABLE public.legislaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  descricao TEXT,
  ativa BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de proposições legislativas
CREATE TABLE public.proposicoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL,
  ano INTEGER NOT NULL,
  tipo proposition_type NOT NULL,
  ementa TEXT NOT NULL,
  autor_id UUID REFERENCES public.vereadores,
  data_apresentacao DATE NOT NULL,
  situacao TEXT NOT NULL DEFAULT 'Em tramitação',
  arquivo_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de notícias
CREATE TABLE public.noticias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  conteudo TEXT NOT NULL,
  imagem_destaque TEXT,
  slug TEXT NOT NULL UNIQUE,
  destaque BOOLEAN NOT NULL DEFAULT false,
  data_publicacao TIMESTAMP WITH TIME ZONE,
  autor_id UUID REFERENCES auth.users NOT NULL,
  status content_status NOT NULL DEFAULT 'draft',
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de páginas dinâmicas
CREATE TABLE public.paginas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  conteudo TEXT NOT NULL,
  meta_description TEXT,
  ordem_menu INTEGER,
  visivel_menu BOOLEAN NOT NULL DEFAULT true,
  status content_status NOT NULL DEFAULT 'draft',
  autor_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de documentos de transparência
CREATE TABLE public.transparencia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  tipo_arquivo TEXT NOT NULL,
  tamanho_arquivo INTEGER,
  data_documento DATE,
  data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  autor_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de símbolos oficiais
CREATE TABLE public.simbolos_oficiais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL, -- 'brasao', 'bandeira', 'hino'
  titulo TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT,
  conteudo_html TEXT, -- Para o hino ou descrições
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de mensagens da ouvidoria
CREATE TABLE public.ouvidoria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  anexo_url TEXT,
  status TEXT NOT NULL DEFAULT 'Nova',
  resposta TEXT,
  respondido_por UUID REFERENCES auth.users,
  respondido_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de formulários personalizados
CREATE TABLE public.formularios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  campos JSONB NOT NULL, -- Estrutura dos campos do formulário
  email_destino TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de respostas dos formulários
CREATE TABLE public.formulario_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  formulario_id UUID REFERENCES public.formularios ON DELETE CASCADE,
  respostas JSONB NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar trigger para auto-preenchimento de perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar função para logs de auditoria
CREATE OR REPLACE FUNCTION public.log_audit_action()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar triggers de auditoria nas tabelas principais
CREATE TRIGGER audit_vereadores AFTER INSERT OR UPDATE OR DELETE ON public.vereadores FOR EACH ROW EXECUTE PROCEDURE public.log_audit_action();
CREATE TRIGGER audit_noticias AFTER INSERT OR UPDATE OR DELETE ON public.noticias FOR EACH ROW EXECUTE PROCEDURE public.log_audit_action();
CREATE TRIGGER audit_paginas AFTER INSERT OR UPDATE OR DELETE ON public.paginas FOR EACH ROW EXECUTE PROCEDURE public.log_audit_action();
CREATE TRIGGER audit_proposicoes AFTER INSERT OR UPDATE OR DELETE ON public.proposicoes FOR EACH ROW EXECUTE PROCEDURE public.log_audit_action();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vereadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesa_diretora ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legislaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paginas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simbolos_oficiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ouvidoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formularios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formulario_respostas ENABLE ROW LEVEL SECURITY;

-- Função para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para logs de auditoria (apenas admins)
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para conteúdo (vereadores, notícias, etc.)
-- Visualização pública para conteúdo publicado
CREATE POLICY "Anyone can view published vereadores" ON public.vereadores FOR SELECT USING (ativo = true);
CREATE POLICY "Authenticated users can manage vereadores" ON public.vereadores FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view published news" ON public.noticias FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can manage news" ON public.noticias FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view published pages" ON public.paginas FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can manage pages" ON public.paginas FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view published propositions" ON public.proposicoes FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can manage propositions" ON public.proposicoes FOR ALL USING (auth.role() = 'authenticated');

-- Políticas similares para outras tabelas
CREATE POLICY "Anyone can view active mesa diretora" ON public.mesa_diretora FOR SELECT USING (ativo = true);
CREATE POLICY "Authenticated users can manage mesa diretora" ON public.mesa_diretora FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view legislaturas" ON public.legislaturas FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage legislaturas" ON public.legislaturas FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view transparencia docs" ON public.transparencia FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage transparencia" ON public.transparencia FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view active simbolos" ON public.simbolos_oficiais FOR SELECT USING (ativo = true);
CREATE POLICY "Authenticated users can manage simbolos" ON public.simbolos_oficiais FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can submit ouvidoria" ON public.ouvidoria FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage ouvidoria" ON public.ouvidoria FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view active forms" ON public.formularios FOR SELECT USING (ativo = true);
CREATE POLICY "Authenticated users can manage forms" ON public.formularios FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can submit form responses" ON public.formulario_respostas FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view form responses" ON public.formulario_respostas FOR SELECT USING (auth.role() = 'authenticated');
