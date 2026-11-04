-- ============================================================================
-- NEXORA AI 2.0 — MIGRAÇÃO OFICIAL SUPABASE (POSTGRESQL + AUTH + RLS + STORAGE)
-- ============================================================================
-- Instruções: Cola este script completo no "SQL Editor" do teu projeto Supabase
-- e clica em "Run" para criar as tabelas, triggers de Auth (200 créditos grátis),
-- políticas de Segurança Row-Level Security (RLS) e Buckets de Storage.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABELA DE PERFIS SINCRONIZADA COM SUPABASE AUTH (auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  locale TEXT NOT NULL DEFAULT 'pt',
  theme TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ORGANIZAÇÕES MULTI-TENANT & SALDO DE CRÉDITOS IA
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'FREE' CHECK (plan IN ('FREE', 'STARTER', 'PRO', 'ENTERPRISE')),
  credits_balance INTEGER NOT NULL DEFAULT 200,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MEMBROS DA ORGANIZAÇÃO & RBAC (OWNER, ADMIN, EDITOR, VIEWER)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'OWNER' CHECK (role IN ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 4. PROJETOS DOS 6 ESTÚDIOS CRIATIVOS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PRESENTATION', 'EBOOK', 'DOCUMENT', 'MINDMAP', 'INFOGRAPHIC', 'WEBSITE')),
  status TEXT NOT NULL DEFAULT 'DRAFT',
  language TEXT NOT NULL DEFAULT 'pt',
  cover_url TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  book_memory JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CONTROLO DE VERSÕES ATÓMICO (TIME-MACHINE CHECKPOINTS)
CREATE TABLE IF NOT EXISTS public.project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TRANSACTIONAL CREDIT LEDGER (LIVRO-RAZÃO IMUTÁVEL DE CRÉDITOS IA)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  operation TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Negativo para débito, Positivo para crédito/reembolso
  balance_after INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'COMMITTED' CHECK (status IN ('RESERVED', 'COMMITTED', 'REFUNDED')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. TRIGGER AUTOMÁTICO DE ONBOARDING (CRIA USER + ORG + 200 CRÉDITOS GRÁTIS)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_supabase_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  user_full_name TEXT;
BEGIN
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (NEW.id, NEW.email, user_full_name, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.organizations (name, slug, plan, credits_balance)
  VALUES (
    user_full_name || ' Workspace',
    'org-' || substr(replace(NEW.id::text, '-', ''), 1, 12),
    'FREE',
    200
  )
  RETURNING id INTO new_org_id;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'OWNER');

  INSERT INTO public.credit_ledger (organization_id, user_id, operation, amount, balance_after, status)
  VALUES (new_org_id, NEW.id, 'WELCOME_BONUS_200_CREDITS', 200, 200, 'COMMITTED');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_supabase_user();

-- ============================================================================
-- 8. POLÍTICAS DE SEGURANÇA ROW-LEVEL SECURITY (RLS MULTI-TENANT)
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizadores podem ver e editar o próprio perfil"
  ON public.users FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Membros podem aceder às suas organizações"
  ON public.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organizations.id AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Membros podem gerir projetos da sua organização"
  ON public.projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = projects.organization_id AND om.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 9. SUPABASE STORAGE BUCKETS (CAPAS HD, EXPORTAÇÕES PDF/EPUB/PPTX & ASSETS 8K)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('nexora-covers', 'nexora-covers', true),
  ('nexora-exports', 'nexora-exports', false),
  ('nexora-assets-8k', 'nexora-assets-8k', true)
ON CONFLICT (id) DO NOTHING;
