'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Sparkles,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Rocket,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'

const THEME_SPECS: Record<
  string,
  {
    name: string
    bgPage: string
    bgSection: string
    bgCard: string
    textPrimary: string
    textSecondary: string
    accentPrimary: string
    accentSecondary: string
  }
> = {
  MIDNIGHT_INDIGO: {
    name: 'Midnight Indigo SaaS',
    bgPage: '#090D16',
    bgSection: '#0F172A',
    bgCard: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accentPrimary: '#6366F1',
    accentSecondary: '#06B6D4',
  },
  CLEAN_MINIMAL: {
    name: 'Clean Minimal Light',
    bgPage: '#FFFFFF',
    bgSection: '#F8FAFC',
    bgCard: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    accentPrimary: '#2563EB',
    accentSecondary: '#4F46E5',
  },
  EMERALD_FINTECH: {
    name: 'Emerald Fintech',
    bgPage: '#041F1A',
    bgSection: '#062C24',
    bgCard: '#0D3B31',
    textPrimary: '#ECFDF5',
    textSecondary: '#A7F3D0',
    accentPrimary: '#10B981',
    accentSecondary: '#34D399',
  },
  CYBER_NEON: {
    name: 'Cyber Violet & Pink',
    bgPage: '#0D0714',
    bgSection: '#160D24',
    bgCard: '#221536',
    textPrimary: '#FAF5FF',
    textSecondary: '#D8B4FE',
    accentPrimary: '#A855F7',
    accentSecondary: '#EC4899',
  },
  WARM_LUXURY: {
    name: 'Warm Luxury Gold',
    bgPage: '#12100E',
    bgSection: '#1C1917',
    bgCard: '#292524',
    textPrimary: '#FAFAF9',
    textSecondary: '#D6D3D1',
    accentPrimary: '#D97706',
    accentSecondary: '#F59E0B',
  },
}

export default function WebsiteStudioPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const siteId = String(params?.id || 'demo-website')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

  const [viewport, setViewport] = useState<'DESKTOP' | 'TABLET' | 'MOBILE'>('DESKTOP')
  const [brandName, setBrandName] = useState(
    searchParams?.get('brand') || 'NEXORA Cloud',
  )
  const [themeId, setThemeId] = useState(
    searchParams?.get('theme') || 'MIDNIGHT_INDIGO',
  )
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const [heroBadge, setHeroBadge] = useState('✨ NEXORA AI 2.0 • Nova Geração')
  const [headline, setHeadline] = useState(
    searchParams?.get('title') ||
      'NEXORA Cloud — Plataforma Inteligente de Produtividade & Criação Digital',
  )
  const [subheadline, setSubheadline] = useState(
    'Transforma ideias, documentos e dados em apresentações executivas, e-books de 500 páginas, mapas mentais, infográficos e websites de alta conversão.',
  )
  const [primaryCta, setPrimaryCta] = useState('Começar Agora Gratuitamente')
  const [seoTitle, setSeoTitle] = useState(
    'NEXORA Cloud | Estúdio Inteligente com IA Generativa',
  )
  const [seoDescription, setSeoDescription] = useState(
    'Plataforma SaaS multi-estúdio para criação de apresentações, e-books, documentos e landing pages com inteligência artificial.',
  )

  const [features, setFeatures] = useState([
    {
      id: 'f1',
      badge: 'AI Core',
      title: 'Orquestração Inteligente Multi-Modelo',
      description: 'Geração estruturada com memória contextual e revisão editorial automática.',
    },
    {
      id: 'f2',
      badge: 'Design Engine',
      title: '20 Layouts & Contraste WCAG AAA',
      description: 'Hierarquia tipográfica, paletas harmoniosas e responsividade total.',
    },
    {
      id: 'f3',
      badge: 'Multi-Export',
      title: 'Exportação PDF, PPTX, EPUB, SVG e HTML/ZIP',
      description: 'Ficheiros oficiais prontos para apresentação, publicação ou alojamento web.',
    },
  ])

  useEffect(() => {
    if (siteId && siteId !== 'demo-website') {
      fetch(`${apiUrl}/websites/${siteId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((res) => {
          if (res && res.data) {
            setBrandName(res.data.brandName || brandName)
            setThemeId(res.data.theme || themeId)
            setPublishedUrl(res.publishedUrl || null)
            if (res.data.hero) {
              setHeroBadge(res.data.hero.badge || heroBadge)
              setHeadline(res.data.hero.headline || headline)
              setSubheadline(res.data.hero.subheadline || subheadline)
              setPrimaryCta(res.data.hero.primaryCta || primaryCta)
            }
            if (res.data.seo) {
              setSeoTitle(res.data.seo.title || seoTitle)
              setSeoDescription(res.data.seo.description || seoDescription)
            }
            if (Array.isArray(res.data.featuresGrid?.items)) {
              setFeatures(res.data.featuresGrid.items.slice(0, 6))
            }
          }
        })
        .catch(() => {})
    }
  }, [siteId])

  const theme = THEME_SPECS[themeId] || THEME_SPECS.MIDNIGHT_INDIGO

  const handlePublish = async () => {
    const slug =
      brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'nexora-site'
    const url = `https://sites.nexora.ai/${slug}`
    setPublishedUrl(url)
    setStatusMessage(`Website publicado com sucesso em ${url}`)
    if (siteId !== 'demo-website') {
      try {
        await fetch(`${apiUrl}/websites/${siteId}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customSlug: slug }),
        })
      } catch {
        // Ignore offline error
      }
    }
  }

  const handleDownloadHtmlLocal = () => {
    const html = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${seoTitle}</title>
  <meta name="description" content="${seoDescription}" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body style="background:${theme.bgPage};color:${theme.textPrimary};font-family:sans-serif">
  <header class="max-w-6xl mx-auto p-6 flex justify-between items-center">
    <strong class="text-xl">${brandName}</strong>
    <a href="#cta" class="px-4 py-2 rounded-xl text-white font-bold" style="background:${theme.accentPrimary}">${primaryCta}</a>
  </header>
  <main class="max-w-4xl mx-auto py-20 px-6 text-center space-y-6">
    <span class="px-3 py-1 rounded-full text-xs font-bold" style="background:${theme.bgCard};color:${theme.accentSecondary}">${heroBadge}</span>
    <h1 class="text-4xl md:text-6xl font-extrabold">${headline}</h1>
    <p class="text-lg opacity-80">${subheadline}</p>
    <div>
      <a href="#cta" class="inline-block px-8 py-4 rounded-2xl font-bold text-white" style="background:${theme.accentPrimary}">${primaryCta}</a>
    </div>
  </main>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const viewportWidthClass =
    viewport === 'MOBILE'
      ? 'max-w-[390px]'
      : viewport === 'TABLET'
        ? 'max-w-[768px]'
        : 'max-w-full'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Studio Header */}
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/websites"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-foreground line-clamp-1">
                {brandName}
              </span>
              {publishedUrl && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold flex items-center gap-1">
                  ● Publicado
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tema: {theme.name} • 9 secções responsivas • SEO OpenGraph ativo
            </p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewport('DESKTOP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              viewport === 'DESKTOP'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setViewport('TABLET')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              viewport === 'TABLET'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            Tablet
          </button>
          <button
            type="button"
            onClick={() => setViewport('MOBILE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              viewport === 'MOBILE'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile
          </button>
        </div>

        {/* Export & Publish */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
          >
            <Rocket className="w-3.5 h-3.5" />
            Publicar Site
          </button>
          <button
            type="button"
            onClick={handleDownloadHtmlLocal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
          >
            <Download className="w-3.5 h-3.5" />
            HTML5 (.html)
          </button>
          <a
            href={`${apiUrl}/websites/${siteId}/export/zip`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold hover:bg-muted"
          >
            <Download className="w-3.5 h-3.5" />
            Bundle (.zip)
          </a>
        </div>
      </header>

      {statusMessage && (
        <div className="bg-blue-600/10 border-b border-blue-500/20 px-6 py-2 flex items-center justify-between text-xs text-blue-400">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMessage}
            {publishedUrl && (
              <span className="inline-flex items-center gap-1 underline ml-2">
                {publishedUrl} <ExternalLink className="w-3 h-3" />
              </span>
            )}
          </span>
          <button onClick={() => setStatusMessage(null)} className="underline">
            Fechar
          </button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] w-full mx-auto">
        {/* Live Responsive Website Preview (8 cols) */}
        <div className="lg:col-span-8 flex justify-center">
          <div
            className={`w-full ${viewportWidthClass} transition-all duration-300 rounded-2xl border border-border shadow-2xl overflow-hidden`}
            style={{ backgroundColor: theme.bgPage, color: theme.textPrimary }}
          >
            {/* Browser Bar Mock */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-mono text-[11px] bg-slate-800 px-3 py-0.5 rounded-md text-slate-300">
                {publishedUrl || `https://sites.nexora.ai/${brandName.toLowerCase().replace(/\s+/g, '-')}`}
              </span>
              <span className="text-[10px] uppercase">{viewport}</span>
            </div>

            {/* Site Navbar */}
            <div
              className="px-6 py-4 flex items-center justify-between border-b border-white/10"
              style={{ backgroundColor: theme.bgSection }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                  style={{ backgroundColor: theme.accentPrimary }}
                >
                  {brandName.charAt(0)}
                </span>
                <span className="font-extrabold text-sm">{brandName}</span>
              </div>
              <div className="hidden sm:flex items-center gap-5 text-xs opacity-80">
                <span>Funcionalidades</span>
                <span>Como Funciona</span>
                <span>Preços</span>
                <span>FAQ</span>
              </div>
              <span
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: theme.accentPrimary }}
              >
                {primaryCta.slice(0, 18)}
              </span>
            </div>

            {/* Hero Section */}
            <div className="px-6 py-16 text-center max-w-3xl mx-auto space-y-5">
              <span
                className="inline-block px-3.5 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: theme.bgCard,
                  color: theme.accentSecondary,
                }}
              >
                {heroBadge}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                {headline}
              </h1>
              <p
                className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
                style={{ color: theme.textSecondary }}
              >
                {subheadline}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <span
                  className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
                  }}
                >
                  {primaryCta}
                </span>
                <span className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm border border-current/20">
                  Ver Demonstração
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="px-6 pb-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: '10x', l: 'Velocidade IA' },
                { v: '99.9%', l: 'SLA Uptime' },
                { v: '-68%', l: 'Custos Operacionais' },
                { v: '4.9/5', l: 'Rating Clientes' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl text-center border border-white/10"
                  style={{ backgroundColor: theme.bgCard }}
                >
                  <div
                    className="text-xl font-extrabold"
                    style={{ color: theme.accentSecondary }}
                  >
                    {m.v}
                  </div>
                  <div className="text-[11px] opacity-75 mt-0.5">{m.l}</div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div
              className="px-6 py-12 space-y-6"
              style={{ backgroundColor: theme.bgSection }}
            >
              <h2 className="text-xl font-extrabold text-center">
                Capacidades Desenhadas para Escala
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((f) => (
                  <div
                    key={f.id}
                    className="p-5 rounded-xl border border-white/10 space-y-2"
                    style={{ backgroundColor: theme.bgCard }}
                  >
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${theme.accentPrimary}25`,
                        color: theme.accentSecondary,
                      }}
                    >
                      {f.badge}
                    </span>
                    <h3 className="font-bold text-sm">{f.title}</h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: theme.textSecondary }}
                    >
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Preview */}
            <div className="px-6 py-12 space-y-6">
              <h2 className="text-xl font-extrabold text-center">
                Planos & Subscrições Transparentes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { n: 'Starter', p: '€ 0', d: 'Para começar hoje', hi: false },
                  { n: 'Pro Studio', p: '€ 29', d: 'Mais escolhido', hi: true },
                  { n: 'Enterprise', p: '€ 99', d: 'Equipas & Governança', hi: false },
                ].map((pl) => (
                  <div
                    key={pl.n}
                    className="p-5 rounded-xl border space-y-3"
                    style={{
                      backgroundColor: theme.bgCard,
                      borderColor: pl.hi ? theme.accentPrimary : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="font-bold text-sm">{pl.n}</div>
                    <div className="text-2xl font-extrabold">{pl.p}/mês</div>
                    <div className="text-xs opacity-75">{pl.d}</div>
                    <div
                      className="py-2 rounded-lg text-center text-xs font-bold text-white"
                      style={{ backgroundColor: pl.hi ? theme.accentPrimary : '#334155' }}
                    >
                      Escolher {pl.n}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-6 text-center text-xs border-t border-white/10"
              style={{
                backgroundColor: theme.bgSection,
                color: theme.textSecondary,
              }}
            >
              © {new Date().getFullYear()} {brandName} • Criado com NEXORA WEB AI 2.0
            </div>
          </div>
        </div>

        {/* Right Controls & Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Theme Switcher */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Palette className="w-4 h-4" />
              Tema Visual da Página
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(THEME_SPECS).map(([id, spec]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setThemeId(id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    themeId === id
                      ? 'border-blue-500 bg-blue-500/10 text-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: spec.accentPrimary }}
                  />
                  <span className="truncate">{spec.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Copywriting & Hero Editor */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Editor de Copywriting (Hero & CTA)
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Marca
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Headline Principal (H1)
              </label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Subheadline
              </label>
              <textarea
                rows={2}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Botão de Ação (CTA)
              </label>
              <input
                type="text"
                value={primaryCta}
                onChange={(e) => setPrimaryCta(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-bold text-blue-400"
              />
            </div>
          </div>

          {/* SEO & OpenGraph */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              SEO & Meta Tags OpenGraph
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
              />
            </div>
          </div>

          {/* AI CRO Commands */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Sparkles className="w-4 h-4" />
              Assistente IA de Conversão (CRO)
            </div>
            {[
              {
                label: '✨ Otimizar copy para conversão (CRO)',
                run: () => {
                  setHeroBadge('🔥 Garantia de 30 Dias • Começa Sem Cartão')
                  setPrimaryCta('Garantir Acesso Gratuito Agora')
                  setStatusMessage('Copy e CTAs otimizados para conversão (CRO).')
                },
              },
              {
                label: '✨ Traduzir Landing Page para Inglês',
                run: () => {
                  setHeroBadge(`✨ ${brandName} AI 2.0 • Next-Gen Studio`)
                  setHeadline(
                    `${brandName} — Intelligent AI Platform for Digital Creation`,
                  )
                  setSubheadline(
                    'Turn ideas, documents, and data into executive presentations, 500-page e-books, mind maps, infographics, and high-converting websites.',
                  )
                  setPrimaryCta('Start Free Trial Now')
                  setStatusMessage('Landing Page traduzida para Inglês (EN).')
                },
              },
              {
                label: '✨ Aplicar tema Clean Minimal Light',
                run: () => {
                  setThemeId('CLEAN_MINIMAL')
                  setStatusMessage('Tema Clean Minimal Light aplicado.')
                },
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.run}
                className="w-full text-left px-3 py-2 rounded-xl border border-border bg-background hover:border-blue-500/50 text-xs text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
