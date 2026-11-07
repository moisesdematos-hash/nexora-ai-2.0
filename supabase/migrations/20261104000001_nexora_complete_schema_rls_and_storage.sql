-- ============================================================================
-- NEXORA AI 2.0 — MIGRAÇÃO OFICIAL SUPABASE (POSTGRESQL + PRISMA + AUTH + RLS + STORAGE)
-- Projeto: qtngmvqehbzylvsgwive.supabase.co
-- ============================================================================
-- Instruções: Cola este script completo no "SQL Editor" do teu projeto Supabase
-- e clica em "Run". O script é 100% idempotente e alinha o Supabase com o Prisma ORM.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABELA DE PERFIS SINCRONIZADA COM SUPABASE AUTH (auth.users) E PRISMA
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  supabase_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  locale TEXT NOT NULL DEFAULT 'pt',
  theme TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS supabase_id TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. ORGANIZAÇÕES MULTI-TENANT & SALDO DE CRÉDITOS IA
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  owner_id TEXT,
  plan TEXT NOT NULL DEFAULT 'FREE' CHECK (plan IN ('FREE', 'STARTER', 'PRO', 'ENTERPRISE')),
  credits_balance INTEGER NOT NULL DEFAULT 200,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS owner_id TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 3. MEMBROS DA ORGANIZAÇÃO & RBAC (OWNER, ADMIN, EDITOR, VIEWER) + ALIAS PRISMA (memberships)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'OWNER' CHECK (role IN ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'OWNER',
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 4. PROJETOS DOS 6 ESTÚDIOS CRIATIVOS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  folder_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('PRESENTATION', 'EBOOK', 'DOCUMENT', 'MINDMAP', 'INFOGRAPHIC', 'WEBSITE')),
  status TEXT NOT NULL DEFAULT 'DRAFT',
  language TEXT NOT NULL DEFAULT 'pt',
  cover_url TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  book_memory JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELAS DE LIVROS / CAPÍTULOS COMPATÍVEIS COM PRISMA & SUPABASE
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID UNIQUE NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  genre TEXT,
  language TEXT NOT NULL DEFAULT 'pt',
  target_word_count INTEGER,
  current_word_count INTEGER NOT NULL DEFAULT 0,
  cover_url TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.book_outlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID UNIQUE NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.book_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.book_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.book_parts(id) ON DELETE SET NULL,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.book_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING',
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.book_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  embedding DOUBLE PRECISION[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ebook_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL DEFAULT '',
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, chapter_number)
);

-- 6. CONTROLO DE VERSÕES ATÓMICO (TIME-MACHINE CHECKPOINTS)
CREATE TABLE IF NOT EXISTS public.project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SUBSCRIÇÕES & TRANSACTIONAL CREDIT LEDGER (COMPATÍVEL COM PRISMA credit_transactions E credit_ledger)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL DEFAULT 'FREE',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  credits_remaining INTEGER NOT NULL DEFAULT 200,
  credits_total INTEGER NOT NULL DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'BONUS',
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  operation TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'COMMITTED' CHECK (status IN ('RESERVED', 'COMMITTED', 'REFUNDED')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. TRIGGER AUTOMÁTICO DE ONBOARDING (CRIA USER + ORG + 200 CRÉDITOS GRÁTIS)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_supabase_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  new_sub_id UUID;
  user_full_name TEXT;
BEGIN
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.users (id, supabase_id, email, name, avatar_url)
  VALUES (NEW.id, NEW.id::text, NEW.email, user_full_name, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO UPDATE SET supabase_id = EXCLUDED.supabase_id;

  INSERT INTO public.organizations (name, slug, owner_id, plan, credits_balance)
  VALUES (
    user_full_name || ' Workspace',
    'org-' || substr(replace(NEW.id::text, '-', ''), 1, 12),
    NEW.id::text,
    'FREE',
    200
  )
  RETURNING id INTO new_org_id;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'OWNER')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.memberships (organization_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'OWNER')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.subscriptions (organization_id, plan_id, status, credits_remaining, credits_total)
  VALUES (new_org_id, 'FREE', 'ACTIVE', 200, 200)
  RETURNING id INTO new_sub_id;

  INSERT INTO public.credit_transactions (organization_id, user_id, subscription_id, type, amount, balance_after, description)
  VALUES (new_org_id, NEW.id, new_sub_id, 'BONUS', 200, 200, 'Bónus de Boas-Vindas NEXORA AI (+200 créditos)');

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
-- 9. POLÍTICAS DE SEGURANÇA ROW-LEVEL SECURITY (RLS MULTI-TENANT)
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Utilizadores podem ver e editar o próprio perfil" ON public.users;
CREATE POLICY "Utilizadores podem ver e editar o próprio perfil"
  ON public.users FOR ALL
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Membros podem aceder às suas organizações" ON public.organizations;
CREATE POLICY "Membros podem aceder às suas organizações"
  ON public.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organizations.id AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners e Admins podem atualizar a sua organização" ON public.organizations;
CREATE POLICY "Owners e Admins podem atualizar a sua organização"
  ON public.organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.role IN ('OWNER', 'ADMIN')
    )
  );

DROP POLICY IF EXISTS "Membros podem ver os colegas da organização" ON public.organization_members;
CREATE POLICY "Membros podem ver os colegas da organização"
  ON public.organization_members FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Membros podem ver memberships da organização" ON public.memberships;
CREATE POLICY "Membros podem ver memberships da organização"
  ON public.memberships FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Membros podem gerir projetos da sua organização" ON public.projects;
CREATE POLICY "Membros podem gerir projetos da sua organização"
  ON public.projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = projects.organization_id AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Membros podem gerir livros dos seus projetos" ON public.books;
CREATE POLICY "Membros podem gerir livros dos seus projetos"
  ON public.books FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = books.project_id AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Membros podem gerir capítulos dos seus projetos" ON public.ebook_chapters;
CREATE POLICY "Membros podem gerir capítulos dos seus projetos"
  ON public.ebook_chapters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = ebook_chapters.project_id AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Membros podem gerir versões dos seus projetos" ON public.project_versions;
CREATE POLICY "Membros podem gerir versões dos seus projetos"
  ON public.project_versions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = project_versions.project_id AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Membros podem consultar subscrições da organização" ON public.subscriptions;
CREATE POLICY "Membros podem consultar subscrições da organização"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = subscriptions.organization_id AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Membros podem consultar transações de créditos da organização" ON public.credit_transactions;
CREATE POLICY "Membros podem consultar transações de créditos da organização"
  ON public.credit_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = credit_transactions.organization_id AND om.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Membros podem consultar o extrato de créditos da organização" ON public.credit_ledger;
CREATE POLICY "Membros podem consultar o extrato de créditos da organização"
  ON public.credit_ledger FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = credit_ledger.organization_id AND om.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. SUPABASE STORAGE BUCKETS & POLÍTICAS RLS DE OBJETOS (storage.objects)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('nexora-covers', 'nexora-covers', true),
  ('nexora-exports', 'nexora-exports', false),
  ('nexora-assets-8k', 'nexora-assets-8k', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Leitura pública de capas e assets 8K" ON storage.objects;
CREATE POLICY "Leitura pública de capas e assets 8K"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('nexora-covers', 'nexora-assets-8k'));

DROP POLICY IF EXISTS "Upload autenticado nos buckets NEXORA" ON storage.objects;
CREATE POLICY "Upload autenticado nos buckets NEXORA"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id IN ('nexora-covers', 'nexora-exports', 'nexora-assets-8k')
  );

DROP POLICY IF EXISTS "Utilizadores gerem os seus próprios ficheiros exportados" ON storage.objects;
CREATE POLICY "Utilizadores gerem os seus próprios ficheiros exportados"
  ON storage.objects FOR ALL
  USING (auth.uid() = owner);
