'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  BarChart3,
  Clock,
  GitCommit,
  Scale,
  ListChecks,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

const ARCHETYPES = [
  {
    id: 'STATISTICAL',
    name: 'Estatístico & KPIs',
    desc: 'Foco em números de impacto, percentagens de crescimento e gráfico de barras.',
    icon: BarChart3,
  },
  {
    id: 'TIMELINE',
    name: 'Cronologia & Roadmap',
    desc: 'Evolução temporal em marcos sequenciais e metas trimestrais.',
    icon: Clock,
  },
  {
    id: 'PROCESS',
    name: 'Fluxo de Processo',
    desc: 'Explicação visual passo a passo de metodologias e ciclos operacionais.',
    icon: GitCommit,
  },
  {
    id: 'COMPARISON',
    name: 'Comparativo & Benchmark',
    desc: 'Contraste de indicadores de performance e vantagem competitiva.',
    icon: Scale,
  },
  {
    id: 'LISTICLE',
    name: 'Top Insights em Blocos',
    desc: 'Síntese visual de pilares executivos e recomendações-chave.',
    icon: ListChecks,
  },
]

const PALETTES = [
  { id: 'CYBER_INDIGO', name: 'Cyber Indigo', primary: '#6366F1', secondary: '#06B6D4' },
  { id: 'EXECUTIVE_NAVY', name: 'Executive Navy', primary: '#3A86FF', secondary: '#00F5D4' },
  { id: 'EMERALD_ECO', name: 'Emerald Growth', primary: '#10B981', secondary: '#FBBF24' },
  { id: 'SUNSET_CORAL', name: 'Sunset Coral', primary: '#F43F5E', secondary: '#FB923C' },
  { id: 'ROYAL_GOLD', name: 'Royal Gold Luxury', primary: '#D4AF37', secondary: '#F3E5AB' },
]

export default function NewInfographicPage() {
  const router = useRouter()
  const [title, setTitle] = useState('Impacto da IA Generativa na Produtividade Empresarial 2026')
  const [prompt, setPrompt] = useState(
    'Indicadores de ganho de velocidade (+68%), retorno sobre investimento (3.9x), adoção por departamento e marcos de implementação.',
  )
  const [infographicType, setInfographicType] = useState('STATISTICAL')
  const [palette, setPalette] = useState('CYBER_INDIGO')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return
    setIsGenerating(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
    try {
      const res = await fetch(`${apiUrl}/infographics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `proj-info-${Date.now()}`,
          title,
          prompt,
          infographicType,
          palette,
          width: 800,
          height: 1200,
        }),
      })
      if (res.ok) {
        const created = await res.json()
        router.push(`/infographics/${created.id || 'demo-infographic'}`)
        return
      }
    } catch {
      // Fallback
    }
    router.push(
      `/infographics/demo-infographic?title=${encodeURIComponent(title)}&type=${encodeURIComponent(infographicType)}&palette=${encodeURIComponent(palette)}`,
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/infographics"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar a NEXORA Infographics
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
          NEXORA INFOGRAPHICS ENGINE v2.0
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Configurar Novo Poster Infográfico (800×1200)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Escolhe o arquétipo visual, a paleta cromática e os dados principais para compor o infográfico vertical.
          </p>
        </div>

        {/* Archetype */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Arquétipo de Infográfico
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ARCHETYPES.map((arch) => {
              const Icon = arch.icon
              const active = infographicType === arch.id
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setInfographicType(arch.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                      : 'border-border bg-background hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-emerald-600 text-white">
                      <Icon className="w-4 h-4" />
                    </span>
                    {active && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="font-semibold text-sm text-foreground">{arch.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{arch.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Palette */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Paleta de Cores Editorial
          </label>
          <div className="flex flex-wrap gap-2">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  palette === p.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: p.primary }}
                />
                <span
                  className="w-3 h-3 rounded-full -ml-1"
                  style={{ backgroundColor: p.secondary }}
                />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Título Principal do Infográfico
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
              Dados, Estatísticas ou Etapas a Destacar
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:opacity-90 shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                A desenhar infográfico vetorial...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Poster Infográfico
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
