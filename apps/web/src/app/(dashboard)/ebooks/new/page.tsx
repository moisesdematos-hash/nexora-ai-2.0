'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Layers,
  Settings,
  Edit3,
  Sliders,
  Palette,
  Download,
} from 'lucide-react'

const PAGE_OPTIONS = [
  { pages: 10, label: '10 Páginas', type: 'Guia Breve', words: '~2.500 palavras', chapters: 4 },
  { pages: 20, label: '20 Páginas', type: 'Guia Prático', words: '~5.000 palavras', chapters: 6 },
  { pages: 50, label: '50 Páginas', type: 'E-book Compacto', words: '~12.500 palavras', chapters: 10 },
  { pages: 100, label: '100 Páginas', type: 'Livro Estruturado', words: '~25.000 palavras', chapters: 15 },
  { pages: 200, label: '200 Páginas', type: 'Livro Aprofundado', words: '~50.000 palavras', chapters: 20 },
  { pages: 500, label: '500 Páginas', type: 'Obra Extensa', words: '~125.000 palavras', chapters: 30 },
]

export const COVER_THEMES: Record<
  string,
  {
    id: string
    name: string
    bgStart: string
    bgEnd: string
    accent: string
    text: string
    badgeBg: string
  }
> = {
  CORPORATE_EXECUTIVE: {
    id: 'CORPORATE_EXECUTIVE',
    name: 'Executivo Corporativo',
    bgStart: '#0f172a',
    bgEnd: '#1e3a8a',
    accent: '#38bdf8',
    text: '#f8fafc',
    badgeBg: 'rgba(56,189,248,0.18)',
  },
  MINIMALIST_MODERN: {
    id: 'MINIMALIST_MODERN',
    name: 'Minimalista Editorial',
    bgStart: '#f8fafc',
    bgEnd: '#e2e8f0',
    accent: '#6d28d9',
    text: '#0f172a',
    badgeBg: 'rgba(109,40,217,0.12)',
  },
  ACADEMIC_CLASSIC: {
    id: 'ACADEMIC_CLASSIC',
    name: 'Académico Clássico',
    bgStart: '#1e1b4b',
    bgEnd: '#312e81',
    accent: '#fbbf24',
    text: '#fef3c7',
    badgeBg: 'rgba(251,191,36,0.18)',
  },
  TECH_FUTURISTIC: {
    id: 'TECH_FUTURISTIC',
    name: 'Tecnológico & IA',
    bgStart: '#18052c',
    bgEnd: '#3b0764',
    accent: '#c084fc',
    text: '#f3e8ff',
    badgeBg: 'rgba(192,132,252,0.2)',
  },
  CREATIVE_VIBRANT: {
    id: 'CREATIVE_VIBRANT',
    name: 'Criativo Vibrante',
    bgStart: '#831843',
    bgEnd: '#be123c',
    accent: '#fde047',
    text: '#fff1f2',
    badgeBg: 'rgba(253,224,71,0.2)',
  },
  LUXURY_EDITORIAL: {
    id: 'LUXURY_EDITORIAL',
    name: 'Premium Gold',
    bgStart: '#09090b',
    bgEnd: '#27272a',
    accent: '#f59e0b',
    text: '#fafafa',
    badgeBg: 'rgba(245,158,11,0.2)',
  },
}

export function buildCoverSvgDataUrl(params: {
  title: string
  subtitle: string
  author: string
  style: string
  badgeText: string
  targetPages: number
  pageFormat: string
}): string {
  const theme = COVER_THEMES[params.style] ?? COVER_THEMES.CORPORATE_EXECUTIVE
  const safeTitle = (params.title || 'Título da Obra Editorial').replace(/[<>&"]/g, '')
  const safeSub = (params.subtitle || 'Guia Completo Estruturado com Inteligência Artificial').replace(/[<>&"]/g, '')
  const safeAuthor = (params.author || 'NEXORA Studio').replace(/[<>&"]/g, '')
  const safeBadge = (params.badgeText || 'EDIÇÃO OFICIAL NEXORA AI').replace(/[<>&"]/g, '')

  // Wrap title into lines of ~22 chars
  const words = safeTitle.split(' ')
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    if ((current + ' ' + w).trim().length > 22 && lines.length < 3) {
      if (current) lines.push(current.trim())
      current = w
    } else {
      current = (current + ' ' + w).trim()
    }
  }
  if (current) lines.push(current.trim())

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bgStart}" />
        <stop offset="100%" stop-color="${theme.bgEnd}" />
      </linearGradient>
    </defs>
    <rect width="800" height="1200" fill="url(#bg)" />
    <circle cx="720" cy="140" r="260" fill="${theme.accent}" opacity="0.08" />
    <circle cx="80" cy="1080" r="320" fill="${theme.accent}" opacity="0.06" />
    <rect x="56" y="56" width="688" height="1088" rx="18" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.35" />
    <rect x="96" y="110" width="360" height="42" rx="21" fill="${theme.badgeBg}" />
    <text x="120" y="137" fill="${theme.accent}" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="800" letter-spacing="2">${safeBadge.toUpperCase()}</text>
    ${lines
      .map(
        (line, idx) =>
          `<text x="96" y="${280 + idx * 68}" fill="${theme.text}" font-family="Georgia, serif" font-size="54" font-weight="800">${line}</text>`
      )
      .join('')}
    <rect x="96" y="${310 + lines.length * 68}" width="140" height="6" rx="3" fill="${theme.accent}" />
    <text x="96" y="${370 + lines.length * 68}" fill="${theme.text}" opacity="0.82" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="500">${safeSub.slice(0, 52)}</text>
    <text x="96" y="${406 + lines.length * 68}" fill="${theme.text}" opacity="0.72" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="400">${safeSub.slice(52, 104)}</text>
    <line x1="96" y1="980" x2="704" y2="980" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="1.5" />
    <text x="96" y="1025" fill="${theme.accent}" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" letter-spacing="2">AUTOR / ORGANIZAÇÃO</text>
    <text x="96" y="1065" fill="${theme.text}" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800">${safeAuthor}</text>
    <text x="704" y="1065" text-anchor="end" fill="${theme.text}" opacity="0.65" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="600">${params.targetPages} Páginas • ${params.pageFormat}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export default function NewEbookPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isPlanning, setIsPlanning] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1 Form (Editorial Configuration + Cover Designer)
  const [topic, setTopic] = useState('Arquitetura de Sistemas de Inteligência Artificial Generativa')
  const [subtitleInput, setSubtitleInput] = useState(
    'Guia Prático e Estratégico da Conceção à Produção Enterprise'
  )
  const [author, setAuthor] = useState('NEXORA Studio')
  const [badgeText, setBadgeText] = useState('EDIÇÃO OFICIAL NEXORA AI')
  const [targetPages, setTargetPages] = useState(50)
  const [customPagesMode, setCustomPagesMode] = useState(false)
  const [tone, setTone] = useState('Profissional, analítico e inspirador')
  const [audience, setAudience] = useState('Empreendedores, engenheiros, gestores e criadores')
  const [objective, setObjective] = useState('Capacitar o leitor com domínio prático e estratégico')
  const [depth, setDepth] = useState('Aprofundado e Estruturado')
  const [editorialStyle, setEditorialStyle] = useState('Executivo Contemporâneo')
  const [pageFormat, setPageFormat] = useState<'A4' | '6x9' | '16x23' | 'A5'>('A4')
  const [coverStyle, setCoverStyle] = useState('CORPORATE_EXECUTIVE')
  const [includeExamples, setIncludeExamples] = useState(true)
  const [includeExercises, setIncludeExercises] = useState(true)
  const [includeReferences, setIncludeReferences] = useState(true)
  const [language, setLanguage] = useState('pt')

  // Step 2 & 3 Planned Outline
  const [outline, setOutline] = useState<any>(null)

  const liveCoverUrl = buildCoverSvgDataUrl({
    title: outline?.title || topic || 'Título da Obra Editorial',
    subtitle: outline?.subtitle || subtitleInput,
    author,
    style: coverStyle,
    badgeText,
    targetPages,
    pageFormat,
  })

  function generateFallbackOutline() {
    const selectedOption = PAGE_OPTIONS.find((o) => o.pages === targetPages)
    const chaptersCount = selectedOption?.chapters || Math.max(4, Math.min(30, Math.round(targetPages / 8)))
    const totalWordCount = targetPages * 250
    const wordsPerChapter = Math.round(totalWordCount / chaptersCount)

    const chapterTemplates = [
      'Fundamentos, Visão Geral e Contexto Estratégico',
      'Princípios Arquiteturais e Pilares Essenciais',
      'Metodologia de Implementação Passo a Passo',
      'Ferramentas, Ecossistema e Automação Inteligente',
      'Estudos de Caso Reais e Padrões de Sucesso',
      'Otimização de Desempenho, Escala e Governança',
      'Segurança, Conformidade e Mitigação de Riscos',
      'Métricas de Impacto, ROI e Indicadores-Chave (KPIs)',
      'Tendências Futuras e Próxima Geração Tecnológica',
      'Plano de Ação Prático e Guia de Execução',
    ]

    const chapters = Array.from({ length: chaptersCount }, (_, i) => {
      const partPos = Math.floor(i / Math.max(2, Math.ceil(chaptersCount / 3))) + 1
      const baseTitle = chapterTemplates[i % chapterTemplates.length]
      return {
        position: i + 1,
        partPosition: partPos,
        title: `${baseTitle} — ${topic.slice(0, 42)}`,
        summary: `Análise aprofundada sobre ${baseTitle.toLowerCase()} aplicada a ${topic}, incluindo exemplos práticos, quadros-resumo e exercícios de consolidação.`,
        targetWordCount: wordsPerChapter,
      }
    })

    return {
      title: topic.trim(),
      subtitle: subtitleInput.trim() || `Manual Completo de ${depth} (${targetPages} Páginas)`,
      synopsis: `Esta obra de ${targetPages} páginas explora de forma estruturada "${topic}", desenhada especificamente para ${audience} com tom ${tone.toLowerCase()}. Inclui memória editorial persistente (BookMemory), capa vetorial HD e formatação pronta para PDF, EPUB 3.0 e DOCX.`,
      targetPages,
      totalWordCount,
      parts: [
        { position: 1, title: 'Parte I — Fundamentos & Estratégia' },
        { position: 2, title: 'Parte II — Execução & Arquitetura Prática' },
        { position: 3, title: 'Parte III — Escala, Governança & Futuro' },
      ],
      chapters,
    }
  }

  async function handlePlanOutline(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim()) return

    setIsPlanning(true)
    setError(null)

    try {
      const selectedOption = PAGE_OPTIONS.find((o) => o.pages === targetPages)
      const res = await fetch('http://localhost:3001/api/v1/ebooks/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetPages,
          targetAudience: audience,
          objective,
          tone,
          depth,
          editorialStyle,
          language,
          chaptersCount: selectedOption?.chapters,
          includeExamples,
          includeExercises,
          includeReferences,
        }),
      }).catch(() => null)

      if (res && res.ok) {
        const data = await res.json()
        setOutline(data)
      } else {
        setOutline(generateFallbackOutline())
      }
      setStep(2)
    } catch {
      setOutline(generateFallbackOutline())
      setStep(2)
    } finally {
      setIsPlanning(false)
    }
  }

  async function handleCreateBook() {
    setIsCreating(true)
    setError(null)

    try {
      const generatedCoverUrl = buildCoverSvgDataUrl({
        title: outline.title,
        subtitle: outline.subtitle,
        author,
        style: coverStyle,
        badgeText,
        targetPages: outline.targetPages,
        pageFormat,
      })

      const bookRes = await fetch('http://localhost:3001/api/v1/ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `proj_${Date.now()}`,
          title: outline.title,
          subtitle: outline.subtitle,
          targetPages: outline.targetPages,
          language,
          author,
          outline,
          config: {
            author,
            badgeText,
            objective,
            depth,
            editorialStyle,
            pageFormat,
            coverStyle,
            includeExamples,
            includeExercises,
            includeReferences,
          },
        }),
      }).catch(() => null)

      if (bookRes && bookRes.ok) {
        const book = await bookRes.json()
        router.push(`/ebooks/${book.id}`)
        return
      }

      // Deterministic Local Studio Creation with Full Cover & Chapters
      const localId = `ebook-${Date.now()}`
      const localBook = {
        id: localId,
        title: outline.title,
        subtitle: outline.subtitle,
        coverUrl: generatedCoverUrl,
        currentWordCount: 1850,
        config: {
          author,
          badgeText,
          targetPages: outline.targetPages,
          pageFormat,
          coverStyle,
          editorialStyle,
          tone,
          audience,
        },
        chapters: outline.chapters.map((ch: any, idx: number) => ({
          id: `ch_${idx + 1}`,
          position: ch.position,
          title: ch.title,
          summary: ch.summary,
          status: idx === 0 ? 'READY' : 'PENDING',
          wordCount: idx === 0 ? 1850 : 0,
          sections:
            idx === 0
              ? [
                  {
                    title: '1.1 Introdução Executiva',
                    content: `# ${ch.title}\n\n${ch.summary}\n\n## 1. Enquadramento Estratégico\n\nO domínio de **${outline.title}** tornou-se um diferencial competitivo indispensável para ${audience}. Neste primeiro capítulo estabelecemos as bases concetuais, os princípios de engenharia e o roteiro prático que guiarão toda a obra.\n\n## 2. Pilares Fundamentais\n\n- **Arquitetura Modular:** Separação clara de responsabilidades e escalabilidade previsível.\n- **Memória Editorial Persistente (BookMemory):** Coerência terminológica garantida do primeiro ao último capítulo.\n- **Aplicação Prática:** Estudos de caso reais e listas de verificação acionáveis no final de cada secção.`,
                  },
                ]
              : [],
        })),
        memories: [
          {
            id: 'mem_1',
            key: 'Tese Central & Tom Editorial',
            value: `${outline.title} — Tom ${tone}, direcionado a ${audience}.`,
          },
          {
            id: 'mem_2',
            key: 'Design da Capa Oficial',
            value: `Estilo ${COVER_THEMES[coverStyle]?.name || coverStyle} (${pageFormat}) com selo "${badgeText}".`,
          },
        ],
        versions: [{ id: 'v1', title: 'Checkpoint #1 — Criação da Obra e Capa Oficial' }],
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(`nexora_ebook_${localId}`, JSON.stringify(localBook))
      }
      router.push(`/ebooks/${localId}`)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar o livro.')
      setIsCreating(false)
    }
  }

  function handleChapterTitleChange(index: number, newTitle: string) {
    if (!outline) return
    const updated = { ...outline }
    updated.chapters[index].title = newTitle
    setOutline(updated)
  }

  function handleDownloadCoverSvg() {
    const a = document.createElement('a')
    a.href = liveCoverUrl
    a.download = `capa-ebook-${(topic || 'nexora').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`
    a.click()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            NEXORA Ebook Studio — Criador de Livros & Capas Editoriais HD
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Etapa {step} de 3:{' '}
            {step === 1
              ? 'Configuração da Obra (10 a 500+ páginas) & Design da Capa em Tempo Real'
              : step === 2
              ? 'Planeamento Editorial, Capa Oficial e Partes'
              : 'Aprovação do Índice Estruturado'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
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

      {/* STEP 1: CONFIGURATION + LIVE COVER GENERATOR */}
      {step === 1 && (
        <form onSubmit={handlePlanOutline} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Columns: Configuration Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-600" />
                1. Título, Subtítulo, Autor e Idioma
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Título / Tema Principal da Obra (aparece na Capa)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Arquitetura de Sistemas de Inteligência Artificial Generativa"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Subtítulo da Capa
                </label>
                <input
                  type="text"
                  value={subtitleInput}
                  onChange={(e) => setSubtitleInput(e.target.value)}
                  placeholder="Ex: Guia Prático e Estratégico da Conceção à Produção Enterprise"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Autor / Organização
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Selo Superior da Capa (Badge)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Idioma da Obra
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm"
                  >
                    <option value="pt">Português</option>
                    <option value="en">Inglês (English)</option>
                    <option value="es">Espanhol (Español)</option>
                    <option value="fr">Francês (Français)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* COVER DESIGNER PALETTE */}
            <div className="p-6 rounded-2xl border border-violet-500/30 bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Palette className="w-5 h-5 text-violet-600" />
                  2. Estúdio de Capa Vetorial HD (6 Estilos Editoriais)
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-500">
                  Incluída em PDF, EPUB 3.0 & DOCX
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.values(COVER_THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setCoverStyle(theme.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      coverStyle === theme.id
                        ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/30 shadow-sm'
                        : 'border-border hover:border-violet-400'
                    }`}
                  >
                    <div
                      className="w-8 h-10 rounded-lg shrink-0 border border-white/20 shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${theme.bgStart}, ${theme.bgEnd})`,
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{theme.name}</p>
                      <p className="text-[10px] text-muted-foreground">Vetor 800×1200</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PAGE COUNT SELECTOR */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  3. Meta de Páginas (10 a 500+ Páginas)
                </h2>
                <button
                  type="button"
                  onClick={() => setCustomPagesMode(!customPagesMode)}
                  className="text-xs font-semibold text-violet-600 hover:underline"
                >
                  {customPagesMode ? 'Usar metas padrão' : 'Quantidade personalizada'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.pages}
                    type="button"
                    onClick={() => {
                      setCustomPagesMode(false)
                      setTargetPages(opt.pages)
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      !customPagesMode && targetPages === opt.pages
                        ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/30'
                        : 'border-border hover:border-violet-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base text-foreground">{opt.label}</span>
                      {!customPagesMode && targetPages === opt.pages && (
                        <Check className="w-4 h-4 text-violet-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{opt.type}</p>
                    <div className="mt-2 text-[11px] font-medium text-violet-600 dark:text-violet-400">
                      {opt.words} • {opt.chapters} capítulos
                    </div>
                  </button>
                ))}
              </div>

              {customPagesMode && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Número Personalizado de Páginas (5 a 1000 páginas):
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    value={targetPages}
                    onChange={(e) =>
                      setTargetPages(Math.max(5, Math.min(1000, Number(e.target.value))))
                    }
                    className="w-48 px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm"
                  />
                  <span className="ml-3 text-xs text-muted-foreground">
                    (~{(targetPages * 250).toLocaleString('pt-PT')} palavras estimadas)
                  </span>
                </div>
              )}
            </div>

            {/* TONE, AUDIENCE & FORMAT */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                4. Formato Editorial, Público e Elementos Pedagógicos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Público-Alvo
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Formato de Página
                  </label>
                  <select
                    value={pageFormat}
                    onChange={(e) => setPageFormat(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm"
                  >
                    <option value="A4">A4 Editorial (210 × 297 mm)</option>
                    <option value="6x9">6×9 pol. (Amazon KDP / Kindle)</option>
                    <option value="16x23">16×23 cm (Livro Técnico Clássico)</option>
                    <option value="A5">A5 (Pocket Book)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExamples}
                    onChange={(e) => setIncludeExamples(e.target.checked)}
                    className="rounded border-input text-violet-600 focus:ring-violet-500"
                  />
                  Estudos de Caso e Exemplos
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExercises}
                    onChange={(e) => setIncludeExercises(e.target.checked)}
                    className="rounded border-input text-violet-600 focus:ring-violet-500"
                  />
                  Exercícios Práticos por Capítulo
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeReferences}
                    onChange={(e) => setIncludeReferences(e.target.checked)}
                    className="rounded border-input text-violet-600 focus:ring-violet-500"
                  />
                  Glossário e Bibliografia
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPlanning || !topic.trim()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base hover:opacity-90 shadow-lg disabled:opacity-50 transition-all"
              >
                {isPlanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando Capa & Plano Editorial...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Capa & Plano Editorial Completo
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Sticky Column: Live 3D Cover Preview */}
          <div className="lg:sticky lg:top-6 p-6 rounded-2xl border border-border bg-card shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-violet-500">
                Pré-visualização da Capa Ao Vivo
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                800×1200 SVG HD
              </span>
            </div>

            <div className="flex justify-center py-2">
              <img
                src={liveCoverUrl}
                alt="Capa do E-book"
                className="w-64 rounded-xl shadow-2xl border border-border transition-all"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleDownloadCoverSvg}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-secondary text-foreground text-xs font-bold hover:border-violet-500 transition-all"
              >
                <Download className="w-4 h-4 text-violet-500" />
                Descarregar Capa Vetorial (.SVG)
              </button>
              <p className="text-[11px] text-center text-muted-foreground">
                A capa gerada acompanha automaticamente a exportação em PDF, EPUB 3.0 e DOCX, e pode ser editada a qualquer momento no estúdio.
              </p>
            </div>
          </div>
        </form>
      )}

      {/* STEP 2: EDITORIAL PLAN OVERVIEW + COVER CONFIRMATION */}
      {step === 2 && outline && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Plano Editorial & Capa Oficial Prontos
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Título da Obra
                  </label>
                  <input
                    type="text"
                    value={outline.title}
                    onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-input bg-background text-lg font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={outline.subtitle}
                    onChange={(e) => setOutline({ ...outline, subtitle: e.target.value })}
                    className="w-full mt-1 px-4 py-2 rounded-xl border border-input bg-background text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sinopse Editorial
                  </label>
                  <p className="mt-1 text-sm text-muted-foreground bg-muted/40 p-4 rounded-xl leading-relaxed">
                    {outline.synopsis}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border">
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-xs text-muted-foreground">Meta de Páginas</span>
                  <p className="text-lg font-bold text-foreground">{outline.targetPages} págs</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-xs text-muted-foreground">Volume Estimado</span>
                  <p className="text-lg font-bold text-foreground">
                    ~{outline.totalWordCount?.toLocaleString('pt-PT')} pal.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-xs text-muted-foreground">Partes & Capítulos</span>
                  <p className="text-lg font-bold text-foreground">
                    {outline.parts?.length || 1} partes / {outline.chapters?.length} caps
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <span className="text-xs text-muted-foreground">Formato</span>
                  <p className="text-sm font-bold text-foreground truncate">{pageFormat}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-input text-sm font-medium hover:bg-accent"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à Configuração & Capa
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md"
              >
                Rever Índice de Capítulos ({outline.chapters?.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card flex flex-col items-center space-y-3">
            <span className="text-xs font-bold text-violet-500 uppercase">Capa Oficial da Obra</span>
            <img
              src={liveCoverUrl}
              alt="Capa Oficial"
              className="w-56 rounded-xl shadow-xl border border-border"
            />
          </div>
        </div>
      )}

      {/* STEP 3: OUTLINE APPROVAL & CHAPTER EDITING */}
      {step === 3 && outline && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Índice Hierárquico ({outline.parts?.length || 1} Partes • {outline.chapters?.length} Capítulos)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Podes personalizar os títulos antes de abrir o Estúdio Editorial com a tua Capa Oficial.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300">
                Capa + Índice Prontos
              </span>
            </div>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
              {outline.chapters?.map((ch: any, idx: number) => (
                <div
                  key={ch.position}
                  className="p-4 rounded-xl border border-border bg-background/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-600 uppercase">
                      Parte {ch.partPosition || 1} • Capítulo {ch.position}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Meta: ~{ch.targetWordCount} palavras
                    </span>
                  </div>
                  <input
                    type="text"
                    value={ch.title}
                    onChange={(e) => handleChapterTitleChange(idx, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm font-semibold text-foreground"
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">{ch.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-input text-sm font-medium hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Plano
            </button>
            <button
              type="button"
              onClick={handleCreateBook}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base hover:opacity-90 shadow-lg disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Inicializando Ebook Studio...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Aprovar Índice e Abrir Estúdio com Capa
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
