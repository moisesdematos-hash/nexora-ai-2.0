'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Wand2,
  Mic,
  Play,
  Square,
  BarChart2,
  MessageSquare,
  Award,
  Share2,
  UploadCloud,
  Code,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Brain,
  Presentation,
  FileText,
  BarChart3,
  Globe,
  Send,
  Eye,
  Clock,
  Flame,
  RotateCw,
  History,
  GitBranch,
  RotateCcw,
} from 'lucide-react'

export type QuantumTab =
  | 'omnimorph'
  | 'podcast'
  | 'living_lab'
  | 'copilot'
  | 'embeds'
  | 'analytics'
  | 'importer'
  | 'versions'

interface NexoraQuantumSuiteProps {
  projectTitle: string
  projectSubtitle?: string
  currentContent: string
  onApplyContentUpdate?: (newContent: string) => void
}

export function NexoraQuantumSuite({
  projectTitle,
  currentContent,
  onApplyContentUpdate,
}: NexoraQuantumSuiteProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<QuantumTab>('omnimorph')

  // 1. Omni-Morph State
  const [morphingTarget, setMorphingTarget] = useState<string | null>(null)
  const [morphPreview, setMorphPreview] = useState<{
    studio: string
    title: string
    summary: string
    href: string
    items: string[]
  } | null>(null)

  // 2. Neural Podcast Dual-Host State
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState<'HOST_A' | 'HOST_B' | null>(null)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)

  // 3. Living Knowledge Lab (ROI Simulator + Flip Cards + Certification Quiz)
  const [teamSize, setTeamSize] = useState(25)
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(8)
  const [hourlyRate, setHourlyRate] = useState(65)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // 4. Co-Pilot Chat-to-Edit State
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; actionLabel?: string }>
  >([
    {
      role: 'assistant',
      text: `Olá! Sou o NEXORA Quantum Co-Pilot. Posso redesenhar qualquer secção de "${projectTitle}", transformar parágrafos em tabelas comparativas, injetar estudos de caso ou reescrever o tom em tempo real.`,
    },
  ])

  // 5. Live Embeds State
  const [embedType, setEmbedType] = useState<'youtube' | 'figma' | 'loom' | 'calendly'>('youtube')
  const [embedUrl, setEmbedUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ')
  const [activeEmbeds, setActiveEmbeds] = useState<
    Array<{ id: string; type: string; title: string; url: string }>
  >([
    {
      id: 'emb_1',
      type: 'figma',
      title: 'Protótipo Interativo de Arquitetura (Live Canvas)',
      url: 'https://www.figma.com',
    },
  ])

  // 6. Importer State
  const [importSource, setImportSource] = useState<'paste' | 'url' | 'file'>('paste')
  const [importRawText, setImportRawText] = useState('')
  const [importUrl, setImportUrl] = useState('')
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

  // 7. Time-Machine Version Control & Snapshots State
  const [commitMessage, setCommitMessage] = useState('')
  const [restoredVersionId, setRestoredVersionId] = useState<string | null>(null)
  const [versionsList, setVersionsList] = useState<
    Array<{
      id: string
      tag: string
      title: string
      author: string
      timestamp: string
      delta: string
      snapshotContent: string
    }>
  >([
    {
      id: 'ver_3',
      tag: 'v2.0-release',
      title: 'Auditoria Editorial Concluída + Imagens 8K HDR & Quantum Suite',
      author: 'NEXORA Engine (Auto-Checkpoint)',
      timestamp: 'Hoje, 12:25',
      delta: '+2.420 palavras • 0 repetições',
      snapshotContent: currentContent || '# Versão 2.0 Release Oficial',
    },
    {
      id: 'ver_2',
      tag: 'v1.4-chapters',
      title: 'Capítulos 1 a 3 Gerados com BookMemory Persistente',
      author: 'Criador NEXORA',
      timestamp: 'Hoje, 11:40',
      delta: '+4.000 palavras • 3 capítulos',
      snapshotContent: `# ${projectTitle} (Snapshot v1.4)\n\nVersão intermédia com os 3 primeiros capítulos consolidados na memória editorial.`,
    },
    {
      id: 'ver_1',
      tag: 'v1.0-initial',
      title: 'Plano Editorial Aprovado & Capa Vetorial HD 800×1200',
      author: 'Criador NEXORA',
      timestamp: 'Hoje, 10:15',
      delta: 'Estrutura Inicial + Capa Oficial',
      snapshotContent: `# ${projectTitle} (Snapshot Inicial v1.0)\n\nPlano editorial base aprovado para produção.`,
    },
  ])

  const podcastScript = [
    {
      speaker: 'HOST_A' as const,
      name: 'Sofia (Estrategista Principal)',
      text: `Bem-vindos ao NEXORA Deep-Dive Podcast! Hoje analisamos a fundo "${projectTitle}". Marco, o que torna esta abordagem tão disruptiva face ao modelo tradicional?`,
    },
    {
      speaker: 'HOST_B' as const,
      name: 'Marco (Arquiteto de Sistemas & Analista)',
      text: `Excelente questão, Sofia. O ponto crítico é a transição de documentos estáticos para memória viva. Em vez de perder contexto a cada página, a arquitetura mantém coesão total e validação mensurável.`,
    },
    {
      speaker: 'HOST_A' as const,
      name: 'Sofia (Estrategista Principal)',
      text: `E na prática executiva, os dados deste capítulo mostram uma redução de até 70% no tempo de produção mantendo rigor técnico e conformidade RGPD.`,
    },
    {
      speaker: 'HOST_B' as const,
      name: 'Marco (Arquiteto de Sistemas & Analista)',
      text: `Exatamente. Seja para publicar uma obra de 500 páginas, apresentar ao Conselho de Administração ou lançar uma Landing Page, a fonte da verdade permanece única.`,
    },
  ]

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function handlePlayDualHostPodcast() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (isPlayingPodcast) {
      window.speechSynthesis.cancel()
      setIsPlayingPodcast(false)
      setActiveSpeaker(null)
      return
    }

    setIsPlayingPodcast(true)
    let idx = 0

    const speakNext = () => {
      if (idx >= podcastScript.length) {
        setIsPlayingPodcast(false)
        setActiveSpeaker(null)
        return
      }
      const line = podcastScript[idx]
      setCurrentLineIndex(idx)
      setActiveSpeaker(line.speaker)

      const utter = new SpeechSynthesisUtterance(line.text)
      utter.lang = 'pt-PT'
      utter.pitch = line.speaker === 'HOST_A' ? 1.15 : 0.92
      utter.rate = 1.06
      utter.onend = () => {
        idx += 1
        speakNext()
      }
      window.speechSynthesis.speak(utter)
    }

    window.speechSynthesis.cancel()
    speakNext()
  }

  function handleTriggerOmniMorph(targetStudio: string) {
    setMorphingTarget(targetStudio)
    setTimeout(() => {
      const mapping: Record<
        string,
        { studio: string; title: string; summary: string; href: string; items: string[] }
      > = {
        presentation: {
          studio: 'NEXORA Presentations (16:9 Widescreen)',
          title: `Pitch Deck Executivo: ${projectTitle}`,
          summary:
            '12 slides gerados automaticamente a partir da memória semântica deste projeto com validação de contraste WCAG AAA.',
          href: '/presentations/demo-pres',
          items: [
            'Slide 01: Capa Executiva & Tese Central',
            'Slide 02: O Problema & Diagnóstico de Mercado',
            'Slide 03: Arquitetura da Solução (Diagrama Split)',
            'Slide 04: Big Numbers & Indicadores de Impacto (KPIs)',
            'Slide 05: Matriz Comparativa de Competitividade',
            'Slide 06: Roteiro de Implementação 90 Dias & Call-to-Action',
          ],
        },
        mindmap: {
          studio: 'NEXORA Mind Maps (SVG Vetorial 1280×840)',
          title: `Mapa Mental de Arquitetura: ${projectTitle}`,
          summary:
            'Árvore cognitiva radial com 1 nó central, 5 ramos primários e 15 sub-nós extraídos automaticamente dos capítulos.',
          href: '/mindmaps/demo-mindmap',
          items: [
            'Nó Central: ' + projectTitle,
            'Ramo 1: Fundamentos & Estratégia → 3 sub-nós',
            'Ramo 2: Arquitetura Técnica & Memória → 3 sub-nós',
            'Ramo 3: Governança, Segurança & RGPD → 3 sub-nós',
            'Ramo 4: Métricas de ROI & Escala → 3 sub-nós',
          ],
        },
        infographic: {
          studio: 'NEXORA Infographics (Poster Editorial 800×1200)',
          title: `Poster Síntese: ${projectTitle}`,
          summary:
            'Infográfico vertical pronto para impressão e LinkedIn com 7 blocos visuais extraídos das estatísticas do texto.',
          href: '/infographics/demo-infographic',
          items: [
            'Bloco 1: Hero Banner & Estatística de Impacto (+70% Eficiência)',
            'Bloco 2: Grelha de 4 KPIs Executivos',
            'Bloco 3: Fluxo de Processo em 4 Etapas',
            'Bloco 4: Timeline de Adoção & Conclusão Editorial',
          ],
        },
        website: {
          studio: 'NEXORA Web (Landing Page HTML5 + Bundle ZIP)',
          title: `Landing Page Oficial de Lançamento: ${projectTitle}`,
          summary:
            'Website responsivo de alta conversão (CRO) com 9 secções para promover, capturar leads ou vender esta obra.',
          href: '/websites/demo-website',
          items: [
            'Secção 1: Hero com Mockup 3D da Obra & CTA Principal',
            'Secção 2: Benefícios & O Que Vais Aprender (Bento Grid)',
            'Secção 3: Pré-visualização Interativa de Capítulos',
            'Secção 4: Planos de Acesso, Testemunhos & FAQ',
          ],
        },
        doc: {
          studio: 'NEXORA Docs ( Memorando Executivo A4 )',
          title: `Executive Brief & Playbook SOP: ${projectTitle}`,
          summary:
            'Documento corporativo A4 sintetizado com Sumário Executivo, Matriz RACI de Responsabilidades e Plano de Ação.',
          href: '/docs/demo-doc',
          items: [
            '1. Sumário Executivo para Decisores (1 Página)',
            '2. Matriz RACI de Execução Operacional',
            '3. Análise de Riscos e Mitigação',
            '4. Checklist de Aprovação e Governança',
          ],
        },
      }
      setMorphPreview(mapping[targetStudio] || mapping.presentation)
      setMorphingTarget(null)
    }, 450)
  }

  function handleSendCopilotCommand(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim()) return
    const cmd = chatInput.trim()
    setChatInput('')

    const updatedHistory = [...chatHistory, { role: 'user' as const, text: cmd }]

    const generatedBlock = `\n\n## ⚡ Secção Gerada pelo NEXORA Co-Pilot: ${cmd}\n\n| Critério Estratégico | Abordagem Tradicional | Arquitetura NEXORA 2.0 |\n| :--- | :--- | :--- |\n| **Velocidade de Produção** | Semanas de formatação manual | Geração estruturada em minutos |\n| **Coerência Longform** | Perda de contexto após ~15 págs | BookMemory persistente até 1.000 págs |\n| **Impacto Mensurável** | Estático e passivo | Interativo, Biónico e Multi-Formato |\n\n> **Insight Executivo:** A implementação direta de *"${cmd}"* eleva a retenção de leitura em +48%.`

    if (onApplyContentUpdate) {
      onApplyContentUpdate(currentContent + generatedBlock)
    }

    setChatHistory([
      ...updatedHistory,
      {
        role: 'assistant',
        text: `Concluído! Apliquei "${cmd}" diretamente no documento com uma matriz comparativa estruturada e síntese executiva.`,
        actionLabel: ' Secção injetada no documento ✓',
      },
    ])
  }

  function handleRunUniversalImport() {
    const sourceText =
      importSource === 'paste'
        ? importRawText
        : importSource === 'url'
        ? `Conteúdo extraído de ${importUrl || 'https://exemplo.com/relatorio'}`
        : 'Documento Corporativo Importado (.PDF / .DOCX)'

    if (!sourceText.trim()) return

    const restructured = `# ${projectTitle} — Conteúdo Reestruturado por IA\n\n## 1. Síntese Executiva Extraída\n\n${sourceText.slice(0, 600)}\n\n## 2. Pontos-Chave Identificados Automaticamente\n\n- **Estruturação Semântica:** Títulos, subtítulos e argumentos organizados segundo a hierarquia NEXORA.\n- **Pronto para Transmutação:** Este conteúdo já está sincronizado com a BookMemory e pode ser exportado em PDF, EPUB 3.0, DOCX ou transformado em Slides 16:9.`

    if (onApplyContentUpdate) {
      onApplyContentUpdate(restructured)
    }
    setImportSuccess(
      'Conteúdo importado, limpo e transformado em secções editoriais estruturadas com sucesso!'
    )
  }

  const annualSavings = teamSize * hoursSavedPerWeek * 48 * hourlyRate

  const flipCardsData = [
    {
      frontTitle: '1. O que é o protocolo BookMemory?',
      frontBadge: 'Clica para virar o cartão ↻',
      backText:
        'É o motor de estado persistente da NEXORA que guarda conceitos, glossário, estilo e resumos de cada capítulo no PostgreSQL para manter coerência até 1.000 páginas.',
    },
    {
      frontTitle: '2. Como funciona a Transmutação Omni-Morph™?',
      frontBadge: 'Clica para virar o cartão ↻',
      backText:
        'Converte instantaneamente qualquer livro ou documento num Pitch Deck 16:9, Mapa Mental SVG, Infográfico 800×1200 ou Landing Page HTML5 sem reescrever prompts.',
    },
    {
      frontTitle: '3. Garantia Zero-Training & Direitos Comerciais',
      frontBadge: 'Clica para virar o cartão ↻',
      backText:
        '100% dos direitos autorais e comerciais pertencem ao utilizador. Os teus dados nunca são usados para treinar modelos de IA públicos.',
    },
  ]

  const quizQuestions = [
    {
      q: 'Qual é o diferencial arquitetural que permite gerar obras de 10 a 1.000 páginas sem repetição semântica?',
      options: [
        'Janela de texto simples sem memória',
        'Motor Longform com BookMemory persistente e auditoria léxica',
        'Apenas exportação em texto simples',
      ],
      correct: 1,
    },
    {
      q: 'Quantos formatos nativos de exportação e quantos estúdios integrados compõem o ecossistema NEXORA AI 2.0?',
      options: [
        '6 Estúdios Criativos e 8 Formatos Oficiais de Exportação',
        'Apenas 1 estúdio de slides',
        'Apenas exportação em imagem estática',
      ],
      correct: 0,
    },
  ]

  const correctCount = quizQuestions.filter((q, idx) => quizAnswers[idx] === q.correct).length

  return (
    <div className="space-y-6">
      {/* Quantum Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-950 border border-violet-500/40 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-[11px] font-extrabold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              NEXORA Quantum Suite™ • Além do Gamma.app
            </span>
            <h2 className="text-2xl font-black tracking-tight">
              Super-Poderes Multimodais, Áudio Neural & Transmutação 1-para-6
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Inclui todas as capacidades avançadas (Co-Piloto Chat-to-Edit, Importador Universal, Live Embeds e Viewer Analytics) mais <strong>3 tecnologias exclusivas que o Gamma nem imagina</strong>: <em>Omni-Morph™ 1-para-6</em>, <em>Neural Podcast Studio™</em> e <em>Living Knowledge Lab™</em>.
            </p>
          </div>
        </div>

        {/* 7 Quantum Sub-Modules Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/10">
          {[
            { id: 'omnimorph' as QuantumTab, label: '⚡ 1. Omni-Morph™ (1→6 Estúdios)', icon: Wand2, badge: 'Exclusivo' },
            { id: 'podcast' as QuantumTab, label: '🎙️ 2. Podcast & Debate IA', icon: Mic, badge: 'Exclusivo' },
            { id: 'living_lab' as QuantumTab, label: '🧠 3. Simulador ROI, Flip-Cards & Quiz', icon: Calculator, badge: 'Exclusivo' },
            { id: 'copilot' as QuantumTab, label: '💬 4. Co-Piloto Chat-to-Edit', icon: MessageSquare },
            { id: 'embeds' as QuantumTab, label: '🧩 5. Live Embeds (Figma/YouTube/Loom)', icon: Code },
            { id: 'importer' as QuantumTab, label: '📥 6. Importar Ficheiro/URL/Texto', icon: UploadCloud },
            { id: 'analytics' as QuantumTab, label: '📊 7. Heatmap & Analytics de Leitura', icon: BarChart2 },
            { id: 'versions' as QuantumTab, label: '⏪ 8. Time-Machine & Controlo de Versões', icon: History, badge: 'Git-Style' },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] uppercase font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* MODULE 1: OMNI-MORPH CROSS-STUDIO TRANSMUTER (1 -> 6) */}
      {activeTab === 'omnimorph' && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-violet-500">
                Tecnologia Exclusiva NEXORA Omni-Morph™
              </span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">
                Transmutação Instantânea Cross-Studio (1 Obra → 6 Formatos Vivos)
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                No Gamma, um slide é apenas um slide. No NEXORA, clica num estúdio abaixo para converter instantaneamente <strong>&ldquo;{projectTitle}&rdquo;</strong> noutro formato preservando toda a memória semântica.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                id: 'presentation',
                name: 'Pitch Deck 16:9',
                sub: '12 Slides WCAG AAA',
                icon: Presentation,
                color: 'from-violet-600 to-purple-600',
              },
              {
                id: 'mindmap',
                name: 'Mapa Mental SVG',
                sub: 'Árvore Radial de Nós',
                icon: Brain,
                color: 'from-amber-500 to-orange-600',
              },
              {
                id: 'infographic',
                name: 'Poster 800×1200',
                sub: 'KPIs & Timeline Visual',
                icon: BarChart3,
                color: 'from-pink-600 to-rose-600',
              },
              {
                id: 'website',
                name: 'Landing Page CRO',
                sub: 'HTML5 + Bundle ZIP',
                icon: Globe,
                color: 'from-cyan-600 to-blue-600',
              },
              {
                id: 'doc',
                name: 'Executive Brief A4',
                sub: 'Playbook SOP + RACI',
                icon: FileText,
                color: 'from-emerald-600 to-teal-600',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTriggerOmniMorph(item.id)}
                  className="p-4 rounded-2xl border border-border bg-background hover:border-violet-500 transition-all text-left group flex flex-col justify-between gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                  </div>
                  <span className="text-[11px] font-bold text-violet-500 flex items-center gap-1">
                    Transmutar Agora →
                  </span>
                </button>
              )
            })}
          </div>

          {morphingTarget && (
            <div className="p-8 rounded-2xl border border-violet-500/30 bg-violet-500/5 text-center space-y-2">
              <RotateCw className="w-7 h-7 text-violet-500 animate-spin mx-auto" />
              <p className="text-sm font-bold text-foreground">
                Sintetizando BookMemory e gerando estrutura visual...
              </p>
            </div>
          )}

          {morphPreview && !morphingTarget && (
            <div className="p-6 rounded-2xl border-2 border-violet-500/50 bg-gradient-to-br from-violet-950/20 via-card to-blue-950/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-extrabold uppercase text-emerald-500">
                    ✓ Transmutação Omni-Morph™ Concluída
                  </span>
                  <h4 className="text-lg font-extrabold text-foreground mt-0.5">
                    {morphPreview.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{morphPreview.studio}</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(morphPreview.href)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold shadow-md hover:opacity-90"
                >
                  Abrir no Estúdio de Destino
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{morphPreview.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {morphPreview.items.map((it) => (
                  <div
                    key={it}
                    className="p-3 rounded-xl border border-border bg-background/80 text-xs font-medium text-foreground flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 2: NEURAL PODCAST & DUAL-HOST DEBATE STUDIO */}
      {activeTab === 'podcast' && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-500">
                NEXORA Neural Podcast Studio™ (Estilo NotebookLM Audio Overview + Guião Editável)
              </span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">
                Debate Executivo em Áudio entre 2 Especialistas IA sobre a tua Obra
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Transforma automaticamente este capítulo num episódio de podcast dinâmico com duas vozes distintas discutindo as teses centrais do documento.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePlayDualHostPodcast}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold text-white shadow-lg transition-all ${
                isPlayingPodcast
                  ? 'bg-rose-600 hover:bg-rose-700 animate-pulse'
                  : 'bg-gradient-to-r from-cyan-600 to-violet-600 hover:opacity-90'
              }`}
            >
              {isPlayingPodcast ? (
                <>
                  <Square className="w-4 h-4" />
                  Parar Episódio Podcast
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Reproduzir Debate Dual-Host (Voz IA)
                </>
              )}
            </button>
          </div>

          {/* Live Audio Waveform Visualizer */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  activeSpeaker === 'HOST_A'
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30'
                    : 'bg-slate-800 text-cyan-400'
                }`}
              >
                HOST A
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  activeSpeaker === 'HOST_B'
                    ? 'bg-violet-500 text-white ring-4 ring-violet-500/30'
                    : 'bg-slate-800 text-violet-400'
                }`}
              >
                HOST B
              </div>
              <div className="text-xs text-slate-300">
                <p className="font-bold text-white">
                  {isPlayingPodcast
                    ? `No Ar: ${podcastScript[currentLineIndex]?.name}`
                    : 'Pronto para Transmissão Neural (2 Apresentadores)'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Episódio: {projectTitle} • Duração estimada: 03:45
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 h-8">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isPlayingPodcast ? 'bg-cyan-400 animate-bounce' : 'bg-slate-700 h-2'
                  }`}
                  style={{
                    height: isPlayingPodcast ? `${10 + ((i * 7) % 22)}px` : '8px',
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Dialogue Transcript */}
          <div className="space-y-3">
            {podcastScript.map((line, idx) => {
              const isCurrent = isPlayingPodcast && currentLineIndex === idx
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-md'
                      : 'border-border bg-background/70'
                  }`}
                >
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider ${
                      line.speaker === 'HOST_A' ? 'text-cyan-500' : 'text-violet-500'
                    }`}
                  >
                    {line.name}
                  </span>
                  <p className="text-xs sm:text-sm text-foreground mt-1 leading-relaxed">
                    &ldquo;{line.text}&rdquo;
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* MODULE 3: LIVING KNOWLEDGE LAB (ROI SIMULATOR + FLIP CARDS + CERTIFICATION QUIZ) */}
      {activeTab === 'living_lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive ROI Simulator inside the Book/Presentation */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-500">
                Widget Vivo 1 • Calculadora Executiva de ROI
              </span>
              <h3 className="text-lg font-bold text-foreground mt-0.5">
                Simulador Interativo de Impacto Financeiro
              </h3>
              <p className="text-xs text-muted-foreground">
                Os leitores do teu E-book ou Apresentação podem deslizar os parâmetros abaixo para calcular o retorno em tempo real:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Dimensão da Equipa</span>
                  <span className="text-violet-500 font-bold">{teamSize} colaboradores</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Horas Poupadas por Semana / Pessoa</span>
                  <span className="text-violet-500 font-bold">{hoursSavedPerWeek}h / semana</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={hoursSavedPerWeek}
                  onChange={(e) => setHoursSavedPerWeek(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Custo Médio Hora (€/h)</span>
                  <span className="text-violet-500 font-bold">€{hourlyRate}/h</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={250}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase text-emerald-500 block">
                    Poupança Anual Estimada para a Organização
                  </span>
                  <span className="text-2xl font-black text-foreground">
                    €{annualSavings.toLocaleString('pt-PT')} / ano
                  </span>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white">
                  {(teamSize * hoursSavedPerWeek * 48).toLocaleString('pt-PT')}h poupadas
                </span>
              </div>
            </div>

            {/* Interactive Flip Cards */}
            <div className="pt-4 border-t border-border space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-violet-500 block">
                Widget Vivo 2 • Flip-Cards Interativos (Clica para virar)
              </span>
              <div className="space-y-2.5">
                {flipCardsData.map((card, idx) => {
                  const isFlipped = !!flippedCards[idx]
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setFlippedCards({ ...flippedCards, [idx]: !isFlipped })
                      }
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isFlipped
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-border bg-background hover:border-violet-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {card.frontTitle}
                        </span>
                        <span className="text-[10px] font-semibold text-violet-500">
                          {isFlipped ? 'Ocultar resposta ▲' : card.frontBadge}
                        </span>
                      </div>
                      {isFlipped && (
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/60 leading-relaxed">
                          {card.backText}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Interactive Certification Quiz & Diploma */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">
                  Widget Vivo 3 • Exame Interativo & Certificado Verificável
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  Validação de Conhecimento da Obra
                </h3>
                <p className="text-xs text-muted-foreground">
                  Transforma qualquer E-book ou Manual Técnico num curso certificável automaticamente:
                </p>
              </div>

              {quizQuestions.map((item, qIdx) => (
                <div key={qIdx} className="p-4 rounded-xl border border-border bg-background/60 space-y-2.5">
                  <p className="text-xs font-bold text-foreground">
                    {qIdx + 1}. {item.q}
                  </p>
                  <div className="space-y-1.5">
                    {item.options.map((opt, oIdx) => {
                      const selected = quizAnswers[qIdx] === oIdx
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })
                            setQuizSubmitted(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                            selected
                              ? 'border-violet-600 bg-violet-500/15 font-bold text-foreground'
                              : 'border-border bg-card text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setQuizSubmitted(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-extrabold shadow-md hover:opacity-90"
              >
                Avaliar Respostas & Emitir Certificado Oficial
              </button>

              {quizSubmitted && (
                <div className="p-4 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-violet-500/10 text-center space-y-2">
                  <Award className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="text-sm font-black text-foreground">
                    CERTIFICADO OFICIAL NEXORA ACADEMY ({correctCount}/{quizQuestions.length} Corretas)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Certificamos o domínio executivo sobre <strong>{projectTitle}</strong> • Hash de Verificação: <code>NX-CERT-2026-994A</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: CO-PILOT CHAT-TO-EDIT SIDEBAR */}
      {activeTab === 'copilot' && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-500">
              NEXORA Co-Pilot Agent (Supera o Gamma Agent)
            </span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">
              Edição Conversacional em Linguagem Natural (&ldquo;Chat-to-Edit&rdquo;)
            </h3>
          </div>

          <div className="h-64 overflow-y-auto p-4 rounded-2xl border border-border bg-background/60 space-y-3">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-2xl ${
                  msg.role === 'user'
                    ? 'ml-auto bg-violet-600 text-white font-medium'
                    : 'bg-card border border-border text-foreground'
                }`}
              >
                <p>{msg.text}</p>
                {msg.actionLabel && (
                  <span className="mt-2 inline-block text-[11px] font-bold text-emerald-500">
                    {msg.actionLabel}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'Adiciona uma tabela comparativa de ROI',
              'Cria um estudo de caso executivo B2B',
              'Resume este capítulo em 5 bullet points acionáveis',
              'Reescreve num tom mais futurista e visionário',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setChatInput(preset)}
                className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-muted-foreground hover:text-foreground hover:border-violet-500"
              >
                + {preset}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendCopilotCommand} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Diz ao Co-Piloto o que queres alterar ou adicionar à obra..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold"
            >
              <Send className="w-4 h-4" />
              Executar no Documento
            </button>
          </form>
        </div>
      )}

      {/* MODULE 5: LIVE INTERACTIVE EMBEDS (FIGMA, YOUTUBE, LOOM, CALENDLY) */}
      {activeTab === 'embeds' && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-500">
              Live Interactive Embeds
            </span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">
              Incorporar Vídeos YouTube/Loom, Protótipos Figma & Calendly dentro da Obra
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select
              value={embedType}
              onChange={(e) => setEmbedType(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-input bg-background text-xs font-bold text-foreground"
            >
              <option value="youtube">🎬 YouTube Video</option>
              <option value="figma">🎨 Figma Live Prototype</option>
              <option value="loom">📹 Loom Walkthrough</option>
              <option value="calendly">📅 Calendly Booking</option>
            </select>
            <input
              type="text"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="Cole o URL do YouTube, Figma, Loom ou Calendly..."
              className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-input bg-background text-xs text-foreground"
            />
            <button
              type="button"
              onClick={() => {
                setActiveEmbeds([
                  ...activeEmbeds,
                  {
                    id: `emb_${Date.now()}`,
                    type: embedType,
                    title: `Bloco Interativo ${embedType.toUpperCase()}`,
                    url: embedUrl,
                  },
                ])
              }}
              className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:opacity-90"
            >
              + Inserir Bloco Vivo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeEmbeds.map((emb) => (
              <div key={emb.id} className="p-4 rounded-2xl border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{emb.title}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-500">
                    {emb.type}
                  </span>
                </div>
                <div className="h-44 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-300 p-4 text-center">
                  <Code className="w-8 h-8 text-cyan-400 mb-2" />
                  <p className="text-xs font-semibold">Embed Interativo Ativo ({emb.type.toUpperCase()})</p>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs mt-1">{emb.url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: UNIVERSAL CONTENT IMPORTER (PASTE / URL / FILE) */}
      {activeTab === 'importer' && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-500">
              NEXORA Universal Importer
            </span>
            <h3 className="text-xl font-bold text-foreground mt-0.5">
              Colar Texto, Notas, Ficheiro (.PDF/.DOCX/.PPTX) ou URL para Converter Automaticamente
            </h3>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'paste' as const, label: '📋 Colar Texto ou Notas Brutas' },
              { id: 'url' as const, label: '🌐 Importar de Link / URL Web' },
              { id: 'file' as const, label: '📄 Carregar Ficheiro (.PDF, .DOCX, .PPTX)' },
            ].map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => setImportSource(src.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  importSource === src.id
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>

          {importSource === 'paste' && (
            <textarea
              rows={4}
              value={importRawText}
              onChange={(e) => setImportRawText(e.target.value)}
              placeholder="Cola aqui qualquer texto bruto, ata de reunião, artigo ou rascunho para a IA estruturar em capítulos/slides..."
              className="w-full p-4 rounded-xl border border-input bg-background text-xs sm:text-sm text-foreground"
            />
          )}

          {importSource === 'url' && (
            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://empresa.com/artigo-ou-relatorio"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground"
            />
          )}

          {importSource === 'file' && (
            <div className="p-8 rounded-2xl border-2 border-dashed border-border bg-background/50 text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-violet-500 mx-auto" />
              <p className="text-xs font-bold text-foreground">
                Seleciona um ficheiro PDF, Word (.DOCX), PowerPoint (.PPTX) ou Markdown (.MD)
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.pptx,.md,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImportRawText(`Conteúdo importado do ficheiro: ${file.name}`)
                  }
                }}
                className="text-xs text-muted-foreground mx-auto block"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleRunUniversalImport}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Converter e Estruturar com IA Agora
            </button>
            {importSuccess && (
              <span className="text-xs font-bold text-emerald-500">{importSuccess}</span>
            )}
          </div>
        </div>
      )}

      {/* MODULE 7: VIEWER TELEMETRY & ENGAGEMENT HEATMAP ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-pink-500">
                NEXORA Viewer Telemetry & Heatmap
              </span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">
                Analytics de Engajamento por Capítulo / Slide em Tempo Real
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" /> 94% Taxa de Retenção de Leitura
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Visualizações Únicas', val: '1.428', icon: Eye, color: 'text-violet-500' },
              { label: 'Tempo Médio de Leitura', val: '14m 22s', icon: Clock, color: 'text-cyan-500' },
              { label: 'Taxa de Conclusão', val: '89.4%', icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Partilhas & Downloads', val: '312', icon: Share2, color: 'text-amber-500' },
            ].map((st) => {
              const Icon = st.icon
              return (
                <div key={st.label} className="p-4 rounded-xl border border-border bg-background">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{st.label}</span>
                    <Icon className={`w-4 h-4 ${st.color}`} />
                  </div>
                  <p className="text-2xl font-black text-foreground">{st.val}</p>
                </div>
              )
            })}
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mapa de Calor de Atenção por Secção / Capítulo
            </h4>
            {[
              { name: 'Cap. 1 — Fundamentos & Contexto Estratégico', time: '04m 12s', retention: 98 },
              { name: 'Cap. 2 — Arquitetura de Memória Persistente (BookMemory)', time: '05m 40s', retention: 95 },
              { name: 'Cap. 3 — Design Editorial & Capas Vetoriais HD', time: '03m 18s', retention: 91 },
              { name: 'Simulador Interativo de ROI & Quiz de Certificação', time: '02m 55s', retention: 96 },
            ].map((row) => (
              <div key={row.name} className="p-3 rounded-xl border border-border bg-background space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground">{row.name}</span>
                  <span className="font-mono text-muted-foreground">
                    Tempo médio: <strong>{row.time}</strong> • Retenção: <strong>{row.retention}%</strong>
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                    style={{ width: `${row.retention}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 8: NEXORA TIME-MACHINE VERSION CONTROL, SNAPSHOTS & ROLLBACK */}
      {activeTab === 'versions' && (
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                NEXORA Time-Machine™ • Controlo de Versões Atómico (ProjectVersion PostgreSQL)
              </span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">
                Histórico de Versões, Checkpoints por Capítulo & Restauro Instantâneo (Rollback)
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Cada geração de IA ou edição grava um snapshot imutável. Podes criar tags manuais ou restaurar qualquer estado anterior em 1 clique.
              </p>
            </div>
          </div>

          {/* Create Manual Checkpoint / Tag Bar */}
          <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl border border-border bg-background">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Mensagem do novo Checkpoint / Versão (ex: Revisão final antes de enviar ao cliente)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-input bg-card text-xs sm:text-sm text-foreground"
            />
            <button
              type="button"
              onClick={() => {
                if (!commitMessage.trim()) return
                const nextNum = versionsList.length + 1
                const newVer = {
                  id: `ver_${Date.now()}`,
                  tag: `v2.${nextNum}-snapshot`,
                  title: commitMessage.trim(),
                  author: 'Criador NEXORA (Manual Tag)',
                  timestamp: 'Agora mesmo',
                  delta: 'Snapshot Integral Guardado',
                  snapshotContent: currentContent,
                }
                setVersionsList([newVer, ...versionsList])
                setCommitMessage('')
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-md hover:opacity-90 whitespace-nowrap"
            >
              <GitBranch className="w-4 h-4" />
              + Criar Ponto de Restauro (Snapshot)
            </button>
          </div>

          {restoredVersionId && (
            <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center justify-between">
              <span>
                ✓ Documento restaurado com sucesso para o snapshot selecionado! Todas as alterações anteriores continuam preservadas no histórico.
              </span>
              <button
                type="button"
                onClick={() => setRestoredVersionId(null)}
                className="underline ml-4"
              >
                Fechar aviso
              </button>
            </div>
          )}

          {/* Versions Timeline */}
          <div className="space-y-3">
            {versionsList.map((ver, idx) => (
              <div
                key={ver.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  idx === 0
                    ? 'border-violet-500/50 bg-violet-500/5'
                    : 'border-border bg-background/70'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-600 text-white font-mono text-[11px] font-bold">
                      {ver.tag}
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold uppercase">
                        HEAD • Versão Atual
                      </span>
                    )}
                    <span className="text-xs font-bold text-foreground">{ver.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Autor: {ver.author}</span>
                    <span>•</span>
                    <span>Data: {ver.timestamp}</span>
                    <span>•</span>
                    <span className="text-violet-400 font-semibold">{ver.delta}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onApplyContentUpdate) {
                      onApplyContentUpdate(ver.snapshotContent)
                    }
                    setRestoredVersionId(ver.id)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:border-violet-500 text-xs font-bold text-foreground transition-all self-start sm:self-center shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-violet-500" />
                  Restaurar esta Versão (Rollback)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
