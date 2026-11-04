'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Rocket,
  Briefcase,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

const ARCHETYPES = [
  {
    id: 'SAAS_LANDING',
    name: 'Landing Page SaaS & IA',
    desc: 'Foco em conversão, funcionalidades, prova social, tabela de preços e FAQ.',
    icon: Rocket,
  },
  {
    id: 'EXECUTIVE_PORTFOLIO',
    name: 'Portfólio Executivo & Consultoria',
    desc: 'Autoridade profissional, casos de estudo, especialidades e agendamento.',
    icon: Briefcase,
  },
  {
    id: 'PRODUCT_LAUNCH',
    name: 'Lançamento Digital & E-book',
    desc: 'Página de vendas e captura para livros, infoprodutos e programas.',
    icon: BookOpen,
  },
  {
    id: 'AGENCY_CORPORATE',
    name: 'Website Institucional B2B',
    desc: 'Presença empresarial com serviços, metodologia, equipa e métricas.',
    icon: Building2,
  },
  {
    id: 'EVENT_CONFERENCE',
    name: 'Summit & Conferência Tech',
    desc: 'Página de evento com oradores, agenda, bilhetes e patrocinadores.',
    icon: Calendar,
  },
]

const THEMES = [
  { id: 'MIDNIGHT_INDIGO', name: 'Midnight Indigo SaaS', color: '#6366F1' },
  { id: 'CLEAN_MINIMAL', name: 'Clean Minimal Light', color: '#2563EB' },
  { id: 'EMERALD_FINTECH', name: 'Emerald Fintech', color: '#10B981' },
  { id: 'CYBER_NEON', name: 'Cyber Violet & Pink', color: '#A855F7' },
  { id: 'WARM_LUXURY', name: 'Warm Luxury Gold', color: '#D97706' },
]

export default function NewWebsitePage() {
  const router = useRouter()
  const [title, setTitle] = useState(
    'NEXORA Cloud — Plataforma Inteligente de Produtividade & Criação Digital',
  )
  const [brandName, setBrandName] = useState('NEXORA Cloud')
  const [primaryCtaText, setPrimaryCtaText] = useState('Começar Agora Gratuitamente')
  const [prompt, setPrompt] = useState(
    'Estúdio SaaS completo com IA generativa para criar apresentações, e-books de 500 páginas, documentos, mapas mentais e infográficos.',
  )
  const [archetype, setArchetype] = useState('SAAS_LANDING')
  const [theme, setTheme] = useState('MIDNIGHT_INDIGO')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return
    setIsGenerating(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
    try {
      const res = await fetch(`${apiUrl}/websites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `proj-web-${Date.now()}`,
          title,
          brandName,
          primaryCtaText,
          prompt,
          archetype,
          theme,
        }),
      })
      if (res.ok) {
        const created = await res.json()
        router.push(`/websites/${created.id || 'demo-website'}`)
        return
      }
    } catch {
      // Fallback
    }
    router.push(
      `/websites/demo-website?title=${encodeURIComponent(title)}&brand=${encodeURIComponent(brandName)}&theme=${encodeURIComponent(theme)}`,
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/websites"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar a NEXORA Web
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
          NEXORA WEB ENGINE v2.0
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Configurar Novo Website ou Landing Page
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Escolhe o arquétipo de página, o tema visual e define a tua marca para gerar as 9 secções responsivas e o pacote HTML5/ZIP.
          </p>
        </div>

        {/* Archetype */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Arquétipo do Website
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ARCHETYPES.map((arch) => {
              const Icon = arch.icon
              const active = archetype === arch.id
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setArchetype(arch.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-border bg-background hover:border-blue-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-blue-600 text-white">
                      <Icon className="w-4 h-4" />
                    </span>
                    {active && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="font-semibold text-sm text-foreground">{arch.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{arch.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Tema Visual
          </label>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  theme === t.id
                    ? 'border-blue-500 bg-blue-500/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Headline Principal / Título da Página
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Nome da Marca / Produto
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Texto do Botão Principal (CTA)
            </label>
            <input
              type="text"
              value={primaryCtaText}
              onChange={(e) => setPrimaryCtaText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Descrição da Oferta, Público-Alvo e Benefícios
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                A construir secções responsivas e SEO...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Website no Estúdio Visual
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
