'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Presentation,
  BookOpen,
  FileText,
  Brain,
  BarChart3,
  Globe,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  LayoutDashboard,
  HelpCircle,
  Terminal,
  Lock,
  Scale,
  Code2,
  Cpu,
  Database,
  FileCheck2,
  Layers,
  CheckCircle2,
  Award,
  BookMarked,
  Server,
} from 'lucide-react'

type Lang = 'pt' | 'en' | 'es' | 'fr'
type DocTab = 'quickstart' | 'studios' | 'longform' | 'api' | 'credits'
type LegalTab = 'terms' | 'privacy' | 'dpa' | 'cookies' | 'ai_ethics'

const COPY: Record<
  Lang,
  {
    badge: string
    heroTitle1: string
    heroTitleHighlight: string
    heroTitle2: string
    heroSub: string
    promptPlaceholder: string
    ctaCreate: string
    openStudio: string
    featuresTitle: string
    featuresSub: string
    pricingTitle: string
    pricingSub: string
    faqTitle: string
    docsNav: string
    apiNav: string
    securityNav: string
    legalNav: string
  }
> = {
  pt: {
    badge: 'NEXORA AI 2.0 • Plataforma SaaS Enterprise de Criação Multimodal',
    heroTitle1: 'Transforma ideias em ',
    heroTitleHighlight: 'apresentações, e-books de 10 a 500 páginas e websites',
    heroTitle2: ' com IA',
    heroSub:
      'Seis estúdios criativos integrados num único ecossistema: Apresentações 16:9, E-books longos com memória editorial persistente, Documentos Executivos, Mapas Mentais, Infográficos e Landing Pages.',
    promptPlaceholder:
      'Ex: Cria um e-book de 200 páginas sobre Inteligência Artificial Generativa...',
    ctaCreate: 'Gerar com IA Agora',
    openStudio: 'Abrir Área de Produção',
    featuresTitle: 'Seis Estúdios Profissionais, Uma Única Plataforma',
    featuresSub:
      'Clica em qualquer módulo para abrir diretamente o gerador assistido por IA ou o editor visual interativo.',
    pricingTitle: 'Planos Transparentes & Créditos IA Flexíveis',
    pricingSub: 'Começa gratuitamente com 200 créditos IA. Escala quando precisares, com faturação mensal ou anual.',
    faqTitle: 'Perguntas Frequentes (FAQ)',
    docsNav: 'Documentação',
    apiNav: 'API & Dev',
    securityNav: 'Segurança & RGPD',
    legalNav: 'Políticas & Legal',
  },
  en: {
    badge: 'NEXORA AI 2.0 • Enterprise Multimodal AI Creation SaaS',
    heroTitle1: 'Turn ideas into ',
    heroTitleHighlight: 'presentations, 10 to 500-page e-books & websites',
    heroTitle2: ' with AI',
    heroSub:
      'Six integrated creative studios in one platform: 16:9 Presentations, Longform E-books with persistent memory, Executive Docs, Mind Maps, Infographics, and Landing Pages.',
    promptPlaceholder:
      'E.g., Create a 200-page e-book on Enterprise Generative AI...',
    ctaCreate: 'Generate with AI Now',
    openStudio: 'Open Production Area',
    featuresTitle: 'Six Professional Studios, One Unified Platform',
    featuresSub: 'Click any module below to launch its AI generator or interactive visual editor.',
    pricingTitle: 'Transparent Plans & Flexible AI Credits',
    pricingSub: 'Start free with 200 AI credits. Upgrade anytime as you scale.',
    faqTitle: 'Frequently Asked Questions (FAQ)',
    docsNav: 'Documentation',
    apiNav: 'API & Dev',
    securityNav: 'Security & GDPR',
    legalNav: 'Policies & Legal',
  },
  es: {
    badge: 'NEXORA AI 2.0 • Plataforma SaaS Enterprise de Creación Multimodal',
    heroTitle1: 'Transforma ideas en ',
    heroTitleHighlight: 'presentaciones, e-books de 10 a 500 páginas y sitios web',
    heroTitle2: ' con IA',
    heroSub:
      'Seis estudios creativos integrados: Presentaciones 16:9, E-books extensos con memoria editorial, Documentos Ejecutivos, Mapas Mentales, Infografías y Landing Pages.',
    promptPlaceholder:
      'Ej: Crea un e-book de 200 páginas sobre Inteligencia Artificial...',
    ctaCreate: 'Generar con IA Ahora',
    openStudio: 'Abrir Área de Producción',
    featuresTitle: 'Seis Estudios Profesionales, Una Sola Plataforma',
    featuresSub:
      'Haz clic en cualquier módulo para abrir directamente su estudio interactivo.',
    pricingTitle: 'Planes Transparentes y Créditos IA Flexibles',
    pricingSub: 'Empieza gratis con 200 créditos IA. Escala cuando lo necesites.',
    faqTitle: 'Preguntas Frecuentes (FAQ)',
    docsNav: 'Documentación',
    apiNav: 'API y Dev',
    securityNav: 'Seguridad y RGPD',
    legalNav: 'Políticas y Legal',
  },
  fr: {
    badge: 'NEXORA AI 2.0 • Plateforme SaaS Enterprise de Création Multimodale',
    heroTitle1: 'Transformez vos idées en ',
    heroTitleHighlight: 'présentations, e-books de 10 à 500 pages et sites web',
    heroTitle2: " avec l'IA",
    heroSub:
      'Six studios créatifs intégrés : Présentations 16:9, E-books longs avec mémoire éditoriale, Documents Exécutifs, Cartes Mentales, Infographies et Landing Pages.',
    promptPlaceholder:
      "Ex : Créez un e-book de 200 pages sur l'Intelligence Artificielle...",
    ctaCreate: "Générer avec l'IA",
    openStudio: 'Ouvrir la Production',
    featuresTitle: 'Six Studios Professionnels, Une Seule Plateforme',
    featuresSub:
      'Cliquez sur un module pour lancer directement son studio visuel interactif.',
    pricingTitle: 'Forfaits Transparents & Crédits IA Flexibles',
    pricingSub: 'Commencez gratuitement avec 200 crédits IA.',
    faqTitle: 'Questions Fréquentes (FAQ)',
    docsNav: 'Documentation',
    apiNav: 'API & Dev',
    securityNav: 'Sécurité & RGPD',
    legalNav: 'Politiques & Légal',
  },
}

const modules = [
  {
    icon: Presentation,
    title: 'Presentations',
    href: '/presentations/new',
    studioHref: '/presentations',
    editorHref: '/presentations/demo-pres',
    badge: '20 Layouts • 16:9',
    description:
      'Slides widescreen 16:9 com 20 layouts inteligentes, 10 temas WCAG AAA, notas do orador, modo apresentação ecrã inteiro e exportação nativa PPTX e PDF.',
    specs: ['20 Layouts Tipificados', 'Contraste WCAG AAA >= 4.5:1', 'Exportação .PPTX + .PDF 16:9'],
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: BookOpen,
    title: 'Ebook Studio',
    href: '/ebooks/new',
    studioHref: '/ebooks',
    editorHref: '/ebooks/demo-book',
    badge: '10 a 1.000 Páginas',
    description:
      'Motor Longform com arquitetura Partes → Capítulos → Secções, Book Memory persistente, capas vetoriais SVG HD, auditoria de coerência e exportação EPUB 3.0, PDF e DOCX.',
    specs: ['Memória Editorial Persistente', 'Checkpoints por Capítulo', 'Exportação EPUB 3.0 + PDF + DOCX'],
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: FileText,
    title: 'Docs',
    href: '/docs/new',
    studioHref: '/docs',
    editorHref: '/docs/demo-doc',
    badge: '5 Templates B2B',
    description:
      'Relatórios executivos, propostas comerciais, manuais técnicos, playbooks SOP (matriz RACI) e Project Charters formatados em PDF A4, DOCX e Markdown.',
    specs: ['5 Arquétipos Corporativos', 'Comandos Slash IA Contextuais', 'Exportação PDF A4 + DOCX + MD'],
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Brain,
    title: 'Mind Maps',
    href: '/mindmaps/new',
    studioHref: '/mindmaps',
    editorHref: '/mindmaps/demo-mindmap',
    badge: 'Expansão IA • SVG',
    description:
      'Mapas mentais radiais, fluxogramas, organogramas, árvores de decisão e diagramas de arquitetura com curvas Bézier e expansão automática de sub-nós por IA.',
    specs: ['5 Tipos de Diagrama', 'Expansão de Sub-ramos com IA', 'Exportação SVG 1280×840 + MD'],
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: BarChart3,
    title: 'Infographics',
    href: '/infographics/new',
    studioHref: '/infographics',
    editorHref: '/infographics/demo-infographic',
    badge: 'Poster 800×1200',
    description:
      'Posters infográficos verticais com Big Number KPIs, gráficos de barras comparativas, cronologias editoriais, funis de processo e exportação vetorial SVG e PDF.',
    specs: ['Canvas Editorial 800×1200', '7 Tipos de Blocos Visuais', 'Exportação Poster SVG + PDF'],
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: Globe,
    title: 'Nexora Web',
    href: '/websites/new',
    studioHref: '/websites',
    editorHref: '/websites/demo-website',
    badge: 'HTML5 + Bundle ZIP',
    description:
      'Landing pages SaaS, portfólios executivos e websites responsivos (Desktop/Tablet/Mobile) com 9 secções CRO, metadados SEO OpenGraph e pacote estático ZIP.',
    specs: ['9 Secções de Conversão CRO', 'Preview Desktop/Tablet/Mobile', 'Exportação HTML5 + Pacote .ZIP'],
    gradient: 'from-indigo-500 to-blue-600',
  },
]

const comparisonRows = [
  {
    feature: 'E-books Longos Coesos (10 a 500+ páginas)',
    nexora: 'Sim (Motor BookMemory + Partes/Capítulos)',
    slidesTools: 'Não (Apenas slides ou textos curtos)',
    genericChat: 'Não (Perde contexto após ~15 páginas)',
  },
  {
    feature: 'Apresentações Widescreen 16:9 Editáveis (.PPTX)',
    nexora: 'Sim (20 Layouts + 10 Temas WCAG AAA)',
    slidesTools: 'Sim (Limitado a slides)',
    genericChat: 'Não (Apenas texto bruto)',
  },
  {
    feature: 'Documentos Corporativos, Mapas Mentais e Infográficos',
    nexora: 'Sim (Estúdios dedicados integrados)',
    slidesTools: 'Parcial',
    genericChat: 'Não possui canvas visual',
  },
  {
    feature: 'Construtor de Landing Pages com Código HTML5 + ZIP',
    nexora: 'Sim (9 Secções CRO + SEO OpenGraph)',
    slidesTools: 'Não',
    genericChat: 'Código fragmentado sem preview',
  },
  {
    feature: 'Auditoria Editorial Anti-Repetição & Checkpoints',
    nexora: 'Sim (Score 0–100 + Versões PostgreSQL)',
    slidesTools: 'Não',
    genericChat: 'Não',
  },
  {
    feature: 'Direitos Comerciais 100% do Utilizador & Zero-Training',
    nexora: 'Sim (Garantia Contratual DPA / RGPD)',
    slidesTools: 'Variável por plano',
    genericChat: 'Treina modelos por defeito em planos base',
  },
]

const creditOperations = [
  { op: 'Geração de Apresentação Completa (8–20 slides)', code: 'PRESENTATION_GENERATE', cost: '15 créditos', studio: 'Presentations' },
  { op: 'Redesenho ou Reescrita IA de Slide Individual', code: 'PRESENTATION_SLIDE_AI', cost: '2 créditos', studio: 'Presentations' },
  { op: 'Plano Editorial Completo de E-book (Partes + Capítulos)', code: 'EBOOK_OUTLINE', cost: '10 créditos', studio: 'Ebook Studio' },
  { op: 'Escrita de Capítulo Longform com BookMemory', code: 'EBOOK_CHAPTER_WRITE', cost: '8 créditos', studio: 'Ebook Studio' },
  { op: 'Geração de Capa Vetorial HD (5 Estilos Editoriais)', code: 'EBOOK_COVER_HD', cost: '5 créditos', studio: 'Ebook Studio' },
  { op: 'Auditoria Global de Coerência & Anti-Repetição', code: 'EBOOK_AUDIT', cost: '6 créditos', studio: 'Ebook Studio' },
  { op: 'Geração de Documento Executivo / Proposta A4', code: 'DOC_GENERATE', cost: '10 créditos', studio: 'Docs' },
  { op: 'Comando Editorial IA Contextual (Expandir / Resumir / Traduzir)', code: 'DOC_AI_COMMAND', cost: '2 créditos', studio: 'Docs' },
  { op: 'Geração de Mapa Mental ou Fluxograma Completo', code: 'MINDMAP_GENERATE', cost: '8 créditos', studio: 'Mind Maps' },
  { op: 'Expansão Automática de Sub-Ramos por IA', code: 'MINDMAP_EXPAND_NODE', cost: '2 créditos', studio: 'Mind Maps' },
  { op: 'Geração de Poster Infográfico 800×1200', code: 'INFOGRAPHIC_GENERATE', cost: '12 créditos', studio: 'Infographics' },
  { op: 'Geração de Website / Landing Page Completa (9 Secções)', code: 'WEBSITE_GENERATE', cost: '20 créditos', studio: 'Nexora Web' },
]

const plans = [
  {
    name: 'Free Starter',
    priceMonthly: '€0',
    priceYearly: '€0',
    period: '/mês',
    credits: '200',
    features: [
      '200 créditos IA mensais renováveis',
      'Acesso imediato aos 6 estúdios criativos',
      'E-books até 20 páginas com BookMemory',
      'Biblioteca de templates essenciais',
      'Exportação nativa PDF e Markdown',
    ],
    cta: 'Começar Grátis',
    href: '/dashboard',
    highlight: false,
  },
  {
    name: 'Creator Starter',
    priceMonthly: '€15',
    priceYearly: '€12',
    period: '/mês',
    credits: '1.000',
    features: [
      '1.000 créditos IA mensais',
      'E-books até 100 páginas',
      'Exportação PDF, DOCX e PPTX editável',
      'Sem marca de água NEXORA AI',
      'Histórico de versões reversível (30 dias)',
    ],
    cta: 'Escolher Starter',
    href: '/credits',
    highlight: false,
  },
  {
    name: 'Pro Studio',
    priceMonthly: '€39',
    priceYearly: '€31',
    period: '/mês',
    credits: '3.500',
    features: [
      '3.500 créditos IA mensais + Top-ups',
      'E-books longos até 500 páginas',
      'Todos os 8 formatos: PDF, DOCX, PPTX, EPUB 3.0, SVG, HTML5/ZIP',
      'Capas editoriais HD e Brand Kit personalizado',
      'Acesso à API REST v1 e Webhooks',
    ],
    cta: 'Começar Pro Studio',
    href: '/credits',
    highlight: true,
  },
  {
    name: 'Enterprise Cloud',
    priceMonthly: '€129',
    priceYearly: '€103',
    period: '/mês',
    credits: '15.000',
    features: [
      '15.000 créditos IA partilhados na equipa',
      'E-books até 1.000 páginas em fila dedicada',
      'Governança Multi-Tenant, SSO & RBAC (Owner/Admin/Editor/Viewer)',
      'Logs de auditoria imutáveis & Acordo DPA/RGPD',
      'SLA contratual 99.9% e Gestor de Conta 24/7',
    ],
    cta: 'Ativar Enterprise',
    href: '/credits',
    highlight: false,
  },
]

const testimonials = [
  {
    quote:
      'Produzimos um livro técnico de 240 páginas com 18 capítulos coesos e exportámos diretamente em EPUB 3.0 e PDF editorial em menos de uma tarde.',
    author: 'Dr. Henrique Vasconcelos',
    role: 'Diretor Editorial & Autor',
    company: 'Edições Atlântico',
  },
  {
    quote:
      'Substituímos 4 ferramentas diferentes pela NEXORA AI. A nossa equipa comercial gera apresentações 16:9, propostas DOCX e landing pages num único workspace.',
    author: 'Camille Laurent',
    role: 'VP of Revenue Operations',
    company: 'ScaleUp Paris',
  },
  {
    quote:
      'O motor de design com validação de contraste WCAG AAA e exportação nativa PPTX/SVG poupa dezenas de horas semanais aos nossos consultores.',
    author: 'Marco Silva',
    role: 'Managing Partner',
    company: 'Vanguard Strategy Group',
  },
]

const faqs = [
  {
    q: 'Como funciona o motor de E-books de 10 a 500+ páginas sem perder coerência?',
    a: 'O NEXORA Longform Writing Engine divide a obra em Partes, Capítulos e Secções, mantendo uma Memória Editorial Persistente (BookMemory) com conceitos introduzidos, glossário terminológico, estilo narrativo, resumos acumulados e checkpoints automáticos no PostgreSQL a cada capítulo gerado.',
  },
  {
    q: 'Quais são os 8 formatos oficiais de exportação suportados?',
    a: 'Suportamos 8 formatos nativos prontos para uso comercial: PDF (A4 Editorial, Widescreen 16:9 e Poster), Microsoft Word (.docx), PowerPoint (.pptx), EPUB 3.0 padrão internacional (Apple Books, Kindle, Kobo), SVG Vetorial, Markdown (.md), HTML5 autónomo e Pacote Estático (.zip).',
  },
  {
    q: 'Quem detém os direitos autorais e comerciais sobre o conteúdo gerado?',
    a: 'Tu e a tua organização detêm 100% dos direitos patrimoniais, autorais e comerciais sobre todas as apresentações, livros, documentos, infográficos, mapas mentais e websites gerados na plataforma, podendo comercializá-los livremente (incluindo Amazon KDP, clientes B2B e distribuição corporativa).',
  },
  {
    q: 'Os meus documentos e dados confidenciais são usados para treinar modelos de IA públicos?',
    a: 'Nunca. A NEXORA AI 2.0 aplica uma política estrita de Zero-Training: os teus prompts, anexos, documentos e livros são processados em isolamento multi-tenant encriptado (AES-256 em repouso e TLS 1.3 em trânsito) e jamais são utilizados para treinar LLMs de terceiros.',
  },
  {
    q: 'Como funciona o sistema de Créditos IA e a proteção contra falhas?',
    a: 'Cada operação possui um custo transparente e fixo (ex: 8 créditos por capítulo longo, 15 créditos por apresentação completa). O nosso Transactional Credit Ledger reserva os créditos antes da execução e efetua estorno automático (rollback) caso ocorra qualquer interrupção de rede.',
  },
  {
    q: 'A plataforma disponibiliza Documentação Técnica e API REST para integração?',
    a: 'Sim! Nesta mesma página encontras o Centro de Documentação Técnica e a Referência da API REST v1 (/api/v1/ebooks, /api/v1/presentations, /api/v1/docs, /api/v1/mindmaps, /api/v1/infographics, /api/v1/websites, /api/v1/billing) com autenticação Bearer JWT e Webhooks idempotentes.',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('pt')
  const [promptText, setPromptText] = useState('')
  const [selectedStudio, setSelectedStudio] = useState('/presentations/new')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [activeDocTab, setActiveDocTab] = useState<DocTab>('quickstart')
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab>('terms')

  const t = COPY[lang]
  const year = new Date().getFullYear()

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(selectedStudio)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-violet-600 selection:text-white">
      {/* Top Enterprise Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-blue-900 text-white text-xs py-2 px-4 text-center font-medium">
        <span className="inline-flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-white/15 font-bold uppercase tracking-wider text-[10px]">
            Release 2.0 LTS
          </span>
          <span>
            6 Estúdios Criativos • Motor Longform 10–1.000 Páginas • Conformidade RGPD, SOC 2 Type II & WCAG AAA
          </span>
          <a href="#docs" className="underline font-bold hover:text-cyan-300 ml-1">
            Ler Documentação →
          </a>
        </span>
      </div>

      {/* Top Sticky Navbar */}
      <header className="sticky inset-x-0 top-0 z-50 h-16 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-black text-base shadow-md">
              N
            </div>
            <div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent block leading-none">
                NEXORA AI 2.0
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                Enterprise Creative Suite
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs xl:text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              6 Estúdios
            </a>
            <a href="#longform" className="hover:text-foreground transition-colors">
              Motor 10–500p
            </a>
            <a href="#comparison" className="hover:text-foreground transition-colors">
              Comparativo
            </a>
            <a href="#docs" className="hover:text-foreground transition-colors flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-violet-500" />
              {t.docsNav}
            </a>
            <a href="#security" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              {t.securityNav}
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#legal" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-blue-500" />
              {t.legalNav}
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center bg-muted p-1 rounded-lg border border-border">
              {(['pt', 'en', 'es', 'fr'] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2 py-0.5 rounded text-xs font-bold uppercase transition-all ${
                    lang === code
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-border text-foreground hover:border-violet-500 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-violet-500" />
              {t.openStudio}
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90 transition-opacity shadow-md"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            {t.badge}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 tracking-tight">
            {t.heroTitle1}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
            {t.heroTitle2}
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {t.heroSub}
          </p>

          {/* Interactive Prompt Creation Bar */}
          <form onSubmit={handleHeroSubmit} className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-2xl border-2 border-border bg-card shadow-xl focus-within:border-violet-500 transition-colors">
              <select
                value={selectedStudio}
                onChange={(e) => setSelectedStudio(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold border border-border outline-none"
              >
                <option value="/presentations/new">📊 Apresentação 16:9</option>
                <option value="/ebooks/new">📚 E-book (10–500+ págs)</option>
                <option value="/docs/new">📄 Documento / Proposta</option>
                <option value="/mindmaps/new">🧠 Mapa Mental / Fluxo</option>
                <option value="/infographics/new">📈 Infográfico 800×1200</option>
                <option value="/websites/new">🌐 Landing Page / Site</option>
              </select>

              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={t.promptPlaceholder}
                className="flex-1 px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                {t.ctaCreate}
              </button>
            </div>
          </form>

          {/* Direct Studio Quick Actions */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {[
              { label: 'Criar apresentação', href: '/presentations/new' },
              { label: 'Criar e-book', href: '/ebooks/new' },
              { label: 'Criar documento', href: '/docs/new' },
              { label: 'Criar mapa mental', href: '/mindmaps/new' },
              { label: 'Criar infográfico', href: '/infographics/new' },
              { label: 'Criar website', href: '/websites/new' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-border bg-card/60 text-foreground hover:border-violet-500 hover:text-violet-500 transition-all shadow-sm"
              >
                + {action.label}
              </Link>
            ))}
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
            {[
              { v: '6 Estúdios', l: 'Integrados numa só Conta' },
              { v: '1.000 Págs', l: 'Capacidade Máxima Longform' },
              { v: '8 Formatos', l: 'PDF, PPTX, EPUB 3, DOCX, SVG, ZIP' },
              { v: '99.9% SLA', l: 'Arquitetura Multi-Tenant Segura' },
            ].map((stat) => (
              <div
                key={stat.v}
                className="p-4 rounded-2xl border border-border bg-card/70 text-center"
              >
                <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.v}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Modules Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-500">
              Ecossistema Completo de Produção
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-3">
              {t.featuresTitle}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.featuresSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <div
                  key={mod.title}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-violet-500/60 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${mod.gradient} shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                        {mod.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      NEXORA {mod.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {mod.description}
                    </p>
                    <ul className="space-y-1.5 mb-6">
                      {mod.specs.map((s) => (
                        <li key={s} className="text-xs text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
                    <Link
                      href={mod.href}
                      className="py-2 px-3 rounded-xl bg-violet-600/10 hover:bg-violet-600 text-violet-500 hover:text-white text-xs font-bold text-center transition-all"
                    >
                      + Gerar Novo
                    </Link>
                    <Link
                      href={mod.editorHref}
                      className="py-2 px-3 rounded-xl border border-border hover:border-violet-500 text-xs font-semibold text-foreground text-center transition-all"
                    >
                      Abrir Editor Ao Vivo
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why NEXORA & Longform Engine */}
      <section id="longform" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">
                Tecnologia Exclusiva NEXORA Longform & Design Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-6">
                Arquitetura de Memória Editorial para Obras de 10 a 1.000 Páginas
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: Zap,
                    title: 'Hierarquia Livro → Partes → Capítulos → Secções',
                    desc: 'Ao contrário de LLMs comuns que colapsam após alguns parágrafos, o motor NEXORA orquestra a geração capítulo a capítulo em fila BullMQ, alimentando cada novo capítulo com a BookMemory acumulada.',
                  },
                  {
                    icon: Shield,
                    title: 'Auditoria Editorial Automática & Anti-Repetição',
                    desc: 'Algoritmo integrado que analisa densidade de vocabulário, capítulos curtos, repetição de conceitos e coerência estilística, atribuindo um Score de Qualidade Editorial (0–100).',
                  },
                  {
                    icon: Star,
                    title: '20 Layouts Inteligentes & Validação Matemática WCAG AAA',
                    desc: 'No estúdio de apresentações, cada slide é validado segundo a fórmula de luminância relativa W3C para garantir rácios de contraste >= 4.5:1 e >= 7.0:1.',
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/20 via-card to-blue-950/20 p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                  NEXORA Longform Writing Engine • Pipeline
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                  EPUB 3.0 + PDF + DOCX
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { text: 'Etapa A & B — Plano Editorial (6 Partes, 30 Capítulos) ✓', done: true },
                  { text: 'Capítulo 1 a 28 — Escrita Incremental & BookMemory ✓', done: true },
                  { text: 'Auditoria Global de Coerência & Anti-Repetição (96/100) ✓', done: true },
                  { text: 'Geração de Capa Vetorial HD (5 Estilos Editoriais) ✓', done: true },
                  { text: 'Paginação Final, Sumário Automático & Empacotamento EPUB 3.0...', done: false },
                ].map((step) => (
                  <div
                    key={step.text}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      step.done
                        ? 'bg-background/80 border-border'
                        : 'bg-violet-500/10 border-violet-500/40'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        step.done ? 'bg-emerald-500' : 'bg-violet-500 animate-pulse'
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Meta: 500 Páginas (~125.000 palavras)</span>
                  <span className="font-bold text-foreground">94% Concluído</span>
                </div>
                <div className="h-2.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Checkpoint PostgreSQL: #v28-auto</span>
                <Link href="/ebooks/demo-book" className="text-violet-500 font-bold hover:underline">
                  Testar Editor de E-books →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Benchmark Matrix */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/20 border-y border-border">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-500">
              Benchmark Comparativo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              NEXORA AI 2.0 vs. Ferramentas Tradicionais
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Por que equipas de produto, consultoras e editoras consolidam a sua stack criativa na NEXORA.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-4 px-5 font-bold">Capacidade / Funcionalidade</th>
                  <th className="py-4 px-5 font-extrabold text-violet-500 bg-violet-500/5">
                    NEXORA AI 2.0
                  </th>
                  <th className="py-4 px-5 font-bold">Geradores de Slides (ex: Gamma/Tome)</th>
                  <th className="py-4 px-5 font-bold">Chatbots Genéricos (ChatGPT/Claude)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm">
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="hover:bg-accent/30 transition-colors">
                    <td className="py-4 px-5 font-semibold text-foreground">{row.feature}</td>
                    <td className="py-4 px-5 font-bold text-emerald-500 bg-violet-500/5">
                      ✓ {row.nexora}
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">{row.slidesTools}</td>
                    <td className="py-4 px-5 text-muted-foreground">{row.genericChat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE DOCUMENTATION & DEVELOPER HUB */}
      <section id="docs" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-violet-500">
              <Terminal className="w-4 h-4" />
              Centro Oficial de Documentação & Engenharia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              Documentação Completa da Plataforma & Referência de API
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto mt-2">
              Tudo o que precisas para dominar os 6 estúdios criativos, configurar o motor editorial Longform, auditar o consumo de créditos e integrar a API REST v1 nos teus sistemas.
            </p>
          </div>

          {/* Documentation Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'quickstart' as DocTab, label: '1. Guia de Início Rápido', icon: Zap },
              { id: 'studios' as DocTab, label: '2. Manual dos 6 Estúdios', icon: Layers },
              { id: 'longform' as DocTab, label: '3. Arquitetura BookMemory (500p)', icon: Database },
              { id: 'api' as DocTab, label: '4. Referência API REST v1 & Webhooks', icon: Code2 },
              { id: 'credits' as DocTab, label: '5. Tabela Oficial de Custos de Créditos', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeDocTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDocTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md'
                      : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:border-violet-500/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Documentation Tab Content Panel */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl">
            {activeDocTab === 'quickstart' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-2xl font-extrabold text-foreground">
                    Guia Rápido: Da Ideia à Exportação Final em 3 Minutos
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A arquitetura do <strong>NEXORA AI 2.0</strong> foi desenhada para eliminar configurações manuais de formatação. Segue o fluxo padrão de 4 etapas em qualquer um dos 6 estúdios:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        step: 'Passo 01',
                        title: 'Briefing & Parâmetros Estruturais',
                        desc: 'Seleciona o estúdio (Apresentação, E-book, Documento, Mapa Mental, Infográfico ou Website), define o tema, o público-alvo, o tom editorial e o idioma nativo (PT, EN, ES ou FR).',
                      },
                      {
                        step: 'Passo 02',
                        title: 'Geração de Outline / Estrutura com IA',
                        desc: 'Antes de redigir o conteúdo final, o motor propõe o índice estruturado (ex: capítulos do livro ou sequência de slides 16:9) para aprovação ou ajuste fino.',
                      },
                      {
                        step: 'Passo 03',
                        title: 'Edição Visual & Comandos Contextuais',
                        desc: 'Usa o editor visual com assistência IA inline: expandir secção, resumir executivo, reescrever tom, traduzir idioma, adicionar nó ou trocar tema visual em 1 clique.',
                      },
                      {
                        step: 'Passo 04',
                        title: 'Validação de Qualidade & Exportação Multi-Formato',
                        desc: 'Executa a auditoria automática (contraste WCAG AAA ou coerência BookMemory) e descarrega nos 8 formatos oficiais (PDF, PPTX, EPUB 3.0, DOCX, SVG, MD, HTML5, ZIP).',
                      },
                    ].map((s) => (
                      <div key={s.step} className="p-4 rounded-2xl border border-border bg-background/60">
                        <span className="text-xs font-extrabold text-violet-500 uppercase">
                          {s.step}
                        </span>
                        <h4 className="font-bold text-foreground mt-1 mb-1.5 text-sm">{s.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="font-bold text-foreground text-base mb-2">
                      Requisitos & Ambiente Suportado
                    </h4>
                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        Navegadores modernos (Chrome 110+, Edge, Safari, Firefox)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        Auto-save transacional em PostgreSQL a cada alteração
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        Compatibilidade Microsoft PowerPoint, Word, Apple Books & Kindle
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        Suporte nativo a 4 idiomas: Português, Inglês, Espanhol e Francês
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold text-center"
                    >
                      Aceder à Área de Produção →
                    </Link>
                    <Link
                      href="/templates"
                      className="block w-full py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-semibold text-center hover:border-violet-500"
                    >
                      Explorar Galeria de Templates
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeDocTab === 'studios' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-extrabold text-foreground">
                  Especificações Técnicas dos 6 Estúdios Criativos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    {
                      name: '1. NEXORA Presentations',
                      desc: 'Motor de slides 16:9 (1280×720px) com 20 layouts semânticos (Cover, Big Numbers, SWOT, Timeline, Comparison, Pricing, Funnel, Quote, etc.) e 10 temas profissionais com auditoria de contraste WCAG AAA.',
                      formats: 'Exportação: .PPTX (PptxGenJS) e .PDF Widescreen',
                      link: '/presentations/demo-pres',
                    },
                    {
                      name: '2. NEXORA Ebook Studio',
                      desc: 'Projetado para obras completas de 10 a 1.000 páginas. Gere Índice, Prefácio, Partes, Capítulos, Conclusão, Glossário, Bibliografia e 5 estilos de Capas Vetoriais SVG de alta resolução.',
                      formats: 'Exportação: .PDF Editorial, .EPUB 3.0 e .DOCX',
                      link: '/ebooks/demo-book',
                    },
                    {
                      name: '3. NEXORA Docs',
                      desc: 'Cinco arquétipos corporativos: Relatório Executivo, Proposta Comercial B2B, Manual Técnico de Engenharia, Playbook SOP (com Matriz RACI) e Project Charter PMI.',
                      formats: 'Exportação: .PDF A4, .DOCX e Markdown (.MD)',
                      link: '/docs/demo-doc',
                    },
                    {
                      name: '4. NEXORA Mind Maps',
                      desc: 'Motor gráfico hierárquico para Mapas Mentais Radiais, Organogramas, Fluxogramas, Árvores de Decisão e Mapas de Arquitetura com ligações curvas Bézier e expansão IA por nó.',
                      formats: 'Exportação: Vetor .SVG (1280×840) e Outline .MD',
                      link: '/mindmaps/demo-mindmap',
                    },
                    {
                      name: '5. NEXORA Infographics',
                      desc: 'Canvas vertical 800×1200px com 7 blocos visuais especializados: Hero Banner, Big Number KPIs, Gráficos de Barras, Process Flow, Comparativo Lado a Lado, Timeline e Callout Footer.',
                      formats: 'Exportação: Poster .SVG Vetorial e Poster .PDF',
                      link: '/infographics/demo-infographic',
                    },
                    {
                      name: '6. NEXORA Web',
                      desc: 'Construtor de Websites e Landing Pages orientadas à conversão (CRO) com 9 secções estruturadas, pré-visualização responsiva Desktop/Tablet/Mobile e metadados SEO OpenGraph.',
                      formats: 'Exportação: HTML5 Autónomo e Bundle .ZIP Completo',
                      link: '/websites/demo-website',
                    },
                  ].map((st) => (
                    <div key={st.name} className="p-5 rounded-2xl border border-border bg-background/60 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-bold text-foreground text-base mb-2">{st.name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{st.desc}</p>
                        <p className="text-[11px] font-bold text-violet-500">{st.formats}</p>
                      </div>
                      <Link
                        href={st.link}
                        className="text-xs font-bold text-foreground hover:text-violet-500 flex items-center gap-1"
                      >
                        Abrir Editor deste Estúdio →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDocTab === 'longform' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-foreground">
                    Arquitetura do Motor Longform & `BookMemory`
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Para superar o limite de janela de contexto dos modelos de linguagem na geração de livros de <strong>100 a 1.000 páginas</strong>, a NEXORA AI 2.0 implementa um protocolo de estado persistente chamado <code>BookMemory</code>:
                  </p>
                  <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Resumo Cumulativo (Rolling Chapter Summaries):</strong> Ao concluir o Capítulo $N$, o motor extrai automaticamente uma síntese executiva e os conceitos introduzidos, injetando-os no contexto do Capítulo $N+1$.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Glossário & Registo de Entidades:</strong> Garante que termos técnicos, siglas ou personagens mantêm exatamente a mesma grafia e definição do Capítulo 1 até ao Capítulo 50.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Detetor de Redundância Semântica:</strong> Audita capítulos adjacentes para impedir parágrafos repetitivos ou conclusões duplicadas.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Checkpoints Atómicos (`ProjectVersion`):</strong> Cada capítulo gerado grava um snapshot no PostgreSQL permitindo restauro instantâneo (Rollback) em caso de edição.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-slate-950 text-slate-100 p-6 font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="text-violet-400 font-bold mb-2">
                    // Estrutura Persistente BookMemory (PostgreSQL JSONB)
                  </div>
                  <pre className="leading-relaxed text-[11px] text-slate-300">{`{
  "bookId": "ebk_99482_enterprise_ai",
  "targetPages": 350,
  "tone": "Executivo, Analítico e Pragmático",
  "styleRules": [
    "Usar exemplos reais de arquitetura SaaS",
    "Incluir quadros-resumo no final de cada capítulo"
  ],
  "glossary": {
    "BookMemory": "Motor de estado editorial persistente da NEXORA",
    "RAG Híbrido": "Combinação de busca vetorial pgvector e BM25"
  },
  "coveredConcepts": [
    "Cap 1: Fundamentos de LLMs e Janelas de Contexto",
    "Cap 2: Orquestração Multi-Agente com Filas Assíncronas"
  ],
  "auditScore": 96,
  "lastCheckpointVersion": 18
}`}</pre>
                </div>
              </div>
            )}

            {activeDocTab === 'api' && (
              <div id="api" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-foreground">
                    Referência da API REST v1 & Webhooks
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Todos os 6 estúdios criativos e o motor de créditos estão acessíveis programaticamente via API RESTful autenticada com <code>Bearer JWT</code> e validação estrita de schemas.
                  </p>
                  <div className="space-y-2 text-xs font-mono">
                    {[
                      { method: 'GET', path: '/api/v1/health', desc: 'Estado global, 6 estúdios e 8 exportadores' },
                      { method: 'POST', path: '/api/v1/ebooks/create', desc: 'Cria projeto de E-book com Plano Editorial' },
                      { method: 'POST', path: '/api/v1/ebooks/:id/generate-all', desc: 'Gera todos os capítulos com BookMemory' },
                      { method: 'GET', path: '/api/v1/ebooks/:id/export?format=epub', desc: 'Exporta em PDF, EPUB 3.0 ou DOCX' },
                      { method: 'POST', path: '/api/v1/presentations/generate', desc: 'Gera apresentação 16:9 com 20 layouts' },
                      { method: 'POST', path: '/api/v1/docs/generate', desc: 'Gera Documento Executivo / Proposta A4' },
                      { method: 'POST', path: '/api/v1/mindmaps/generate', desc: 'Gera Mapa Mental / Fluxograma SVG' },
                      { method: 'POST', path: '/api/v1/infographics/generate', desc: 'Gera Poster Infográfico 800×1200' },
                      { method: 'POST', path: '/api/v1/websites/generate', desc: 'Gera Landing Page HTML5 + Bundle ZIP' },
                      { method: 'POST', path: '/api/v1/billing/webhooks/stripe', desc: 'Webhook Stripe idempotente assinado' },
                    ].map((ep) => (
                      <div key={ep.path} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-background/70">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              ep.method === 'GET'
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-violet-500/15 text-violet-500'
                            }`}
                          >
                            {ep.method}
                          </span>
                          <span className="font-bold text-foreground">{ep.path}</span>
                        </div>
                        <span className="text-muted-foreground font-sans text-[11px] hidden sm:inline">
                          {ep.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950 text-slate-100 p-6 font-mono text-xs overflow-x-auto border border-slate-800 space-y-4">
                  <div className="text-cyan-400 font-bold">
                    // Exemplo cURL: Gerar Apresentação Executiva 16:9 e Exportar PPTX
                  </div>
                  <pre className="leading-relaxed text-[11px] text-slate-300">{`curl -X POST https://api.nexora.ai/api/v1/presentations/generate \\
  -H "Authorization: Bearer nx_live_98a7bc654321" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Plano de Expansão Internacional 2027",
    "slideCount": 12,
    "themeId": "executive-dark",
    "language": "pt",
    "audience": "Conselho de Administração"
  }'

# Resposta HTTP 201 Created:
{
  "id": "pres_01J9X8A7B6",
  "title": "Plano de Expansão Internacional 2027",
  "slideCount": 12,
  "wcagContrastAudit": { "passed": true, "minRatio": 8.4 },
  "exports": {
    "pptx": "/api/v1/presentations/pres_01J9X8A7B6/export?format=pptx",
    "pdf": "/api/v1/presentations/pres_01J9X8A7B6/export?format=pdf"
  }
}`}</pre>
                </div>
              </div>
            )}

            {activeDocTab === 'credits' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-extrabold text-foreground">
                      Tabela Oficial de Custos de Créditos IA (Ledger Transacional)
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Cada operação debita exatamente os valores tabelados abaixo. As exportações (PDF, PPTX, EPUB 3.0, DOCX, SVG, HTML5, ZIP) são 100% gratuitas e ilimitadas.
                    </p>
                  </div>
                  <Link
                    href="/credits"
                    className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold whitespace-nowrap self-start"
                  >
                    Abrir Painel de Créditos →
                  </Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/60 text-muted-foreground uppercase text-[11px]">
                        <th className="py-3.5 px-4 font-bold">Operação de IA</th>
                        <th className="py-3.5 px-4 font-bold">Código Interno Ledger</th>
                        <th className="py-3.5 px-4 font-bold">Estúdio</th>
                        <th className="py-3.5 px-4 font-bold text-right">Custo Unitário</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {creditOperations.map((item) => (
                        <tr key={item.code} className="hover:bg-accent/20">
                          <td className="py-3 px-4 font-medium text-foreground">{item.op}</td>
                          <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{item.code}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.studio}</td>
                          <td className="py-3 px-4 font-extrabold text-violet-500 text-right">{item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ENTERPRISE SECURITY, TRUST & COMPLIANCE CENTER */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-500">
              <Lock className="w-4 h-4" />
              Segurança Enterprise, Governança & Conformidade
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              Arquitetura Blindada para Dados Corporativos e Propriedade Intelectual
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-2">
              Desenvolvido desde a Fase 0 com isolamento multi-tenant, encriptação ponta-a-ponta e conformidade regulamentar europeia e internacional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                badge: 'RGPD / GDPR & LGPD',
                title: 'Proteção de Dados Europeia',
                desc: 'Alojamento opcional na União Europeia (Frankfurt/Dublin), Direito ao Esquecimento automatizado, Portabilidade total e Acordo de Processamento de Dados (DPA) incluído.',
              },
              {
                icon: Lock,
                badge: 'Zero-Training Policy',
                title: 'Privacidade Absoluta de IA',
                desc: 'Os teus prompts, documentos, livros e dados estratégicos NUNCA são usados para treinar modelos públicos (OpenAI, Anthropic, Google). Propriedade intelectual 100% blindada.',
              },
              {
                icon: Server,
                badge: 'AES-256 + TLS 1.3',
                title: 'Isolamento Multi-Tenant & RBAC',
                desc: 'Controlo de acesso baseado em funções (Owner, Admin, Editor, Viewer), cabeçalhos de segurança CSP/HSTS, rate-limiting por utilizador e logs de auditoria imutáveis.',
              },
              {
                icon: Award,
                badge: 'WCAG 2.1 AAA & ISO',
                title: 'Acessibilidade & Disponibilidade',
                desc: 'Motor gráfico com verificação matemática de contraste WCAG AAA, backups contínuos Point-in-Time no PostgreSQL e SLA de 99.9% de uptime monitorizado.',
              },
            ].map((sec) => {
              const Icon = sec.icon
              return (
                <div key={sec.title} className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                      {sec.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base">{sec.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{sec.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              A Escolha de Equipas Editoriais, Consultoras e Criadores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4"
              >
                <p className="text-sm text-foreground italic leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-sm text-foreground">{item.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.role} • {item.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/20 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              {t.pricingTitle}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">{t.pricingSub}</p>

            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Faturação Mensal
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Faturação Anual (Poupa 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border-2 p-6 flex flex-col justify-between ${
                  plan.highlight
                    ? 'border-violet-500 bg-gradient-to-b from-violet-950/25 to-card shadow-xl'
                    : 'border-border bg-card'
                }`}
              >
                <div>
                  {plan.highlight && (
                    <p className="text-xs font-bold text-violet-400 uppercase tracking-wide mb-2">
                      ⭐ Mais Escolhido
                    </p>
                  )}
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-2 mb-1">
                    <span className="text-4xl font-black text-foreground">
                      {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs font-semibold text-violet-400 mb-5">
                    {plan.credits} créditos IA / mês
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={plan.href}
                  className={`block w-full py-2.5 text-xs sm:text-sm font-bold rounded-xl text-center transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90 shadow-md'
                      : 'border border-border bg-secondary text-foreground hover:border-violet-500'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-violet-500" />
              {t.faqTitle}
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-card p-5 cursor-pointer"
              >
                <summary className="font-bold text-sm sm:text-base text-foreground flex items-center justify-between list-none">
                  <span>{item.q}</span>
                  <span className="text-violet-500 font-bold text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLETE LEGAL, PRIVACY, TERMS & COMPLIANCE POLICIES HUB */}
      <section id="legal" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-500">
              <FileCheck2 className="w-4 h-4" />
              Centro Jurídico, Governança & Políticas Oficiais
            </span>
            <h2 className="text-3xl font-extrabold text-foreground mt-2">
              Políticas de Privacidade, Termos de Serviço, Cookies, DPA & Ética de IA
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto mt-1">
              Transparência jurídica integral em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD / UE 2016/679), LGPD e EU AI Act.
            </p>
          </div>

          {/* Legal Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { id: 'terms' as LegalTab, label: 'Termos de Serviço & Licença Comercial' },
              { id: 'privacy' as LegalTab, label: 'Política de Privacidade & RGPD' },
              { id: 'dpa' as LegalTab, label: 'Acordo de Processamento de Dados (DPA)' },
              { id: 'cookies' as LegalTab, label: 'Política de Cookies & Telemetria' },
              { id: 'ai_ethics' as LegalTab, label: 'Política de Uso Aceitável & Direitos de IA' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveLegalTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeLegalTab === tab.id
                    ? 'bg-foreground text-background shadow'
                    : 'border border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-4">
            {activeLegalTab === 'terms' && (
              <>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-extrabold text-foreground">
                    1. Termos de Serviço & Licença de Utilização Comercial (NEXORA AI 2.0)
                  </h3>
                  <span className="text-[11px] font-mono text-violet-500">Versão 2.0 • Em vigor</span>
                </div>
                <p>
                  <strong>1.1. Objeto e Aceitação:</strong> Os presentes Termos de Serviço regulam o acesso e a utilização da plataforma SaaS <strong>NEXORA AI 2.0</strong>, incluindo os seus 6 estúdios criativos (Presentations, Ebook Studio, Docs, Mind Maps, Infographics e Nexora Web), APIs e motores de exportação.
                </p>
                <p>
                  <strong>1.2. Titularidade Plena e Direitos Comerciais (100% Ownership):</strong> O Utilizador (ou a Organização subscritora) conserva a titularidade integral sobre todos os dados de entrada (prompts, documentos anexados, marcas) e adquire <strong>100% dos direitos patrimoniais, autorais e de exploração comercial</strong> sobre os outputs gerados (livros, e-books EPUB/PDF, apresentações PPTX, documentos DOCX, infográficos SVG e websites HTML5/ZIP), podendo publicá-los, vendê-los (inclusive na Amazon KDP ou a clientes finais) sem pagamento de royalties à NEXORA AI.
                </p>
                <p>
                  <strong>1.3. Sistema de Créditos, Subscrições e Reembolsos:</strong> Os planos mensais e anuais atribuem uma franquia de créditos IA. Operações interrompidas por falha técnica sofrem estorno automático pelo <em>Transactional Credit Ledger</em>. O cancelamento da subscrição pode ser efetuado a qualquer momento no painel <code>/credits</code> sem penalização.
                </p>
                <p>
                  <strong>1.4. Nível de Serviço (SLA):</strong> Para clientes Pro Studio e Enterprise Cloud, a NEXORA AI garante uma disponibilidade mensal de 99.9%, com janelas de manutenção programada notificadas com 48 horas de antecedência.
                </p>
              </>
            )}

            {activeLegalTab === 'privacy' && (
              <>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-extrabold text-foreground">
                    2. Política de Privacidade & Conformidade RGPD (UE 2016/679) e LGPD
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-500">Conformidade RGPD / GDPR</span>
                </div>
                <p>
                  <strong>2.1. Responsável pelo Tratamento e Minimização de Dados:</strong> A NEXORA AI recolhe apenas os dados estritamente necessários para a autenticação, faturação e prestação dos serviços criativos (nome, e-mail profissional, identificadores da organização e metadados de projetos).
                </p>
                <p>
                  <strong>2.2. Garantia Zero-Training em Modelos de IA:</strong> Nenhum conteúdo submetido ou gerado pelos utilizadores na NEXORA AI 2.0 é utilizado para treinar, ajustar (fine-tune) ou melhorar modelos de linguagem de terceiros ou públicos. Todas as chamadas aos provedores de inferência são realizadas sob contratos empresariais de retenção zero (<em>Zero Data Retention API</em>).
                </p>
                <p>
                  <strong>2.3. Direitos dos Titulares dos Dados:</strong> Nos termos dos artigos 15.º a 22.º do RGPD, o utilizador pode, a qualquer momento a partir de <code>/settings</code>, exercer os direitos de Acesso, Retificação, Exportação Integral em formato aberto (Portabilidade) e Eliminação Definitiva (Direito ao Esquecimento) de todos os projetos e versões armazenados.
                </p>
                <p>
                  <strong>2.4. Segurança e Encriptação:</strong> Os dados em repouso na base de dados PostgreSQL e no armazenamento de objetos S3/R2 são encriptados com <strong>AES-256</strong>, e todas as comunicações em trânsito utilizam <strong>TLS 1.3</strong> com HSTS ativo.
                </p>
              </>
            )}

            {activeLegalTab === 'dpa' && (
              <>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-extrabold text-foreground">
                    3. Acordo de Processamento de Dados (Data Processing Addendum — DPA)
                  </h3>
                  <span className="text-[11px] font-mono text-blue-500">Artigo 28.º do RGPD</span>
                </div>
                <p>
                  <strong>3.1. Papéis das Partes:</strong> No âmbito de contas corporativas e multi-tenant, a Organização Cliente atua como <em>Responsável pelo Tratamento (Controller)</em> e a NEXORA AI 2.0 atua exclusivamente como <em>Subcontratante (Processor)</em>, tratando os dados apenas mediante instruções documentadas do Cliente.
                </p>
                <p>
                  <strong>3.2. Isolamento Multi-Tenant e Controlo de Acessos (RBAC):</strong> Todos os registos de projetos, capítulos de livros, slides e transações financeiras possuem isolamento lógico rigoroso por <code>organizationId</code> e verificação de permissões por função (<code>Owner</code>, <code>Admin</code>, <code>Editor</code>, <code>Viewer</code>).
                </p>
                <p>
                  <strong>3.3. Subprocessadores Autorizados e Cláusulas Contratuais-Tipo (SCCs):</strong> Utilizamos apenas infraestrutura certificada ISO 27001 e SOC 2 Type II (PostgreSQL Cloud, Supabase Auth, Stripe Payments, Cloudflare R2), aplicando as Cláusulas Contratuais-Tipo da Comissão Europeia sempre aplicável.
                </p>
                <p>
                  <strong>3.4. Notificação de Incidentes:</strong> Em caso de incidente de segurança com impacto em dados pessoais, a NEXORA AI notificará o Responsável pelo Tratamento num prazo máximo de 24 horas após a deteção.
                </p>
              </>
            )}

            {activeLegalTab === 'cookies' && (
              <>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-extrabold text-foreground">
                    4. Política de Cookies, Armazenamento Local & Telemetria
                  </h3>
                  <span className="text-[11px] font-mono text-amber-500">Diretiva ePrivacy</span>
                </div>
                <p>
                  <strong>4.1. Cookies Estritamente Necessários:</strong> Utilizamos cookies seguros (<code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code>) exclusivamente para manter a sessão autenticada (JWT Supabase), preferência de idioma (<code>PT</code>, <code>EN</code>, <code>ES</code>, <code>FR</code>), tema visual (Light/Dark Mode) e proteção contra CSRF.
                </p>
                <p>
                  <strong>4.2. Zero Rastreamento Publicitário de Terceiros:</strong> A NEXORA AI 2.0 não vende dados a corretores de anúncios nem incorpora pixels de rastreamento publicitário invasivos dentro da Área de Produção (<code>/dashboard</code> e estúdios criativos).
                </p>
                <p>
                  <strong>4.3. Telemetria Técnica Anonimizada:</strong> Apenas métricas agregadas de desempenho (latência de geração de capítulos, taxa de sucesso de exportação PDF/EPUB/PPTX e saúde da API) são registadas para garantir o cumprimento do SLA de 99.9%.
                </p>
              </>
            )}

            {activeLegalTab === 'ai_ethics' && (
              <>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-extrabold text-foreground">
                    5. Política de Uso Aceitável de IA, Ética & Direitos Autorais (EU AI Act)
                  </h3>
                  <span className="text-[11px] font-mono text-violet-500">Governança de IA Responsável</span>
                </div>
                <p>
                  <strong>5.1. Uso Responsável e Proibições:</strong> É estritamente proibida a utilização dos motores da NEXORA AI 2.0 para gerar malware, phishing, desinformação médica/eleitoral deliberada, discurso de ódio, violação de direitos humanos ou plágio direto de obras protegidas de terceiros.
                </p>
                <p>
                  <strong>5.2. Controlo Humano no Ciclo Editorial (Human-in-the-Loop):</strong> A NEXORA AI 2.0 foi desenhada sob o princípio de co-autoria assistida: o utilizador aprova o plano editorial, supervisiona cada capítulo através da <code>BookMemory</code> e detém controlo total de edição antes da publicação.
                </p>
                <p>
                  <strong>5.3. Conformidade com o EU AI Act:</strong> A plataforma disponibiliza metadados transparentes de versão e histórico de edição em todos os projetos, apoiando as organizações no cumprimento das obrigações de transparência do Regulamento Europeu de Inteligência Artificial.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-10 sm:p-14 text-center text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Pronto para criar na Área de Produção da NEXORA AI 2.0?
          </h2>
          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto">
            Acede imediatamente aos 6 estúdios criativos, 20 layouts de apresentações, motor de e-books de 10 a 500 páginas e exportação multi-formato.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-900 font-extrabold text-sm sm:text-base hover:bg-indigo-50 transition-all shadow-lg"
            >
              Abrir Área de Produção Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/30 text-white font-bold text-sm sm:text-base hover:bg-white/10 transition-all"
            >
              Explorar Biblioteca de Modelos
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive Enterprise Mega-Footer */}
      <footer className="border-t border-border bg-card/60 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  N
                </div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  NEXORA AI 2.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
                Plataforma SaaS Enterprise de criação digital assistida por Inteligência Artificial: Apresentações 16:9, E-books de 10 a 1.000 páginas, Documentos Corporativos, Mapas Mentais, Infográficos e Websites.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-emerald-500">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Todos os 6 Estúdios Operacionais (99.9% SLA)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  RGPD • SOC 2 • WCAG AAA
                </span>
              </div>
            </div>

            {/* Column 1: 6 Studios */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Os 6 Estúdios
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="/presentations/new" className="hover:text-foreground transition-colors">
                    NEXORA Presentations (16:9)
                  </Link>
                </li>
                <li>
                  <Link href="/ebooks/new" className="hover:text-foreground transition-colors">
                    NEXORA Ebook Studio (10–500p)
                  </Link>
                </li>
                <li>
                  <Link href="/docs/new" className="hover:text-foreground transition-colors">
                    NEXORA Docs (A4 & SOPs)
                  </Link>
                </li>
                <li>
                  <Link href="/mindmaps/new" className="hover:text-foreground transition-colors">
                    NEXORA Mind Maps (SVG)
                  </Link>
                </li>
                <li>
                  <Link href="/infographics/new" className="hover:text-foreground transition-colors">
                    NEXORA Infographics (Poster)
                  </Link>
                </li>
                <li>
                  <Link href="/websites/new" className="hover:text-foreground transition-colors">
                    NEXORA Web (HTML5 & ZIP)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Documentation & Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Documentação & Produto
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <a
                    href="#docs"
                    onClick={() => setActiveDocTab('quickstart')}
                    className="hover:text-foreground transition-colors"
                  >
                    Guia de Início Rápido
                  </a>
                </li>
                <li>
                  <a
                    href="#docs"
                    onClick={() => setActiveDocTab('studios')}
                    className="hover:text-foreground transition-colors"
                  >
                    Manual dos 6 Estúdios
                  </a>
                </li>
                <li>
                  <a
                    href="#docs"
                    onClick={() => setActiveDocTab('longform')}
                    className="hover:text-foreground transition-colors"
                  >
                    Arquitetura BookMemory
                  </a>
                </li>
                <li>
                  <a
                    href="#docs"
                    onClick={() => setActiveDocTab('api')}
                    className="hover:text-foreground transition-colors"
                  >
                    Referência API REST v1
                  </a>
                </li>
                <li>
                  <a
                    href="#docs"
                    onClick={() => setActiveDocTab('credits')}
                    className="hover:text-foreground transition-colors"
                  >
                    Tabela de Custos de Créditos
                  </a>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-foreground transition-colors">
                    Galeria de Templates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal, Policies & Governance */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Políticas, Legal & Conta
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <a
                    href="#legal"
                    onClick={() => setActiveLegalTab('terms')}
                    className="hover:text-foreground transition-colors"
                  >
                    Termos de Serviço & Licença
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    onClick={() => setActiveLegalTab('privacy')}
                    className="hover:text-foreground transition-colors"
                  >
                    Política de Privacidade & RGPD
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    onClick={() => setActiveLegalTab('dpa')}
                    className="hover:text-foreground transition-colors"
                  >
                    Acordo DPA Multi-Tenant
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    onClick={() => setActiveLegalTab('cookies')}
                    className="hover:text-foreground transition-colors"
                  >
                    Política de Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    onClick={() => setActiveLegalTab('ai_ethics')}
                    className="hover:text-foreground transition-colors"
                  >
                    Política de Ética IA & EU AI Act
                  </a>
                </li>
                <li>
                  <Link href="/credits" className="hover:text-foreground transition-colors">
                    Planos & Faturação
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {year} NEXORA AI 2.0 Enterprise Creative Suite. Todos os direitos reservados.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/dashboard" className="hover:text-foreground font-semibold">
                Área de Produção
              </Link>
              <Link href="/projects" className="hover:text-foreground">
                Projetos
              </Link>
              <Link href="/credits" className="hover:text-foreground">
                Créditos IA
              </Link>
              <Link href="/settings" className="hover:text-foreground">
                Idiomas (PT/EN/ES/FR)
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
