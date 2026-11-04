'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  Download,
  Save,
  ArrowLeft,
  Loader2,
  Check,
  Play,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Undo2,
  Redo2,
  Wand2,
  ShieldCheck,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react'
import { SlideCanvas } from '@/components/presentations/SlideCanvas'

const THEMES_LIST = [
  'CORPORATE',
  'EXECUTIVE',
  'MINIMALIST',
  'EDUCATIONAL',
  'ACADEMIC',
  'TECH',
  'FINANCIAL',
  'CREATIVE',
  'INSTITUTIONAL',
  'PREMIUM',
]

const LAYOUTS_LIST = [
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

const AI_QUICK_COMMANDS = [
  'Melhora o design desta apresentação.',
  'Transforma este slide num infográfico.',
  'Cria mais dez slides.',
  'Reduz o texto.',
  'Adiciona exemplos.',
  'Traduz para francês.',
  'Cria notas para o apresentador.',
]

const THEME_COLORS: Record<string, any> = {
  TECH: { background: '#090D16', surface: '#131B2E', text: '#F3E8FF', textMuted: '#A78BFA', primary: '#7C3AED', accent: '#22D3EE', border: '#2E1065' },
  CORPORATE: { background: '#0F172A', surface: '#1E293B', text: '#F8FAFC', textMuted: '#94A3B8', primary: '#2563EB', accent: '#38BDF8', border: '#334155' },
  EXECUTIVE: { background: '#111827', surface: '#1F2937', text: '#F9FAFB', textMuted: '#D1D5DB', primary: '#D97706', accent: '#FBBF24', border: '#374151' },
  MINIMALIST: { background: '#FFFFFF', surface: '#F8FAFC', text: '#0F172A', textMuted: '#475569', primary: '#4F46E5', accent: '#06B6D4', border: '#E2E8F0' },
  PREMIUM: { background: '#09090B', surface: '#18181B', text: '#FAFAFA', textMuted: '#A1A1AA', primary: '#EAB308', accent: '#FACC15', border: '#27272A' },
}

function createDemoPresentation(id: string) {
  return {
    id,
    title: 'Pitch Deck Executivo Q4 — NEXORA AI 2.0 Enterprise',
    description: 'Apresentação Widescreen 16:9 com validação WCAG AAA e 20 layouts',
    themeId: 'TECH',
    themeSpec: {
      id: 'TECH',
      name: 'Tecnológico & IA',
      contrastRatio: 11.4,
      wcagLevel: 'AAA',
      colors: THEME_COLORS.TECH,
    },
    slides: [
      {
        id: 'sl_1',
        position: 1,
        title: 'NEXORA AI 2.0 — O Futuro da Criação Multimodal',
        speakerNotes: 'Boas-vindas ao Conselho. Apresentar a tese de consolidação de 6 estúdios numa única plataforma.',
        content: {
          layout: 'COVER',
          subtitle: 'Apresentações 16:9, E-books de 500 Páginas, Documentos, Mapas Mentais, Infográficos e Websites',
          bullets: [
            'Arquitetura Enterprise Multi-Tenant com Garantia Zero-Training',
            'Motor Editorial Longform com BookMemory até 1.000 páginas',
            'Transmutação Omni-Morph™ 1-para-6 e Leitura Futurista 8K',
          ],
        },
      },
      {
        id: 'sl_2',
        position: 2,
        title: 'Indicadores de Impacto e Retorno Operacional (KPIs)',
        speakerNotes: 'Destacar a redução de 70% no tempo de produção e a consolidação de licenças.',
        content: {
          layout: 'STATISTICS',
          subtitle: 'Métricas auditadas em equipas editoriais, consultoras e operações B2B',
          metrics: [
            { value: '+70%', label: 'Velocidade de Produção', description: 'Da ideia à exportação pronta em minutos' },
            { value: '6 em 1', label: 'Estúdios Unificados', description: 'Substitui 5 ferramentas isoladas' },
            { value: '11.4:1', label: 'Contraste WCAG AAA', description: 'Legibilidade matemática garantida' },
          ],
        },
      },
      {
        id: 'sl_3',
        position: 3,
        title: 'Vantagem Competitiva: NEXORA 2.0 vs. Soluções Tradicionais',
        speakerNotes: 'Comparar diretamente com geradores de slides simples e chatbots sem memória.',
        content: {
          layout: 'COMPARISON',
          subtitle: 'Por que organizações migram para um ecossistema multimodal integrado',
          leftTitle: 'Ferramentas Isoladas (Slides / Chat)',
          leftItems: [
            'Perdem contexto após ~15 páginas',
            'Apenas 1 formato de saída',
            'Sem auditoria de coerência ou contraste',
          ],
          rightTitle: 'Ecossistema NEXORA AI 2.0',
          rightItems: [
            'Obras de 10 a 1.000 páginas com BookMemory',
            '8 Formatos Nativos (PPTX, PDF, EPUB 3, DOCX, SVG, ZIP)',
            'Transmutação Omni-Morph™ e Imagens 8K IA',
          ],
        },
      },
      {
        id: 'sl_4',
        position: 4,
        title: 'Roteiro de Implementação Enterprise em 4 Etapas',
        speakerNotes: 'Apresentar o cronograma de rollout de 30 dias.',
        content: {
          layout: 'TIMELINE',
          subtitle: 'Adoção imediata sem fricção técnica',
          steps: [
            { phase: 'Semana 1', title: 'Onboarding & Brand Kit', description: 'Configuração de temas, logótipos e permissões RBAC.' },
            { phase: 'Semana 2', title: 'Migração Universal', description: 'Importação de documentos PDF/DOCX/PPTX existentes.' },
            { phase: 'Semana 3', title: 'Produção Multimodal', description: 'Geração de propostas, pitch decks e e-books.' },
            { phase: 'Semana 4', title: 'Escala via API REST v1', description: 'Automação contínua e telemetria de leitura.' },
          ],
        },
      },
    ],
  }
}

export default function PresentationStudioPage() {
  const params = useParams()
  const presentationId = (params?.id as string) || 'demo-pres'

  const [presentation, setPresentation] = useState<any>(null)
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Undo / Redo History Stack
  const [historyStack, setHistoryStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])

  // AI Assistant
  const [customAiPrompt, setCustomAiPrompt] = useState('')
  const [isRunningAi, setIsRunningAi] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [applyToCurrentSlideOnly, setApplyToCurrentSlideOnly] = useState(false)

  // Presentation Mode (Fullscreen)
  const [isPresenting, setIsPresenting] = useState(false)

  async function loadPresentation(preserveSelection = true) {
    if (!presentationId) return

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`nexora_pres_${presentationId}`)
      if (cached) {
        try {
          const data = JSON.parse(cached)
          setPresentation(data)
          if (data.slides && data.slides.length > 0 && (!selectedSlideId || !preserveSelection)) {
            setSelectedSlideId(data.slides[0].id)
          }
          return
        } catch {
          // continue
        }
      }
    }

    try {
      const res = await fetch(`http://localhost:3001/api/v1/presentations/${presentationId}`).catch(() => null)
      if (res && res.ok) {
        const data = await res.json()
        setPresentation(data)
        if (data.slides && data.slides.length > 0 && (!selectedSlideId || !preserveSelection)) {
          setSelectedSlideId(data.slides[0].id)
        }
        return
      }
    } catch {
      // fallback below
    }

    const demo = createDemoPresentation(presentationId)
    setPresentation(demo)
    if (!selectedSlideId || !preserveSelection) {
      setSelectedSlideId(demo.slides[0].id)
    }
  }

  useEffect(() => {
    loadPresentation(false)
  }, [presentationId])

  const selectedSlide = presentation?.slides?.find((s: any) => s.id === selectedSlideId)
  const selectedIndex = presentation?.slides?.findIndex((s: any) => s.id === selectedSlideId) ?? 0

  function pushUndoSnapshot() {
    if (!presentation) return
    setHistoryStack((prev) => [...prev.slice(-15), JSON.parse(JSON.stringify(presentation))])
    setRedoStack([])
  }

  function handleUndo() {
    if (historyStack.length === 0) return
    const previous = historyStack[historyStack.length - 1]
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(presentation))])
    setHistoryStack((prev) => prev.slice(0, -1))
    setPresentation(previous)
  }

  function handleRedo() {
    if (redoStack.length === 0) return
    const nextState = redoStack[redoStack.length - 1]
    setHistoryStack((prev) => [...prev, JSON.parse(JSON.stringify(presentation))])
    setRedoStack((prev) => prev.slice(0, -1))
    setPresentation(nextState)
  }

  function handleTitleEdit(newTitle: string) {
    if (!presentation || !selectedSlideId) return
    pushUndoSnapshot()
    const nextSlides = presentation.slides.map((s: any) =>
      s.id === selectedSlideId ? { ...s, title: newTitle } : s,
    )
    setPresentation({ ...presentation, slides: nextSlides })
  }

  function handleContentEdit(newContent: any) {
    if (!presentation || !selectedSlideId) return
    pushUndoSnapshot()
    const nextSlides = presentation.slides.map((s: any) =>
      s.id === selectedSlideId ? { ...s, content: newContent } : s,
    )
    setPresentation({ ...presentation, slides: nextSlides })
  }

  function handleSpeakerNotesEdit(newNotes: string) {
    if (!presentation || !selectedSlideId) return
    const nextSlides = presentation.slides.map((s: any) =>
      s.id === selectedSlideId ? { ...s, speakerNotes: newNotes } : s,
    )
    setPresentation({ ...presentation, slides: nextSlides })
  }

  async function handleSaveSlide() {
    if (!selectedSlide) return
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/presentations/${presentationId}/slides/${selectedSlide.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: selectedSlide.title,
            content: selectedSlide.content,
            speakerNotes: selectedSlide.speakerNotes,
          }),
        },
      )
      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2500)
      }
    } catch (err) {
      console.error('Erro ao guardar slide:', err)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleChangeLayout(newLayout: string) {
    if (!selectedSlide) return
    pushUndoSnapshot()
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/presentations/${presentationId}/slides/${selectedSlide.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layout: newLayout }),
        },
      )
      if (res.ok) {
        await loadPresentation(true)
      }
    } catch (err) {
      console.error('Erro ao alterar layout:', err)
    }
  }

  async function handleChangeTheme(newThemeId: string) {
    pushUndoSnapshot()
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/presentations/${presentationId}/theme`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeId: newThemeId }),
        },
      )
      if (res.ok) {
        const updated = await res.json()
        setPresentation(updated)
      }
    } catch (err) {
      console.error('Erro ao alterar tema:', err)
    }
  }

  async function handleDuplicateSlide(slideId: string) {
    pushUndoSnapshot()
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/presentations/${presentationId}/slides/${slideId}/duplicate`,
        { method: 'POST' },
      )
      if (res.ok) {
        const updated = await res.json()
        setPresentation(updated)
      }
    } catch (err) {
      console.error('Erro ao duplicar slide:', err)
    }
  }

  async function handleDeleteSlide(slideId: string) {
    if ((presentation?.slides?.length || 0) <= 1) return
    pushUndoSnapshot()
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/presentations/${presentationId}/slides/${slideId}`,
        { method: 'DELETE' },
      )
      if (res.ok) {
        const updated = await res.json()
        setPresentation(updated)
        if (selectedSlideId === slideId && updated.slides?.length > 0) {
          setSelectedSlideId(updated.slides[0].id)
        }
      }
    } catch (err) {
      console.error('Erro ao eliminar slide:', err)
    }
  }

  async function handleMoveSlide(idx: number, direction: -1 | 1) {
    if (!presentation?.slides) return
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= presentation.slides.length) return

    pushUndoSnapshot()
    const nextSlides = [...presentation.slides]
    const temp = nextSlides[idx]
    nextSlides[idx] = nextSlides[targetIdx]
    nextSlides[targetIdx] = temp

    const slideIds = nextSlides.map((s: any) => s.id)
    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/presentations/${presentationId}/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slideIds }),
        },
      )
      if (res.ok) {
        const updated = await res.json()
        setPresentation(updated)
      }
    } catch (err) {
      console.error('Erro ao reordenar slides:', err)
    }
  }

  async function handleExecuteAiCommand(cmdText: string) {
    if (!cmdText.trim()) return
    pushUndoSnapshot()
    setIsRunningAi(true)
    setAiFeedback(null)

    try {
      const res = await fetch(
        `http://localhost:3001/api/v1/presentations/${presentationId}/ai-command`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: cmdText,
            slideId: applyToCurrentSlideOnly ? selectedSlideId : undefined,
          }),
        },
      )

      if (res.ok) {
        const data = await res.json()
        setPresentation(data.presentation)
        setAiFeedback(data.actionApplied)
        setCustomAiPrompt('')
      }
    } catch (err) {
      console.error('Erro ao executar comando IA:', err)
    } finally {
      setIsRunningAi(false)
    }
  }

  function handleExport(format: 'pptx' | 'pdf') {
    window.open(
      `http://localhost:3001/api/v1/presentations/${presentationId}/export/${format}`,
      '_blank',
    )
  }

  if (!presentation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const totalSlides = presentation.slides?.length || 1
  const currentLayout = selectedSlide?.content?.layout || 'TITLE_AND_TEXT'
  const designScore = presentation.designValidation?.designScore || 96
  const wcagLevel = presentation.designValidation?.wcagLevel || 'AAA'

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* FULLSCREEN PRESENTATION MODE OVERLAY */}
      {isPresenting && selectedSlide && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 md:p-12">
          <div className="flex items-center justify-between text-white/80 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">{presentation.title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10">
                Slide {selectedIndex + 1} / {totalSlides}
              </span>
            </div>
            <button
              onClick={() => setIsPresenting(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              <X className="w-4 h-4" />
              Sair da Apresentação
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center max-w-6xl mx-auto w-full">
            <SlideCanvas
              slide={selectedSlide}
              themeSpec={presentation.themeSpec}
              editable={false}
            />
          </div>

          <div className="flex items-center justify-between mt-4 text-white">
            <div className="text-xs text-white/70 max-w-2xl truncate">
              {selectedSlide.speakerNotes && `Notas: ${selectedSlide.speakerNotes}`}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={selectedIndex <= 0}
                onClick={() =>
                  setSelectedSlideId(presentation.slides[selectedIndex - 1]?.id)
                }
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={selectedIndex >= totalSlides - 1}
                onClick={() =>
                  setSelectedSlideId(presentation.slides[selectedIndex + 1]?.id)
                }
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Studio Bar */}
      <header className="h-16 px-4 border-b border-border bg-card flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/presentations"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            title="Voltar às Apresentações"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-foreground truncate max-w-xs">
                {presentation.title}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                <ShieldCheck className="w-3 h-3" /> Design {designScore}% (WCAG {wcagLevel})
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {totalSlides} slides • Tema {presentation.theme}
            </p>
          </div>
        </div>

        {/* Center Design Controls: Theme & Layout Switchers + Undo/Redo */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyStack.length === 0}
              className="p-2 rounded-lg border border-input text-foreground hover:bg-accent disabled:opacity-40"
              title="Desfazer (Undo)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-2 rounded-lg border border-input text-foreground hover:bg-accent disabled:opacity-40"
              title="Refazer (Redo)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <select
            value={presentation.theme || 'TECH'}
            onChange={(e) => handleChangeTheme(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold text-foreground"
            title="Alterar Tema Visual"
          >
            {THEMES_LIST.map((t) => (
              <option key={t} value={t}>
                Tema: {t}
              </option>
            ))}
          </select>

          <select
            value={currentLayout}
            onChange={(e) => handleChangeLayout(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold text-violet-600"
            title="Alterar Layout do Slide (20 Layouts)"
          >
            {LAYOUTS_LIST.map((l) => (
              <option key={l} value={l}>
                Layout: {l}
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions: Save, Present Mode, Export PPTX & PDF */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveSlide}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input text-xs font-semibold text-foreground hover:bg-accent"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saveSuccess ? 'Guardado' : 'Guardar'}
          </button>

          <button
            onClick={() => setIsPresenting(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Apresentar
          </button>

          <div className="flex items-center rounded-lg border border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/30 p-0.5">
            <button
              onClick={() => handleExport('pptx')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:opacity-90"
              title="Exportar em PowerPoint (.pptx)"
            >
              <Download className="w-3 h-3" />
              PPTX
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-2.5 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-md"
              title="Exportar em PDF 16:9"
            >
              PDF 16:9
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Slides List & Reorder/Duplicate/Delete */}
        <aside className="w-72 border-r border-border bg-card/60 flex flex-col shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Slides ({totalSlides})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {presentation.slides?.map((s: any, idx: number) => {
              const isSelected = s.id === selectedSlideId
              const lay = s.content?.layout || 'TITLE_AND_TEXT'

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSlideId(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 shadow-sm'
                      : 'border-border/60 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-violet-600">
                      Slide {s.position}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                      {lay}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate mb-2">
                    {s.title}
                  </p>

                  {isSelected && (
                    <div
                      className="flex items-center justify-end gap-1 pt-1 border-t border-border/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleMoveSlide(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 1)}
                        disabled={idx === totalSlides - 1}
                        className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateSlide(s.id)}
                        className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
                        title="Duplicar slide"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(s.id)}
                        disabled={totalSlides <= 1}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive disabled:opacity-30"
                        title="Eliminar slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* Center Canvas: Active 16:9 Slide + Speaker Notes */}
        <main className="flex-1 flex flex-col overflow-y-auto p-6 md:p-10 bg-muted/30">
          {selectedSlide ? (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              <SlideCanvas
                slide={selectedSlide}
                themeSpec={presentation.themeSpec}
                editable={true}
                onTitleChange={handleTitleEdit}
                onContentChange={handleContentEdit}
              />

              {/* Speaker Notes Panel */}
              <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                  Notas do Apresentador (Slide {selectedSlide.position})
                </label>
                <textarea
                  rows={2}
                  value={selectedSlide.speakerNotes || ''}
                  onChange={(e) => handleSpeakerNotesEdit(e.target.value)}
                  placeholder="Adiciona notas de oratória para te apoiar durante a apresentação..."
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Seleciona um slide à esquerda
            </div>
          )}
        </main>

        {/* Right Sidebar: NEXORA Contextual AI Assistant (Section 4.5 of Master Prompt) */}
        <aside className="hidden lg:flex w-80 border-l border-border bg-card/60 flex-col shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-violet-600" />
              Assistente de IA Contextual
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 font-semibold">
              Reversível
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <label className="inline-flex items-center gap-2 text-xs text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={applyToCurrentSlideOnly}
                onChange={(e) => setApplyToCurrentSlideOnly(e.target.checked)}
                className="rounded border-input text-violet-600"
              />
              Aplicar apenas ao Slide {selectedSlide?.position || 1} selecionado
            </label>

            {aiFeedback && (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs">
                ✓ {aiFeedback}
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase text-muted-foreground">
                Comandos Inteligentes Rápidos
              </span>
              {AI_QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleExecuteAiCommand(cmd)}
                  disabled={isRunningAi}
                  className="w-full text-left p-2.5 rounded-xl border border-border bg-background hover:border-violet-500 hover:bg-violet-50/30 dark:hover:bg-violet-950/20 text-xs font-medium text-foreground transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <span>"{cmd}"</span>
                  <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-border space-y-2">
              <span className="text-[11px] font-bold uppercase text-muted-foreground">
                Comando Personalizado
              </span>
              <textarea
                rows={3}
                value={customAiPrompt}
                onChange={(e) => setCustomAiPrompt(e.target.value)}
                placeholder="Ex: Transforma este slide num infográfico ou Cria mais dez slides..."
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs text-foreground"
              />
              <button
                onClick={() => handleExecuteAiCommand(customAiPrompt)}
                disabled={isRunningAi || !customAiPrompt.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {isRunningAi ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processando comando...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Executar Comando IA
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
