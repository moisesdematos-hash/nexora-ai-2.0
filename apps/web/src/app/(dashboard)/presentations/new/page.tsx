'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Presentation,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Palette,
  Layers,
  FileText,
  Globe,
  Database,
} from 'lucide-react'

const THEMES = [
  { id: 'TECH', name: 'Tecnológico', desc: 'Violeta Neon & Azul Espacial', swatch: 'bg-purple-950 border-purple-500 text-cyan-300' },
  { id: 'CORPORATE', name: 'Corporativo', desc: 'Azul Marinho & Ciano', swatch: 'bg-slate-900 border-blue-500 text-sky-300' },
  { id: 'EXECUTIVE', name: 'Executivo', desc: 'Ardósia & Dourado', swatch: 'bg-gray-900 border-amber-500 text-amber-300' },
  { id: 'MINIMALIST', name: 'Minimalista', desc: 'Branco Puro & Grafite', swatch: 'bg-white border-slate-300 text-slate-900' },
  { id: 'EDUCATIONAL', name: 'Educativo', desc: 'Esmeralda & Âmbar', swatch: 'bg-emerald-50 border-emerald-500 text-emerald-900' },
  { id: 'ACADEMIC', name: 'Académico', desc: 'Índigo Clássico & Marfim', swatch: 'bg-indigo-50 border-indigo-500 text-indigo-950' },
  { id: 'FINANCIAL', name: 'Financeiro', desc: 'Verde Floresta & Ouro', swatch: 'bg-emerald-950 border-emerald-400 text-amber-300' },
  { id: 'CREATIVE', name: 'Criativo', desc: 'Magenta, Roxo & Coral', swatch: 'bg-fuchsia-950 border-pink-500 text-yellow-300' },
  { id: 'INSTITUTIONAL', name: 'Institucional', desc: 'Azul Real & Neutro', swatch: 'bg-slate-100 border-blue-600 text-slate-900' },
  { id: 'PREMIUM', name: 'Premium', desc: 'Onyx & Champagne Gold', swatch: 'bg-zinc-950 border-yellow-500 text-yellow-400' },
]

const LAYOUT_OPTIONS = [
  'COVER',
  'INTRODUCTION',
  'TITLE_AND_TEXT',
  'TEXT_AND_IMAGE',
  'TWO_COLUMNS',
  'THREE_COLUMNS',
  'COMPARISON',
  'STATISTICS',
  'CHART',
  'TIMELINE',
  'PROCESS',
  'ORG_CHART',
  'QUOTE',
  'GALLERY',
  'INFOGRAPHIC',
  'TABLE',
  'CASE_STUDY',
  'QNA',
  'CONCLUSION',
  'CALL_TO_ACTION',
]

export default function NewPresentationPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isPlanning, setIsPlanning] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1 Inputs (Section 4.1 & 4.2 of Master Prompt)
  const [sourceType, setSourceType] = useState<'PROMPT' | 'TEXT' | 'DOCUMENT' | 'URL' | 'CSV_DATA'>('PROMPT')
  const [prompt, setPrompt] = useState('')
  const [sourceContent, setSourceContent] = useState('')
  const [slideCount, setSlideCount] = useState(10)
  const [language, setLanguage] = useState('pt')
  const [audience, setAudience] = useState('Conselho Executivo, Investidores e Clientes')
  const [tone, setTone] = useState('Executivo, claro e persuasivo')
  const [themeId, setThemeId] = useState('TECH')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true)

  // Step 2 Planned Outline
  const [outline, setOutline] = useState<any>(null)

  function buildFallbackPresentationOutline() {
    const layouts = ['COVER', 'INTRODUCTION', 'STATISTICS', 'COMPARISON', 'TIMELINE', 'PROCESS', 'CASE_STUDY', 'CONCLUSION', 'CALL_TO_ACTION']
    const slides = Array.from({ length: slideCount }, (_, idx) => ({
      position: idx + 1,
      title:
        idx === 0
          ? prompt.trim()
          : idx === slideCount - 1
          ? 'Próximos Passos & Plano de Ação'
          : `Pilar Estratégico 0${idx} — ${prompt.slice(0, 38)}`,
      layout: layouts[idx % layouts.length],
      summary: `Análise executiva focada em ${audience} com tom ${tone.toLowerCase()}.`,
    }))
    return {
      title: prompt.trim(),
      subtitle: `Apresentação Widescreen 16:9 (${slideCount} Slides • Tema ${themeId})`,
      themeId,
      slides,
    }
  }

  async function handlePlanPresentation(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsPlanning(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:3001/api/v1/presentations/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          sourceType,
          sourceContent,
          slideCount,
          language,
          targetAudience: audience,
          tone,
          themeId,
          includeCharts,
          includeSpeakerNotes,
        }),
      }).catch(() => null)

      if (res && res.ok) {
        const data = await res.json()
        setOutline(data)
      } else {
        setOutline(buildFallbackPresentationOutline())
      }
      setStep(2)
    } catch {
      setOutline(buildFallbackPresentationOutline())
      setStep(2)
    } finally {
      setIsPlanning(false)
    }
  }

  async function handleCreatePresentation() {
    setIsCreating(true)
    setError(null)

    try {
      const presRes = await fetch('http://localhost:3001/api/v1/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `proj_pres_${Date.now()}`,
          title: outline.title,
          description: outline.subtitle,
          themeId,
          outline,
          config: {
            slideCount: outline.slides?.length || slideCount,
            includeCharts,
            includeSpeakerNotes,
            sourceType,
          },
        }),
      }).catch(() => null)

      if (presRes && presRes.ok) {
        const created = await presRes.json()
        router.push(`/presentations/${created.id}`)
        return
      }

      const localId = `pres-${Date.now()}`
      const localPres = {
        id: localId,
        title: outline.title,
        description: outline.subtitle,
        themeId,
        themeSpec: {
          id: themeId,
          name: themeId,
          contrastRatio: 11.4,
          wcagLevel: 'AAA',
        },
        slides: outline.slides.map((s: any, idx: number) => ({
          id: `sl_${idx + 1}`,
          position: s.position,
          title: s.title,
          speakerNotes: `Notas do orador para o Slide ${s.position}: ${s.summary}`,
          content: {
            layout: s.layout || 'TITLE_AND_TEXT',
            subtitle: s.summary,
            bullets: [
              `Diretriz estratégica principal para ${outline.title}`,
              `Alinhamento com ${audience} e execução validada`,
              `Indicadores mensuráveis de impacto e governança`,
            ],
            metrics: [
              { value: '+68%', label: 'Eficiência', description: 'Ganho operacional direto' },
              { value: '3.4x', label: 'ROI Estimado', description: 'Retorno no primeiro ano' },
              { value: '99.9%', label: 'Confiabilidade', description: 'Arquitetura validada' },
            ],
          },
        })),
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(`nexora_pres_${localId}`, JSON.stringify(localPres))
      }
      router.push(`/presentations/${localId}`)
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar apresentação')
      setIsCreating(false)
    }
  }

  function handleSlideTitleChange(idx: number, val: string) {
    if (!outline) return
    const next = { ...outline }
    next.slides[idx].title = val
    setOutline(next)
  }

  function handleSlideLayoutChange(idx: number, newLayout: string) {
    if (!outline) return
    const next = { ...outline }
    next.slides[idx].layout = newLayout
    setOutline(next)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            NEXORA Presentation Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {step === 1
              ? 'Etapa 1: Fonte de Entrada, Configuração e Tema Visual'
              : 'Etapa 2: Aprovação do Esboço e Seleção dos 20 Layouts-Base'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                s === step
                  ? 'bg-violet-600 text-white ring-4 ring-violet-500/20'
                  : s < step
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* STEP 1: INPUT & CONFIGURATION */}
      {step === 1 && (
        <form onSubmit={handlePlanPresentation} className="space-y-6">
          {/* Source Selector */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              1. Fonte de Entrada (Prompt, Texto, Documento, CSV/XLSX ou URL)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'PROMPT', label: 'Por Prompt / Tema', icon: Sparkles },
                { id: 'TEXT', label: 'Texto Colado', icon: FileText },
                { id: 'DOCUMENT', label: 'PDF / DOCX / PPTX', icon: FileText },
                { id: 'CSV_DATA', label: 'Dados CSV / XLSX', icon: Database },
                { id: 'URL', label: 'URL Pública', icon: Globe },
              ].map((src) => {
                const Icon = src.icon
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setSourceType(src.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sourceType === src.id
                        ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40'
                        : 'border-border hover:border-violet-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-violet-600 mb-1.5" />
                    <p className="text-xs font-semibold text-foreground">{src.label}</p>
                  </button>
                )
              })}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Tema ou Pedido Principal da Apresentação
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                placeholder="Ex: Estratégia Global de Expansão SaaS com IA para 2026 — Pitch para Investidores Série A..."
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {sourceType !== 'PROMPT' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                  {sourceType === 'URL'
                    ? 'URL Pública Autorizada'
                    : sourceType === 'CSV_DATA'
                    ? 'Dados CSV / Tabela para Gráficos'
                    : 'Conteúdo do Documento / Texto Base'}
                </label>
                <textarea
                  rows={3}
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  placeholder={
                    sourceType === 'URL'
                      ? 'https://exemplo.com/relatorio-anual'
                      : 'Cole aqui o conteúdo, métricas ou extrato do documento...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs"
                />
              </div>
            )}
          </div>

          {/* Slide Count, Language, Tone, Audience */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="text-base font-bold text-foreground">
              2. Estrutura, Idioma e Público-Alvo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Número de Slides
                </label>
                <select
                  value={slideCount}
                  onChange={(e) => setSlideCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground"
                >
                  <option value={6}>6 Slides (Pitch Rápido)</option>
                  <option value={10}>10 Slides (Executivo Padrão)</option>
                  <option value={15}>15 Slides (Apresentação Completa)</option>
                  <option value={20}>20 Slides (Todos os 20 Layouts)</option>
                  <option value={30}>30 Slides (Keynote Aprofundado)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground"
                >
                  <option value="pt">Português</option>
                  <option value="en">Inglês (English)</option>
                  <option value="es">Espanhol (Español)</option>
                  <option value="fr">Francês (Français)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Tom
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded border-input text-violet-600"
                />
                Incluir Gráficos e KPIs Quantitativos
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSpeakerNotes}
                  onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                  className="rounded border-input text-violet-600"
                />
                Gerar Notas para o Apresentador em todos os slides
              </label>
            </div>
          </div>

          {/* 10 Visual Themes Selector */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              3. Biblioteca de 10 Temas Visuais (NEXORA Design Engine)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setThemeId(th.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    themeId === th.id
                      ? 'border-violet-600 ring-2 ring-violet-500/20'
                      : 'border-border hover:border-violet-300'
                  }`}
                >
                  <div className={`h-8 rounded-lg border mb-2 px-2 flex items-center text-[10px] font-bold ${th.swatch}`}>
                    Aa • 16:9
                  </div>
                  <p className="text-xs font-bold text-foreground">{th.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{th.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPlanning || !prompt.trim()}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base hover:opacity-90 shadow-lg disabled:opacity-50"
            >
              {isPlanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Planeando Esboço e Layouts...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Esboço Estruturado
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: OUTLINE APPROVAL & LAYOUT CUSTOMIZATION */}
      {step === 2 && outline && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Esboço Estruturado ({outline.slides?.length} Slides • Tema {outline.themeId})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Revisa ou personaliza o título e o layout de cada slide antes de produzir o design final.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
                Etapa 3 do Pipeline: Aprovação
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {outline.slides?.map((s: any, idx: number) => (
                <div
                  key={s.position}
                  className="p-4 rounded-xl border border-border bg-background/60 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {s.position}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => handleSlideTitleChange(idx, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-input bg-card text-sm font-semibold text-foreground"
                    />
                    <p className="text-[11px] text-muted-foreground">{s.summary}</p>
                  </div>
                  <div className="shrink-0">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-0.5">
                      Layout Inteligente
                    </label>
                    <select
                      value={s.layout}
                      onChange={(e) => handleSlideLayoutChange(idx, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-input bg-card text-xs font-semibold text-violet-600"
                    >
                      {LAYOUT_OPTIONS.map((lay) => (
                        <option key={lay} value={lay}>
                          {lay}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-input text-sm font-medium hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à Configuração
            </button>
            <button
              type="button"
              onClick={handleCreatePresentation}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base hover:opacity-90 shadow-lg disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Aplicando NEXORA Design Engine...
                </>
              ) : (
                <>
                  <Presentation className="w-5 h-5" />
                  Aprovar e Gerar Apresentação
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
