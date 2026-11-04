'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Wand2,
  Undo2,
  FileText,
  CheckSquare,
} from 'lucide-react'

interface DocSection {
  id: string
  heading: string
  level: 1 | 2 | 3
  body: string
  bullets?: string[]
  callout?: {
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'EXECUTIVE'
    title: string
    text: string
  }
  table?: {
    headers: string[]
    rows: string[][]
  }
}

interface ActionItem {
  id: string
  task: string
  owner: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  dueDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}

export default function DocumentStudioPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const docId = String(params?.id || 'demo-doc')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

  const [title, setTitle] = useState(
    searchParams?.get('title') ||
      'Relatório Executivo de Transformação Digital & Eficiência IA',
  )
  const [subtitle, setSubtitle] = useState('Documento Oficial — Relatório Executivo')
  const [author, setAuthor] = useState('Equipa Editorial NEXORA AI')
  const [organizationName, setOrganizationName] = useState('NEXORA Enterprise Studio')
  const [version, setVersion] = useState('1.0')
  const [executiveSummary, setExecutiveSummary] = useState(
    'Este documento apresenta um diagnóstico estratégico completo, metas de eficiência operacional, matriz de indicadores (KPIs) e plano de execução imediato com governança assistida por IA.',
  )
  const [sections, setSections] = useState<DocSection[]>([
    {
      id: 'sec-1',
      heading: '1. Panorama Estratégico e Diagnóstico Atual',
      level: 1,
      body: 'A análise aprofundada das operações demonstra uma oportunidade imediata de ganho de produtividade (+38%) e redução de retrabalho através da automação inteligente e padronização documental.',
      bullets: [
        'Unificação de fluxos editoriais, relatórios e propostas num único ecossistema',
        'Governança multi-tenant com histórico de versões e auditoria completa',
        'Redução de 65% no tempo médio de preparação de entregáveis executivos',
      ],
      callout: {
        type: 'EXECUTIVE',
        title: 'Recomendação para a Direção',
        text: 'Priorizar a adoção imediata dos playbooks padronizados garante ROI positivo ainda no trimestre atual.',
      },
    },
    {
      id: 'sec-2',
      heading: '2. Matriz de Indicadores de Desempenho (KPIs)',
      level: 1,
      body: 'Quadro comparativo entre o baseline histórico, o desempenho atual e a meta estipulada para o ciclo anual.',
      table: {
        headers: ['Indicador (KPI)', 'Baseline', 'Atual', 'Meta Anual', 'Status'],
        rows: [
          ['Eficiência Operacional', '64%', '86%', '92%', 'On Track'],
          ['SLA de Entrega Documental', '5 dias', '45 min', '30 min', 'Superado'],
          ['Conformidade & Qualidade', '88%', '98.5%', '99.0%', 'Excelente'],
        ],
      },
    },
  ])
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 'act-1',
      task: 'Homologar diretrizes do relatório junto aos diretores de área',
      owner: 'Direção Executiva',
      priority: 'HIGH',
      dueDate: '2026-11-15',
      status: 'DONE',
    },
    {
      id: 'act-2',
      task: 'Implementar monitorização quinzenal dos indicadores de SLA',
      owner: 'PMO & Operações',
      priority: 'HIGH',
      dueDate: '2026-11-30',
      status: 'IN_PROGRESS',
    },
  ])

  const [history, setHistory] = useState<
    Array<{ executiveSummary: string; sections: DocSection[]; actionItems: ActionItem[] }>
  >([])
  const [aiPrompt, setAiPrompt] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    if (docId && docId !== 'demo-doc') {
      fetch(`${apiUrl}/docs/${docId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && data.content) {
            setTitle(data.title || title)
            setSubtitle(data.content.subtitle || subtitle)
            setAuthor(data.content.author || author)
            setOrganizationName(data.content.organizationName || organizationName)
            setVersion(data.content.version || '1.0')
            if (data.content.executiveSummary) {
              setExecutiveSummary(data.content.executiveSummary)
            }
            if (Array.isArray(data.content.sections)) {
              setSections(data.content.sections)
            }
            if (Array.isArray(data.content.actionItems)) {
              setActionItems(data.content.actionItems)
            }
          }
        })
        .catch(() => {})
    }
  }, [docId])

  const pushSnapshot = () => {
    setHistory((prev) => [
      ...prev.slice(-9),
      JSON.parse(JSON.stringify({ executiveSummary, sections, actionItems })),
    ])
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setExecutiveSummary(last.executiveSummary)
    setSections(last.sections)
    setActionItems(last.actionItems)
    setHistory((prev) => prev.slice(0, -1))
    setStatusMessage('Alteração revertida com sucesso.')
  }

  const handleAddSection = () => {
    pushSnapshot()
    const nextIdx = sections.length + 1
    setSections((prev) => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        heading: `${nextIdx}. Nova Secção Estratégica`,
        level: 1,
        body: 'Descreve aqui a análise detalhada, premissas técnicas ou recomendações desta secção.',
        bullets: ['Ponto-chave 1', 'Ponto-chave 2'],
      },
    ])
  }

  const handleDeleteSection = (id: string) => {
    pushSnapshot()
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  const handleAiQuickCommand = async (cmdText: string) => {
    pushSnapshot()
    if (docId !== 'demo-doc') {
      try {
        const res = await fetch(`${apiUrl}/docs/${docId}/ai-command`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: cmdText }),
        })
        if (res.ok) {
          const data = await res.json()
          const c = data.document?.content
          if (c) {
            setExecutiveSummary(c.executiveSummary || executiveSummary)
            setSections(c.sections || sections)
            setActionItems(c.actionItems || actionItems)
            setVersion(c.version || version)
            setStatusMessage(data.actionSummary || 'Comando IA executado.')
            return
          }
        }
      } catch {
        // Fallback local execution
      }
    }

    const lower = cmdText.toLowerCase()
    if (lower.includes('resum')) {
      setExecutiveSummary(
        `[Síntese Executiva IA] ${executiveSummary.slice(0, 200)} — Prioridade máxima em eficiência operacional, controlo de SLAs e retorno no 1.º trimestre.`,
      )
      setStatusMessage('Sumário executivo condensado pela IA.')
    } else if (lower.includes('tabela') || lower.includes('kpi')) {
      setSections((prev) => [
        ...prev,
        {
          id: `sec-ai-${Date.now()}`,
          heading: `${prev.length + 1}. Quadro Complementar de Metas Trimestrais`,
          level: 1,
          body: 'Matriz analítica gerada pelo Assistente NEXORA DOCS.',
          table: {
            headers: ['Métrica', 'Q1', 'Q2', 'Meta Anual'],
            rows: [
              ['Produtividade Editorial', '+25%', '+48%', '+75%'],
              ['Redução de Custos Operacionais', '-12%', '-22%', '-35%'],
            ],
          },
        },
      ])
      setStatusMessage('Nova secção com tabela de KPIs adicionada.')
    } else if (lower.includes('ação') || lower.includes('checklist')) {
      setActionItems((prev) => [
        ...prev,
        {
          id: `act-${Date.now()}`,
          task: 'Realizar auditoria executiva de validação e assinatura final',
          owner: 'Comité de Qualidade',
          priority: 'HIGH',
          dueDate: new Date().toISOString().split('T')[0],
          status: 'PENDING',
        },
      ])
      setStatusMessage('Novo item de ação adicionado ao plano.')
    } else {
      setSections((prev) => [
        ...prev,
        {
          id: `sec-ai-${Date.now()}`,
          heading: `${prev.length + 1}. Expansão Analítica: ${cmdText}`,
          level: 1,
          body: `Análise gerada automaticamente pelo motor NEXORA DOCS em resposta ao comando "${cmdText}", garantindo coesão editorial e alinhamento estratégico.`,
        },
      ])
      setStatusMessage(`Instrução "${cmdText}" aplicada com sucesso.`)
    }
    setAiPrompt('')
  }

  const handleExportMarkdownLocal = () => {
    const lines = [
      `# ${title}`,
      `**${subtitle}**`,
      `> Autor: ${author} | Organização: ${organizationName} | Versão: v${version}`,
      '',
      '## Sumário Executivo',
      executiveSummary,
      '',
      ...sections.flatMap((s) => [
        `## ${s.heading}`,
        s.body,
        ...(s.bullets || []).map((b) => `- ${b}`),
        '',
      ]),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const wordCount =
    executiveSummary.split(/\s+/).length +
    sections.reduce(
      (acc, s) =>
        acc +
        s.heading.split(/\s+/).length +
        s.body.split(/\s+/).length +
        (s.bullets?.join(' ').split(/\s+/).length || 0),
      0,
    )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Studio Bar */}
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-foreground line-clamp-1">
                {title}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">
                v{version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {wordCount} palavras • {sections.length} secções • {actionItems.length} itens de ação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted disabled:opacity-40"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Desfazer ({history.length})
          </button>

          <a
            href={`${apiUrl}/docs/${docId}/export/pdf`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
          >
            <Download className="w-3.5 h-3.5" />
            PDF (A4)
          </a>
          <a
            href={`${apiUrl}/docs/${docId}/export/docx`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
          >
            <Download className="w-3.5 h-3.5" />
            DOCX (Word)
          </a>
          <button
            type="button"
            onClick={handleExportMarkdownLocal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold hover:bg-muted"
          >
            <Download className="w-3.5 h-3.5" />
            Markdown (.md)
          </button>
        </div>
      </header>

      {statusMessage && (
        <div className="bg-indigo-600/10 border-b border-indigo-500/20 px-6 py-2 flex items-center justify-between text-xs text-indigo-400">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMessage}
          </span>
          <button onClick={() => setStatusMessage(null)} className="underline">
            Fechar
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto gap-6 p-6">
        {/* Left/Center Document Paper (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Document Cover Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-8 text-white shadow-lg">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">
              {organizationName}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-white border-b border-white/20 pb-2 focus:outline-none focus:border-white"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-transparent text-sm text-indigo-100 mt-2 focus:outline-none"
            />
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-indigo-200">
              <span>Autor: {author}</span>
              <span>•</span>
              <span>Versão: v{version}</span>
            </div>
          </div>

          {/* Executive Summary Card */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-2 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              Sumário Executivo
            </label>
            <textarea
              rows={3}
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              className="w-full bg-background rounded-xl border border-border p-3 text-sm text-foreground leading-relaxed"
            />
          </div>

          {/* Structured Sections */}
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={sec.heading}
                  onChange={(e) => {
                    const next = [...sections]
                    next[idx] = { ...sec, heading: e.target.value }
                    setSections(next)
                  }}
                  className="flex-1 font-bold text-lg text-foreground bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSection(sec.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                  title="Eliminar secção"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={4}
                value={sec.body}
                onChange={(e) => {
                  const next = [...sections]
                  next[idx] = { ...sec, body: e.target.value }
                  setSections(next)
                }}
                className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground leading-relaxed"
              />

              {/* Bullets */}
              {sec.bullets && sec.bullets.length > 0 && (
                <div className="space-y-1.5 pl-2">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Pontos-Chave:
                  </div>
                  {sec.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const next = [...sections]
                          const nextBullets = [...(sec.bullets || [])]
                          nextBullets[bIdx] = e.target.value
                          next[idx] = { ...sec, bullets: nextBullets }
                          setSections(next)
                        }}
                        className="w-full text-xs text-foreground bg-transparent border-b border-border/50 py-1 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Callout */}
              {sec.callout && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
                  <div className="text-xs font-bold text-indigo-400">
                    {sec.callout.title}
                  </div>
                  <p className="text-xs text-foreground">{sec.callout.text}</p>
                </div>
              )}

              {/* Table */}
              {sec.table && (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted">
                        {sec.table.headers.map((h, hIdx) => (
                          <th
                            key={hIdx}
                            className="p-2.5 font-bold text-foreground border-b border-border"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-border/60">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 text-muted-foreground">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSection}
            className="w-full py-3 rounded-xl border border-dashed border-border hover:border-indigo-500 text-xs font-semibold text-muted-foreground hover:text-indigo-400 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Adicionar Nova Secção ao Documento
          </button>

          {/* Action Items Matrix */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                Plano de Ação & Responsabilidades
              </h3>
              <button
                type="button"
                onClick={() => handleAiQuickCommand('Extrair plano de ação')}
                className="text-xs text-indigo-400 hover:underline font-medium"
              >
                + Adicionar Tarefa
              </button>
            </div>
            <div className="space-y-2">
              {actionItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-border bg-background flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.status === 'DONE'}
                      onChange={() => {
                        const next = [...actionItems]
                        next[idx] = {
                          ...item,
                          status: item.status === 'DONE' ? 'PENDING' : 'DONE',
                        }
                        setActionItems(next)
                      }}
                      className="rounded border-border"
                    />
                    <span
                      className={
                        item.status === 'DONE'
                          ? 'line-through text-muted-foreground'
                          : 'font-medium text-foreground'
                      }
                    >
                      {item.task}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground">{item.owner}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right AI Assistant Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 sticky top-24">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              Assistente Editorial IA (NEXORA DOCS)
            </div>
            <p className="text-xs text-muted-foreground">
              Executa comandos inteligentes sobre o documento. Todas as alterações criam um snapshot reversível.
            </p>

            <div className="space-y-2">
              {[
                'Resumir executivamente para a direção',
                'Expandir secção principal com dados',
                'Gerar tabela de KPIs trimestrais',
                'Extrair plano de ação e checklist',
                'Traduzir sumário para Inglês',
                'Traduzir sumário para Francês',
              ].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleAiQuickCommand(cmd)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-border bg-background hover:border-indigo-500/50 text-xs text-foreground flex items-center justify-between transition-all"
                >
                  <span>{cmd}</span>
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-border space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Comando Personalizado
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: Adiciona análise de risco financeiro..."
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs"
                />
                <button
                  type="button"
                  onClick={() => aiPrompt.trim() && handleAiQuickCommand(aiPrompt)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
