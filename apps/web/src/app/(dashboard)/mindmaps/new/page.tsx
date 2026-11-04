'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  GitBranch,
  Workflow,
  Users,
  Cpu,
  BookOpen,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

const DIAGRAM_TYPES = [
  {
    id: 'MIND_MAP',
    name: 'Mapa Mental Estratégico',
    desc: 'Decomposição ramificada de ideias, planeamento de produto e OKRs.',
    icon: GitBranch,
  },
  {
    id: 'FLOWCHART',
    name: 'Fluxograma de Processo',
    desc: 'Etapas sequenciais, decisões operacionais e automação.',
    icon: Workflow,
  },
  {
    id: 'ORG_CHART',
    name: 'Organograma & Governança',
    desc: 'Estrutura hierárquica de diretorias, squads e lideranças.',
    icon: Users,
  },
  {
    id: 'ARCHITECTURE',
    name: 'Arquitetura de Sistema',
    desc: 'Camadas técnicas: Frontend, API Gateway, IA e Base de Dados.',
    icon: Cpu,
  },
  {
    id: 'CONCEPT_MAP',
    name: 'Mapa Conceitual',
    desc: 'Rede semântica de conceitos para estudo e síntese de domínio.',
    icon: BookOpen,
  },
]

const THEMES = [
  { id: 'NEON_TECH', name: 'Neon Tech Dark', color: '#6366F1' },
  { id: 'CORPORATE_BLUE', name: 'Corporate Executive', color: '#1E3A8A' },
  { id: 'EMERALD_GROWTH', name: 'Emerald Growth', color: '#10B981' },
  { id: 'WARM_CREATIVE', name: 'Warm Creative', color: '#F97316' },
  { id: 'MINIMAL_MONO', name: 'Minimalist Slate', color: '#334155' },
]

export default function NewMindMapPage() {
  const router = useRouter()
  const [title, setTitle] = useState('Arquitetura & Estratégia de Produto SaaS IA')
  const [prompt, setPrompt] = useState(
    'Ecossistema completo de criação digital com IA, motores de geração, segurança multi-tenant e crescimento internacional.',
  )
  const [diagramType, setDiagramType] = useState('MIND_MAP')
  const [theme, setTheme] = useState('NEON_TECH')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return
    setIsGenerating(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
    try {
      const res = await fetch(`${apiUrl}/mindmaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `proj-mm-${Date.now()}`,
          title,
          prompt,
          diagramType,
          theme,
        }),
      })
      if (res.ok) {
        const created = await res.json()
        router.push(`/mindmaps/${created.id || 'demo-mindmap'}`)
        return
      }
    } catch {
      // Fallback
    }
    router.push(
      `/mindmaps/demo-mindmap?title=${encodeURIComponent(title)}&type=${encodeURIComponent(diagramType)}&theme=${encodeURIComponent(theme)}`,
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/mindmaps"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar a NEXORA Mind Maps
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
          NEXORA MIND MAPS ENGINE v2.0
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Criar Novo Mapa Mental ou Fluxograma
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seleciona o tipo de diagrama, o tema visual e descreve o tópico central para gerar os nós e ligações automaticamente.
          </p>
        </div>

        {/* Diagram Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Tipo de Diagrama
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DIAGRAM_TYPES.map((dt) => {
              const Icon = dt.icon
              const active = diagramType === dt.id
              return (
                <button
                  key={dt.id}
                  type="button"
                  onClick={() => setDiagramType(dt.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/20'
                      : 'border-border bg-background hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-cyan-600 text-white">
                      <Icon className="w-4 h-4" />
                    </span>
                    {active && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="font-semibold text-sm text-foreground">{dt.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{dt.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Theme Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Paleta Visual do Diagrama
          </label>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  theme === t.id
                    ? 'border-cyan-500 bg-cyan-500/10 text-foreground'
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

        {/* Topic Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Tópico Central / Título do Mapa
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
              Contexto ou Ramos Desejados
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                A calcular nós e coordenadas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Mapa Mental Interativo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
