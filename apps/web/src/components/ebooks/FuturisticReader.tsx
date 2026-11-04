'use client'

import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Eye,
  Zap,
  Columns,
  FileText,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Cpu,
  BookOpen,
  Layers,
  Terminal,
  Sun,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react'
import {
  VISUAL_PRESETS,
  AI_IMAGE_MODELS,
  VisualStyleId,
  AIImageModelId,
  getChapterHeroVisual,
} from '@/lib/nexora-visual-engine'

export type ReadingModelId =
  | 'CYBER_HUD'
  | 'SPATIAL_GLASS'
  | 'SWISS_MODERN'
  | 'BIONIC_NEURAL'
  | 'MAGAZINE_SPREAD'
  | 'MATRIX_TECH'
  | 'PAPER_EINK'
  | 'AURORA_ZEN'

export interface ReadingModelSpec {
  id: ReadingModelId
  name: string
  category: 'Futurista' | 'Moderno' | 'Editorial'
  badge: string
  description: string
  wrapperClass: string
  pageClass: string
  accentColor: string
  headerClass: string
  bodyFont: string
}

export const READING_MODELS: ReadingModelSpec[] = [
  {
    id: 'CYBER_HUD',
    name: 'Cyber-HUD Holográfico',
    category: 'Futurista',
    badge: 'Sci-Fi • Telemetria HUD',
    description:
      'Interface holográfica escura com bordas neon ciano/violeta, telemetria cognitiva em tempo real e grelha espacial.',
    wrapperClass:
      'bg-[#050816] text-cyan-50 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)]',
    pageClass:
      'bg-[#090d24]/90 border border-cyan-500/30 shadow-[inset_0_0_25px_rgba(6,182,212,0.08)] text-slate-100',
    accentColor: '#06b6d4',
    headerClass: 'text-cyan-400 font-mono uppercase tracking-widest',
    bodyFont: 'font-sans',
  },
  {
    id: 'SPATIAL_GLASS',
    name: 'Spatial Glass OS',
    category: 'Futurista',
    badge: 'Vision OS • Translúcido',
    description:
      'Painéis de vidro espacial (Glassmorphism) com iluminação ambiente difusa, cantos orgânicos e tipografia flutuante.',
    wrapperClass:
      'bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white border-white/20',
    pageClass:
      'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl text-slate-100',
    accentColor: '#a78bfa',
    headerClass: 'text-violet-300 tracking-wide',
    bodyFont: 'font-sans',
  },
  {
    id: 'BIONIC_NEURAL',
    name: 'Bionic Speed-Reader IA',
    category: 'Futurista',
    badge: '+40% Velocidade Ocular',
    description:
      'Ancoragem neuro-visual que destaca os prefixos lexicais de cada palavra para leitura ultrarrápida sem fadiga.',
    wrapperClass: 'bg-zinc-950 text-zinc-100 border-violet-500/40',
    pageClass: 'bg-zinc-900/95 border border-violet-500/25 text-zinc-200',
    accentColor: '#8b5cf6',
    headerClass: 'text-violet-400 font-bold uppercase tracking-wider',
    bodyFont: 'font-sans',
  },
  {
    id: 'SWISS_MODERN',
    name: 'Neo-Brutalismo Swiss Grid',
    category: 'Moderno',
    badge: 'Design Suíço • Alto Contraste',
    description:
      'Grelha tipográfica suíça moderna com numeração gigante de capítulo, linhas arquitetónicas e contraste editorial puro.',
    wrapperClass: 'bg-stone-100 text-stone-950 border-stone-900',
    pageClass:
      'bg-white border-2 border-stone-900 shadow-[8px_8px_0px_#1c1917] text-stone-900',
    accentColor: '#4f46e5',
    headerClass: 'text-indigo-600 font-black uppercase tracking-tight',
    bodyFont: 'font-sans',
  },
  {
    id: 'MAGAZINE_SPREAD',
    name: 'Dupla Página Magazine Lux',
    category: 'Moderno',
    badge: 'Livro Aberto • 2 Colunas',
    description:
      'Experiência de revista executiva moderna em página dupla lado a lado com capitulares (Drop Caps) e cabeçalho editorial.',
    wrapperClass: 'bg-slate-200 dark:bg-slate-900 text-slate-900 border-slate-300',
    pageClass: 'bg-[#fcfbf9] text-slate-900 border border-slate-300 shadow-2xl',
    accentColor: '#be123c',
    headerClass: 'text-rose-700 font-serif italic',
    bodyFont: 'font-serif',
  },
  {
    id: 'MATRIX_TECH',
    name: 'Terminal Neural Dev',
    category: 'Futurista',
    badge: 'Cyber-Engenharia • Monospace',
    description:
      'Ambiente de leitura técnica de alta precisão em verde-esmeralda sobre obsidiana, ideal para livros de tecnologia e IA.',
    wrapperClass: 'bg-[#030b07] text-emerald-100 border-emerald-500/40',
    pageClass: 'bg-[#06140d] border border-emerald-500/30 text-emerald-50',
    accentColor: '#10b981',
    headerClass: 'text-emerald-400 font-mono uppercase tracking-widest',
    bodyFont: 'font-mono',
  },
  {
    id: 'AURORA_ZEN',
    name: 'Aurora Boreal Zen',
    category: 'Moderno',
    badge: 'Minimalismo Imersivo',
    description:
      'Atmosfera serena com luzes boreais suaves no topo, foco absoluto no texto e espaçamento respirável.',
    wrapperClass:
      'bg-gradient-to-b from-teal-950 via-slate-950 to-slate-950 text-slate-100 border-teal-500/30',
    pageClass: 'bg-slate-900/80 border border-teal-500/20 text-slate-100 shadow-xl',
    accentColor: '#2dd4bf',
    headerClass: 'text-teal-300 tracking-wider uppercase',
    bodyFont: 'font-sans',
  },
  {
    id: 'PAPER_EINK',
    name: 'Kindle Paperwhite Warm',
    category: 'Editorial',
    badge: 'E-Ink Conforto Ocular',
    description:
      'Simulação de papel creme orgânico com temperatura de cor quente anti-luz azul e tipografia literária clássica.',
    wrapperClass: 'bg-[#e8dfc8] text-[#2c221e] border-[#cbbba0]',
    pageClass: 'bg-[#f6f0e1] border border-[#dcd0b8] text-[#261c18] shadow-lg',
    accentColor: '#9a3412',
    headerClass: 'text-amber-900 font-serif uppercase tracking-widest',
    bodyFont: 'font-serif',
  },
]

interface FuturisticReaderProps {
  book: any
  selectedChapter: any
  onSelectChapter: (ch: any) => void
  initialModel?: ReadingModelId
  onModelChange?: (modelId: ReadingModelId) => void
}

function renderBionicWord(word: string, key: number) {
  if (word.length <= 2) {
    return (
      <span key={key}>
        <strong className="font-extrabold text-white underline decoration-violet-500/40">{word}</strong>{' '}
      </span>
    )
  }
  const splitIdx = Math.ceil(word.length * 0.45)
  const prefix = word.slice(0, splitIdx)
  const suffix = word.slice(splitIdx)
  return (
    <span key={key}>
      <strong className="font-extrabold opacity-100">{prefix}</strong>
      <span className="opacity-75">{suffix}</span>{' '}
    </span>
  )
}

export function FuturisticReader({
  book,
  selectedChapter,
  onSelectChapter,
  initialModel = 'CYBER_HUD',
  onModelChange,
}: FuturisticReaderProps) {
  const [modelId, setModelId] = useState<ReadingModelId>(initialModel)
  const [bionicEnabled, setBionicEnabled] = useState(false)
  const [twoColumns, setTwoColumns] = useState(false)
  const [fontSize, setFontSize] = useState<number>(17)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // 8K AI Image & Visual Studio State
  const [visualStyle, setVisualStyle] = useState<VisualStyleId | undefined>(undefined)
  const [aiModel, setAiModel] = useState<AIImageModelId>('FLUX_PRO_ULTRA')
  const [showVisualStudio, setShowVisualStudio] = useState(false)
  const [customImagePrompt, setCustomImagePrompt] = useState('')
  const [useShaderFallback, setUseShaderFallback] = useState(false)

  const activeVisual = getChapterHeroVisual(selectedChapter?.position || 1, visualStyle)
  const secondaryVisual =
    VISUAL_PRESETS[((selectedChapter?.position || 1) + 2) % VISUAL_PRESETS.length]

  const activeModel = READING_MODELS.find((m) => m.id === modelId) || READING_MODELS[0]
  const effectiveBionic = bionicEnabled || modelId === 'BIONIC_NEURAL'
  const effectiveTwoCols = twoColumns || modelId === 'MAGAZINE_SPREAD'

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function handleSelectModel(id: ReadingModelId) {
    setModelId(id)
    if (onModelChange) onModelChange(id)
  }

  function getRawChapterContent(ch: any): string {
    if (!ch) return ''
    if (ch.sections && ch.sections.length > 0) {
      return ch.sections.map((s: any) => s.content).join('\n\n')
    }
    return ch.summary || ''
  }

  const rawText = getRawChapterContent(selectedChapter)
  const wordCount = rawText.split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220))

  const chapters = book?.chapters || []
  const currentIdx = chapters.findIndex((c: any) => c.id === selectedChapter?.id)
  const prevChapter = currentIdx > 0 ? chapters[currentIdx - 1] : null
  const nextChapter = currentIdx >= 0 && currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null

  function handleToggleSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const cleanText = rawText.replace(/[#>*_-]/g, ' ')
    const utterance = new SpeechSynthesisUtterance(
      `${selectedChapter?.title || ''}. ${cleanText}`
    )
    utterance.lang = 'pt-PT'
    utterance.rate = 1.05
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  // Parse markdown blocks into structured paragraphs/headings
  const blocks = rawText
    .split('\n\n')
    .map((b) => b.trim())
    .filter(Boolean)

  return (
    <div
      className={`flex flex-col space-y-5 ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 overflow-y-auto bg-background' : 'w-full'
      }`}
    >
      {/* Top Control Deck: 8 Futuristic & Modern Reading Models */}
      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              NEXORA Reading Engine • 8 Modelos de Leitura Futuristas & Modernos
            </span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">
              Escolhe a Experiência Visual de Leitura do E-book
            </h2>
          </div>

          {/* Interactive Reading Enhancements Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowVisualStudio(!showVisualStudio)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                showVisualStudio
                  ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white border-amber-500 shadow-md'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'
              }`}
              title="Abrir Estúdio de Imagens IA 8K (FLUX.1 Pro Ultra / Midjourney Style)"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Imagens 8K IA ({activeVisual.modelBadge})
            </button>

            <button
              type="button"
              onClick={() => setBionicEnabled(!bionicEnabled)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                effectiveBionic
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
              title="Ativar ancoragem cognitiva Bionic Reading"
            >
              <Zap className="w-3.5 h-3.5" />
              Leitura Biónica {effectiveBionic ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={() => setTwoColumns(!twoColumns)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                effectiveTwoCols
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
              title="Alternar página dupla / 2 colunas"
            >
              <Columns className="w-3.5 h-3.5" />
              2 Colunas
            </button>

            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isSpeaking
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isSpeaking ? 'Parar Áudio IA' : 'Ouvir Capítulo (Áudio IA)'}
            </button>

            <div className="flex items-center rounded-xl border border-border bg-background px-1">
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.max(13, s - 1))}
                className="px-2 py-1 text-xs font-bold text-muted-foreground hover:text-foreground"
                title="Diminuir fonte"
              >
                A-
              </button>
              <span className="text-[11px] font-mono px-1.5 text-muted-foreground">
                {fontSize}px
              </span>
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                className="px-2 py-1 text-xs font-bold text-muted-foreground hover:text-foreground"
                title="Aumentar fonte"
              >
                A+
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
              title={isFullscreen ? 'Sair de ecrã inteiro' : 'Modo Imersivo Ecrã Inteiro'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 8 Reading Model Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {READING_MODELS.map((m) => {
            const active = m.id === modelId
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectModel(m.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                  active
                    ? 'border-violet-600 bg-violet-500/10 shadow-md scale-[1.02]'
                    : 'border-border bg-background/60 hover:border-violet-400/60'
                }`}
              >
                <div>
                  <span
                    className="inline-block w-full h-2 rounded-full mb-2"
                    style={{ backgroundColor: m.accentColor }}
                  />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-violet-500 block">
                    {m.category}
                  </span>
                  <p className="text-xs font-bold text-foreground leading-tight mt-0.5">
                    {m.name}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-2 block truncate">
                  {m.badge}
                </span>
              </button>
            )
          })}
        </div>

        {/* Expandable 8K AI Image & Visual Direction Studio */}
        {showVisualStudio && (
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-violet-500/5 to-cyan-500/5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
                  NEXORA Neural Image Engine 8K • Supera o Motor Visual do Gamma
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  Direção de Arte Fotográfica, 3D Octane & Cinematográfica por Capítulo
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {AI_IMAGE_MODELS.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setAiModel(mod.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      aiModel === mod.id
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mod.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {VISUAL_PRESETS.map((preset) => {
                const isSelected = activeVisual.id === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setVisualStyle(preset.id)
                      setUseShaderFallback(false)
                    }}
                    className={`group rounded-xl overflow-hidden border-2 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 shadow-lg scale-[1.02]'
                        : 'border-border hover:border-amber-400/60'
                    }`}
                  >
                    <div className="h-14 w-full relative overflow-hidden bg-slate-900">
                      <img
                        src={preset.imageUrl}
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).src = preset.fallbackSvgUrl
                        }}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-2 bg-card">
                      <p className="text-[10px] font-bold text-foreground truncate">{preset.name}</p>
                      <p className="text-[9px] text-amber-500 font-semibold truncate">
                        {preset.modelBadge}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customImagePrompt}
                onChange={(e) => setCustomImagePrompt(e.target.value)}
                placeholder="Descreve a fotografia 8K ou cena 3D para este capítulo (ex: Arquitetura futurista em vidro e ouro, iluminação volumétrica IMAX)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-input bg-background text-xs text-foreground"
              />
              <button
                type="button"
                onClick={() => {
                  const currentPos = VISUAL_PRESETS.findIndex((p) => p.id === activeVisual.id)
                  const nextPreset = VISUAL_PRESETS[(currentPos + 1) % VISUAL_PRESETS.length]
                  setVisualStyle(nextPreset.id)
                  setUseShaderFallback(false)
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 text-white text-xs font-extrabold shadow-md hover:opacity-90 whitespace-nowrap"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Renderizar Nova Imagem 8K ({aiModel.replace(/_/g, ' ')})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Reading Viewport */}
      <div
        className={`rounded-3xl border-2 p-6 sm:p-10 transition-all duration-300 relative overflow-hidden ${activeModel.wrapperClass}`}
      >
        {/* Futuristic HUD Top Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-current/15 text-xs">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase"
              style={{
                backgroundColor: `${activeModel.accentColor}25`,
                color: activeModel.accentColor,
              }}
            >
              MODELO: {activeModel.name}
            </span>
            <span className="opacity-75 font-medium">
              {book?.title} • Cap. {selectedChapter?.position || 1}/{chapters.length}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] opacity-80">
            <span>{wordCount} PALAVRAS</span>
            <span>•</span>
            <span>~{readingMinutes} MIN LEITURA</span>
            <span>•</span>
            <span>FORMATO {book?.config?.pageFormat || 'A4'}</span>
          </div>
        </div>

        {/* Inner Book Page Canvas */}
        <div
          className={`max-w-5xl mx-auto rounded-2xl p-8 sm:p-12 transition-all ${activeModel.pageClass} ${activeModel.bodyFont}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.75 }}
        >
          {/* Cinema-Grade 8K Visual Hero Banner for the Chapter */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-current/20 shadow-2xl relative group">
            <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-slate-950">
              <img
                src={useShaderFallback ? activeVisual.fallbackSvgUrl : activeVisual.imageUrl}
                onError={() => setUseShaderFallback(true)}
                alt={selectedChapter?.title || 'Arte Visual 8K'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${activeVisual.overlayGradient}`}
              />
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                  🎨 {activeVisual.modelBadge} • {activeVisual.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentPos = VISUAL_PRESETS.findIndex((p) => p.id === activeVisual.id)
                  const nextPreset = VISUAL_PRESETS[(currentPos + 1) % VISUAL_PRESETS.length]
                  setVisualStyle(nextPreset.id)
                  setUseShaderFallback(false)
                }}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-violet-600 text-white text-[11px] font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                Trocar Fotografia / Render 8K
              </button>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/85">
                <span className="font-medium truncate">
                  {customImagePrompt || activeVisual.description}
                </span>
                <span className="font-mono text-[10px] opacity-75 shrink-0 ml-2">
                  ULTRA-HD 8K • HDR10
                </span>
              </div>
            </div>
          </div>

          {/* Chapter Number & Header */}
          <div className="mb-8 pb-6 border-b border-current/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className={`text-xs mb-2 ${activeModel.headerClass}`}>
                PARTE {selectedChapter?.partPosition || 1} — CAPÍTULO 0{selectedChapter?.position || 1}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {selectedChapter?.title || 'Capítulo Selecionado'}
              </h1>
            </div>
            <div
              className="text-4xl sm:text-6xl font-black opacity-20 font-mono select-none"
              style={{ color: activeModel.accentColor }}
            >
              0{selectedChapter?.position || 1}
            </div>
          </div>

          {/* Summary Callout Box in Futuristic Style */}
          {selectedChapter?.summary && (
            <div
              className="mb-8 p-5 rounded-xl border-l-4 text-sm leading-relaxed opacity-90"
              style={{
                borderColor: activeModel.accentColor,
                backgroundColor: `${activeModel.accentColor}12`,
              }}
            >
              <strong className="uppercase tracking-wider text-xs block mb-1" style={{ color: activeModel.accentColor }}>
                Síntese Neural do Capítulo (BookMemory)
              </strong>
              {selectedChapter.summary}
            </div>
          )}

          {/* Main Chapter Body (Supports 1 or 2 columns + Bionic Reading) */}
          <div className={effectiveTwoCols ? 'md:columns-2 md:gap-10 space-y-5' : 'space-y-5'}>
            {blocks.map((block, bIdx) => {
              if (block.startsWith('# ')) {
                return null // Already rendered in main chapter header
              }
              if (block.startsWith('## ')) {
                return (
                  <h2
                    key={bIdx}
                    className="text-xl sm:text-2xl font-extrabold pt-4 pb-1 tracking-tight break-after-avoid"
                    style={{ color: activeModel.accentColor }}
                  >
                    {block.replace('## ', '')}
                  </h2>
                )
              }
              if (block.startsWith('> ')) {
                return (
                  <blockquote
                    key={bIdx}
                    className="p-4 rounded-xl border border-current/20 italic my-4 text-sm sm:text-base"
                  >
                    {block.replace('> ', '')}
                  </blockquote>
                )
              }
              if (block.startsWith('- ') || block.startsWith('1. ')) {
                const items = block.split('\n')
                return (
                  <ul key={bIdx} className="space-y-2 pl-4 border-l-2 border-current/20 my-3">
                    {items.map((item, i) => (
                      <li key={i} className="text-sm sm:text-base leading-relaxed">
                        {item.replace(/^(-|\d+\.)\s*/, '• ')}
                      </li>
                    ))}
                  </ul>
                )
              }

              const cleanParagraph = block.replace(/\*\*/g, '')
              const isFirstPara = bIdx === 0 || (bIdx === 1 && blocks[0].startsWith('# '))

              return (
                <p
                  key={bIdx}
                  className={`leading-relaxed ${
                    isFirstPara && modelId === 'MAGAZINE_SPREAD'
                      ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:leading-none'
                      : ''
                  }`}
                >
                  {effectiveBionic
                    ? cleanParagraph.split(/\s+/).map((w, wIdx) => renderBionicWord(w, wIdx))
                    : cleanParagraph}
                </p>
              )
            })}
          </div>

          {/* Inline Editorial 8K Visual Figure Plate */}
          <figure className="mt-10 rounded-2xl overflow-hidden border border-current/15 bg-black/20">
            <div className="h-48 sm:h-60 w-full relative overflow-hidden">
              <img
                src={secondaryVisual.imageUrl}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = secondaryVisual.fallbackSvgUrl
                }}
                alt={secondaryVisual.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-[11px] font-bold text-white/90">
                Figura {selectedChapter?.position || 1}.1 — {secondaryVisual.name} ({secondaryVisual.modelBadge})
              </span>
            </div>
          </figure>

          {/* Bottom Page Footer & Chapter Switcher */}
          <div className="mt-12 pt-6 border-t border-current/15 flex flex-wrap items-center justify-between gap-4 text-xs">
            <button
              type="button"
              disabled={!prevChapter}
              onClick={() => prevChapter && onSelectChapter(prevChapter)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-current/20 font-bold disabled:opacity-30 hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
              {prevChapter ? `Cap. ${prevChapter.position}: ${prevChapter.title.slice(0, 26)}...` : 'Início da Obra'}
            </button>

            <span className="font-mono opacity-60">
              PÁGINA {selectedChapter?.position || 1} • NEXORA READING ENGINE 2.0
            </span>

            <button
              type="button"
              disabled={!nextChapter}
              onClick={() => nextChapter && onSelectChapter(nextChapter)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-current/20 font-bold disabled:opacity-30 hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: nextChapter ? `${activeModel.accentColor}25` : undefined,
              }}
            >
              {nextChapter ? `Próximo: Cap. ${nextChapter.position} →` : 'Fim da Obra'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
