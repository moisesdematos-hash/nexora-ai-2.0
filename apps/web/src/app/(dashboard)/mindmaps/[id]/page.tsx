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
  GitBranch,
  Wand2,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
} from 'lucide-react'

interface MindMapNode {
  id: string
  parentId: string | null
  label: string
  notes?: string
  category?: string
  level: number
  color: string
  x: number
  y: number
  metricBadge?: string
}

interface MindMapEdge {
  id: string
  source: string
  target: string
  label?: string
  style: 'SOLID' | 'DASHED'
}

export default function MindMapStudioPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const mapId = String(params?.id || 'demo-mindmap')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

  const [title, setTitle] = useState(
    searchParams?.get('title') || 'Arquitetura & Estratégia de Produto SaaS IA',
  )
  const [diagramType, setDiagramType] = useState(
    searchParams?.get('type') || 'MIND_MAP',
  )
  const [nodes, setNodes] = useState<MindMapNode[]>([
    {
      id: 'node-root',
      parentId: null,
      label: 'NEXORA AI 2.0 Core',
      notes: 'Nó central do ecossistema de criação digital com IA',
      category: 'ROOT',
      level: 0,
      color: '#6366F1',
      x: 180,
      y: 360,
      metricBadge: 'Core',
    },
    {
      id: 'node-l1-1',
      parentId: 'node-root',
      label: '1. Visão & Posicionamento',
      notes: 'Proposta de valor diferenciadora e OKRs',
      category: 'Estratégia',
      level: 1,
      color: '#06B6D4',
      x: 520,
      y: 120,
      metricBadge: 'OKR #1',
    },
    {
      id: 'node-l1-2',
      parentId: 'node-root',
      label: '2. Motores de IA & Design',
      notes: 'Orquestração multi-modelo e 20 layouts inteligentes',
      category: 'Produto',
      level: 1,
      color: '#8B5CF6',
      x: 520,
      y: 280,
      metricBadge: 'AI Engine',
    },
    {
      id: 'node-l1-3',
      parentId: 'node-root',
      label: '3. Operações & Segurança',
      notes: 'Multi-tenancy, RBAC e conformidade enterprise',
      category: 'Segurança',
      level: 1,
      color: '#10B981',
      x: 520,
      y: 440,
      metricBadge: '99.9% SLA',
    },
    {
      id: 'node-l1-4',
      parentId: 'node-root',
      label: '4. Expansão & Monetização',
      notes: 'Planos SaaS, créditos IA e 4 idiomas nativos',
      category: 'Growth',
      level: 1,
      color: '#F59E0B',
      x: 520,
      y: 600,
      metricBadge: 'ROI +3.8x',
    },
    {
      id: 'node-l2-1-1',
      parentId: 'node-l1-1',
      label: 'Proposta de Valor B2B/B2C',
      category: 'Estratégia',
      level: 2,
      color: '#06B6D4',
      x: 880,
      y: 95,
    },
    {
      id: 'node-l2-1-2',
      parentId: 'node-l1-1',
      label: 'Metas Trimestrais (OKRs)',
      category: 'Estratégia',
      level: 2,
      color: '#06B6D4',
      x: 880,
      y: 155,
    },
    {
      id: 'node-l2-2-1',
      parentId: 'node-l1-2',
      label: 'Longform E-book Engine (500+ págs)',
      category: 'Produto',
      level: 2,
      color: '#8B5CF6',
      x: 880,
      y: 255,
    },
    {
      id: 'node-l2-2-2',
      parentId: 'node-l1-2',
      label: 'Presentation & Design Studio',
      category: 'Produto',
      level: 2,
      color: '#8B5CF6',
      x: 880,
      y: 315,
    },
  ])

  const [edges, setEdges] = useState<MindMapEdge[]>([
    { id: 'e-1', source: 'node-root', target: 'node-l1-1', style: 'SOLID' },
    { id: 'e-2', source: 'node-root', target: 'node-l1-2', style: 'SOLID' },
    { id: 'e-3', source: 'node-root', target: 'node-l1-3', style: 'SOLID' },
    { id: 'e-4', source: 'node-root', target: 'node-l1-4', style: 'SOLID' },
    { id: 'e-1-1', source: 'node-l1-1', target: 'node-l2-1-1', style: 'SOLID' },
    { id: 'e-1-2', source: 'node-l1-1', target: 'node-l2-1-2', style: 'SOLID' },
    { id: 'e-2-1', source: 'node-l1-2', target: 'node-l2-2-1', style: 'SOLID' },
    { id: 'e-2-2', source: 'node-l1-2', target: 'node-l2-2-2', style: 'SOLID' },
  ])

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-root')
  const [zoom, setZoom] = useState(1)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    if (mapId && mapId !== 'demo-mindmap') {
      fetch(`${apiUrl}/mindmaps/${mapId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((res) => {
          if (res && res.data) {
            setTitle(res.title || title)
            setDiagramType(res.data.diagramType || diagramType)
            if (Array.isArray(res.data.nodes)) setNodes(res.data.nodes)
            if (Array.isArray(res.data.edges)) setEdges(res.data.edges)
          }
        })
        .catch(() => {})
    }
  }, [mapId])

  const selectedNode =
    nodes.find((n) => n.id === selectedNodeId) || nodes[0]

  const handleExpandSelectedNode = async () => {
    if (!selectedNode) return
    if (mapId !== 'demo-mindmap') {
      try {
        const res = await fetch(`${apiUrl}/mindmaps/${mapId}/expand-node`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodeId: selectedNode.id, branchCount: 3 }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.mindMap?.data?.nodes) {
            setNodes(data.mindMap.data.nodes)
            setEdges(data.mindMap.data.edges)
            setStatusMessage(
              `Nó "${selectedNode.label}" expandido com ${data.addedNodes?.length || 3} sub-ramos gerados por IA.`,
            )
            return
          }
        }
      } catch {
        // Fallback local expansion
      }
    }

    const existingChildren = nodes.filter((n) => n.parentId === selectedNode.id)
    const baseX = selectedNode.x + 330
    const baseY = selectedNode.y
    const newNodes: MindMapNode[] = []
    const newEdges: MindMapEdge[] = []

    const labels = [
      `Sub-ramo IA 1 (${selectedNode.label.slice(0, 14)})`,
      `Indicadores & Métricas Chave`,
      `Automação & Plano de Execução`,
    ]

    labels.forEach((lbl, idx) => {
      const childIdx = existingChildren.length + idx
      const id = `node-ai-${Date.now()}-${idx}`
      newNodes.push({
        id,
        parentId: selectedNode.id,
        label: lbl,
        notes: 'Gerado pelo motor NEXORA Mind Maps IA',
        category: selectedNode.category || 'IA+',
        level: selectedNode.level + 1,
        color: selectedNode.color,
        x: Math.min(baseX, 980),
        y: Math.max(60, Math.min(740, baseY - 45 + childIdx * 55)),
        metricBadge: 'IA+',
      })
      newEdges.push({
        id: `edge-${selectedNode.id}-${id}`,
        source: selectedNode.id,
        target: id,
        style: 'SOLID',
      })
    })

    setNodes((prev) => [...prev, ...newNodes])
    setEdges((prev) => [...prev, ...newEdges])
    setStatusMessage(
      `3 sub-ramos inteligentes adicionados a "${selectedNode.label}".`,
    )
  }

  const handleDeleteSelectedNode = () => {
    if (!selectedNode || selectedNode.level === 0) return
    const toRemove = new Set<string>([selectedNode.id])
    nodes.forEach((n) => {
      if (n.parentId === selectedNode.id) toRemove.add(n.id)
    })
    setNodes((prev) => prev.filter((n) => !toRemove.has(n.id)))
    setEdges((prev) =>
      prev.filter((e) => !toRemove.has(e.source) && !toRemove.has(e.target)),
    )
    setSelectedNodeId('node-root')
    setStatusMessage('Ramo removido do diagrama.')
  }

  const handleExportSvgLocal = () => {
    const svgEl = document.getElementById('nexora-mindmap-svg')
    if (!svgEl) return
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgEl)
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/mindmaps"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold text-foreground">{title}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold">
                {diagramType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {nodes.length} nós • {edges.length} conexões vetoriais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(1)))}
            className="p-2 rounded-lg border border-border hover:bg-muted"
            title="Reduzir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-muted-foreground px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(1)))}
            className="p-2 rounded-lg border border-border hover:bg-muted"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportSvgLocal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar SVG Vetorial
          </button>
          <a
            href={`${apiUrl}/mindmaps/${mapId}/export/md`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold hover:bg-muted"
          >
            <Download className="w-3.5 h-3.5" />
            Outline (.md)
          </a>
        </div>
      </header>

      {statusMessage && (
        <div className="bg-cyan-600/10 border-b border-cyan-500/20 px-6 py-2 flex items-center justify-between text-xs text-cyan-400">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMessage}
          </span>
          <button onClick={() => setStatusMessage(null)} className="underline">
            Fechar
          </button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] w-full mx-auto">
        {/* Interactive Canvas (9 cols) */}
        <div className="lg:col-span-9 rounded-2xl border border-border bg-slate-950 overflow-auto relative shadow-inner min-h-[680px] flex items-center justify-center">
          <svg
            id="nexora-mindmap-svg"
            viewBox="0 0 1240 780"
            className="w-full h-full transition-transform duration-150"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <defs>
              <pattern
                id="mm-dots"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="#334155" />
              </pattern>
            </defs>
            <rect width="1240" height="780" fill="#0F172A" />
            <rect width="1240" height="780" fill="url(#mm-dots)" />

            {/* Curved Edges */}
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.source)
              const tgt = nodes.find((n) => n.id === edge.target)
              if (!src || !tgt) return null
              const x1 = src.x + 210
              const y1 = src.y + 28
              const x2 = tgt.x
              const y2 = tgt.y + 28
              const cx = x1 + (x2 - x1) * 0.5
              return (
                <g key={edge.id}>
                  <path
                    d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={tgt.color || '#6366F1'}
                    strokeWidth="2.5"
                    strokeOpacity="0.8"
                  />
                  <circle cx={x2} cy={y2} r="4" fill={tgt.color || '#6366F1'} />
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId
              const isRoot = node.level === 0
              const boxW = isRoot ? 220 : 215
              const boxH = isRoot ? 60 : 54
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer"
                >
                  <rect
                    width={boxW}
                    height={boxH}
                    rx="12"
                    fill={isRoot ? node.color : '#1E293B'}
                    stroke={isSelected ? '#38BDF8' : node.color}
                    strokeWidth={isSelected ? 3.5 : 2}
                  />
                  <text
                    x="14"
                    y="24"
                    fill="#FFFFFF"
                    fontSize={isRoot ? '13' : '11.5'}
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.label.length > 26
                      ? `${node.label.slice(0, 24)}...`
                      : node.label}
                  </text>
                  <text
                    x="14"
                    y="42"
                    fill="#94A3B8"
                    fontSize="9.5"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.category || `Nível ${node.level}`}{' '}
                    {node.metricBadge ? `• ${node.metricBadge}` : ''}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Right Node Inspector & AI Expansion (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Inspetor de Nó Selecionado
              </span>
              {selectedNode && selectedNode.level > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSelectedNode}
                  className="text-rose-400 hover:text-rose-300 p-1"
                  title="Eliminar Ramo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedNode && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Rótulo do Nó
                  </label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => {
                      const val = e.target.value
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === selectedNode.id ? { ...n, label: val } : n,
                        ),
                      )
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={selectedNode.category || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, category: val }
                              : n,
                          ),
                        )
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Badge / KPI
                    </label>
                    <input
                      type="text"
                      value={selectedNode.metricBadge || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, metricBadge: val }
                              : n,
                          ),
                        )
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Notas Contextuais
                  </label>
                  <textarea
                    rows={2}
                    value={selectedNode.notes || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === selectedNode.id ? { ...n, notes: val } : n,
                        ),
                      )
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExpandSelectedNode}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Expandir Este Ramo com IA (+3 Nós)
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              Ações Globais de IA
            </div>
            {[
              {
                label: 'Adicionar KPIs a todos os ramos L1',
                action: () => {
                  setNodes((prev) =>
                    prev.map((n, i) =>
                      n.level === 1
                        ? { ...n, metricBadge: `KPI +${20 + i * 8}%` }
                        : n,
                    ),
                  )
                  setStatusMessage('Badges de KPI aplicados aos ramos principais.')
                },
              },
              {
                label: 'Converter modo para Fluxograma',
                action: () => {
                  setDiagramType('FLOWCHART')
                  setStatusMessage('Diagrama configurado como Fluxograma (FLOWCHART).')
                },
              },
              {
                label: 'Converter modo para Arquitetura',
                action: () => {
                  setDiagramType('ARCHITECTURE')
                  setStatusMessage('Diagrama configurado como Arquitetura Técnica.')
                },
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="w-full text-left px-3 py-2 rounded-xl border border-border bg-background hover:border-cyan-500/50 text-xs text-foreground flex items-center justify-between"
              >
                <span>{item.label}</span>
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
