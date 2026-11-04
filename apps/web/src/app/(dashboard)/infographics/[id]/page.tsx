'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Sparkles,
  BarChart3,
  Palette,
  Plus,
  CheckCircle2,
} from 'lucide-react'

const PALETTE_MAP: Record<
  string,
  {
    name: string
    bgPrimary: string
    bgCard: string
    accentPrimary: string
    accentSecondary: string
    textPrimary: string
    textMuted: string
  }
> = {
  CYBER_INDIGO: {
    name: 'Cyber Indigo Dark',
    bgPrimary: '#0F172A',
    bgCard: '#1E293B',
    accentPrimary: '#6366F1',
    accentSecondary: '#06B6D4',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
  },
  EXECUTIVE_NAVY: {
    name: 'Executive Navy & Cyan',
    bgPrimary: '#0B132B',
    bgCard: '#1C2541',
    accentPrimary: '#3A86FF',
    accentSecondary: '#00F5D4',
    textPrimary: '#FFFFFF',
    textMuted: '#CBD5E1',
  },
  EMERALD_ECO: {
    name: 'Emerald Sustainability',
    bgPrimary: '#062C22',
    bgCard: '#0D4436',
    accentPrimary: '#10B981',
    accentSecondary: '#FBBF24',
    textPrimary: '#ECFDF5',
    textMuted: '#A7F3D0',
  },
  SUNSET_CORAL: {
    name: 'Sunset Coral Studio',
    bgPrimary: '#18111E',
    bgCard: '#2A1E35',
    accentPrimary: '#F43F5E',
    accentSecondary: '#FB923C',
    textPrimary: '#FFF1F2',
    textMuted: '#FDA4AF',
  },
  ROYAL_GOLD: {
    name: 'Royal Gold Luxury',
    bgPrimary: '#111111',
    bgCard: '#1F1F1F',
    accentPrimary: '#D4AF37',
    accentSecondary: '#F3E5AB',
    textPrimary: '#FAFAFA',
    textMuted: '#A3A3A3',
  },
}

export default function InfographicStudioPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const infoId = String(params?.id || 'demo-infographic')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

  const [title, setTitle] = useState(
    searchParams?.get('title') ||
      'Impacto da IA Generativa na Produtividade Empresarial 2026',
  )
  const [subtitle, setSubtitle] = useState(
    'Síntese Visual de Indicadores, Eficiência Operacional e Marcos de Transformação',
  )
  const [infographicType, setInfographicType] = useState(
    searchParams?.get('type') || 'STATISTICAL',
  )
  const [paletteId, setPaletteId] = useState(
    searchParams?.get('palette') || 'CYBER_INDIGO',
  )

  const [kpiCards, setKpiCards] = useState([
    {
      id: 'kpi-1',
      value: '+68%',
      label: 'Ganho de Produtividade',
      trend: '▲ +14% vs. ano anterior',
    },
    {
      id: 'kpi-2',
      value: '3.9x',
      label: 'Retorno sobre Investimento',
      trend: '▲ Payback em 4 meses',
    },
    {
      id: 'kpi-3',
      value: '99.4%',
      label: 'Precisão & Conformidade',
      trend: '▲ Padrão Enterprise',
    },
  ])

  const [chartItems, setChartItems] = useState([
    { label: 'Automação & IA Generativa', value: 92, unit: '%' },
    { label: 'Eficiência de Processos Core', value: 84, unit: '%' },
    { label: 'Redução de Tempo de Entrega', value: 76, unit: '%' },
    { label: 'Adoção pelas Equipas', value: 89, unit: '%' },
  ])

  const [milestones, setMilestones] = useState([
    {
      phase: '01',
      title: 'Diagnóstico & Mapeamento de Dados',
      description: 'Levantamento de indicadores críticos e alinhamento de metas.',
      metric: 'Semana 1-2',
    },
    {
      phase: '02',
      title: 'Implementação & Automação IA',
      description: 'Configuração de fluxos assistidos e integração com fontes de dados.',
      metric: 'Semana 3-5',
    },
    {
      phase: '03',
      title: 'Monitorização em Tempo Real & Escala',
      description: 'Acompanhamento contínuo de KPIs e expansão multi-equipa.',
      metric: 'Contínuo',
    },
  ])

  const [calloutBanner, setCalloutBanner] = useState({
    title: 'Insight Executivo Principal',
    body: 'Organizações que adotam comunicação visual orientada a dados aceleram a tomada de decisão em até 3,2 vezes.',
  })

  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    if (infoId && infoId !== 'demo-infographic') {
      fetch(`${apiUrl}/infographics/${infoId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((res) => {
          if (res && res.data) {
            setTitle(res.title || title)
            setSubtitle(res.data.subtitle || subtitle)
            setInfographicType(res.data.infographicType || infographicType)
            setPaletteId(res.data.palette || paletteId)
            if (Array.isArray(res.data.kpiCards)) setKpiCards(res.data.kpiCards)
            if (Array.isArray(res.data.chartItems)) setChartItems(res.data.chartItems)
            if (Array.isArray(res.data.milestones)) setMilestones(res.data.milestones)
            if (res.data.calloutBanner) setCalloutBanner(res.data.calloutBanner)
          }
        })
        .catch(() => {})
    }
  }, [infoId])

  const pal = PALETTE_MAP[paletteId] || PALETTE_MAP.CYBER_INDIGO

  const handleExportSvgLocal = () => {
    const svgEl = document.getElementById('nexora-infographic-svg')
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
      {/* Top Bar */}
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/infographics"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-foreground line-clamp-1">
                {title}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                800×1200 px • {infographicType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Paleta: {pal.name} • {kpiCards.length} KPIs • {chartItems.length} barras • {milestones.length} marcos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportSvgLocal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
          >
            <Download className="w-3.5 h-3.5" />
            Poster SVG (800×1200)
          </button>
          <a
            href={`${apiUrl}/infographics/${infoId}/export/pdf`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500"
          >
            <Download className="w-3.5 h-3.5" />
            Poster PDF
          </a>
        </div>
      </header>

      {statusMessage && (
        <div className="bg-emerald-600/10 border-b border-emerald-500/20 px-6 py-2 flex items-center justify-between text-xs text-emerald-400">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMessage}
          </span>
          <button onClick={() => setStatusMessage(null)} className="underline">
            Fechar
          </button>
        </div>
      )}

      {/* Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl w-full mx-auto">
        {/* Left/Center Live Vertical Poster Canvas (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[640px] rounded-2xl border border-border shadow-2xl overflow-hidden bg-slate-950">
            <svg
              id="nexora-infographic-svg"
              viewBox="0 0 800 1200"
              className="w-full h-auto block"
            >
              <defs>
                <linearGradient id="infoHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={pal.accentPrimary} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={pal.bgCard} stopOpacity="0.98" />
                </linearGradient>
              </defs>

              <rect width="800" height="1200" fill={pal.bgPrimary} />

              {/* Header */}
              <rect
                x="28"
                y="24"
                width="744"
                height="142"
                rx="20"
                fill="url(#infoHeaderGrad)"
              />
              <text
                x="56"
                y="58"
                fill={pal.accentSecondary}
                fontSize="11"
                fontWeight="800"
                fontFamily="Inter, sans-serif"
                letterSpacing="1.5"
              >
                NEXORA INFOGRAPHICS • {infographicType}
              </text>
              <text
                x="56"
                y="96"
                fill="#FFFFFF"
                fontSize="24"
                fontWeight="800"
                fontFamily="Inter, sans-serif"
              >
                {title.slice(0, 46)}
              </text>
              <text
                x="56"
                y="128"
                fill="#E2E8F0"
                fontSize="13"
                fontFamily="Inter, sans-serif"
              >
                {subtitle.slice(0, 82)}
              </text>

              {/* 3 KPI Cards */}
              {kpiCards.slice(0, 3).map((kpi, idx) => {
                const x = 44 + idx * 244
                return (
                  <g key={kpi.id} transform={`translate(${x}, 190)`}>
                    <rect
                      width="224"
                      height="128"
                      rx="16"
                      fill={pal.bgCard}
                      stroke={pal.accentPrimary}
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                    />
                    <text
                      x="20"
                      y="52"
                      fill={pal.accentSecondary}
                      fontSize="32"
                      fontWeight="800"
                      fontFamily="Inter, sans-serif"
                    >
                      {kpi.value}
                    </text>
                    <text
                      x="20"
                      y="82"
                      fill={pal.textPrimary}
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="Inter, sans-serif"
                    >
                      {kpi.label.slice(0, 24)}
                    </text>
                    <text
                      x="20"
                      y="106"
                      fill={pal.textMuted}
                      fontSize="11"
                      fontFamily="Inter, sans-serif"
                    >
                      {kpi.trend}
                    </text>
                  </g>
                )
              })}

              {/* Bar Chart Section */}
              <rect
                x="44"
                y="340"
                width="712"
                height="335"
                rx="18"
                fill={pal.bgCard}
                stroke="#334155"
                strokeWidth="1"
              />
              <text
                x="64"
                y="376"
                fill={pal.textPrimary}
                fontSize="16"
                fontWeight="800"
                fontFamily="Inter, sans-serif"
              >
                Distribuição de Impacto por Vetor (%)
              </text>

              {chartItems.slice(0, 5).map((item, idx) => {
                const y = 405 + idx * 52
                const maxBarW = 390
                const pct = Math.min(Math.max(item.value || 50, 5), 100)
                const barW = Math.round((pct / 100) * maxBarW)
                return (
                  <g key={idx} transform={`translate(64, ${y})`}>
                    <text
                      x="0"
                      y="16"
                      fill={pal.textPrimary}
                      fontSize="12.5"
                      fontWeight="600"
                      fontFamily="Inter, sans-serif"
                    >
                      {item.label.slice(0, 30)}
                    </text>
                    <rect
                      x="240"
                      y="2"
                      width={maxBarW}
                      height="20"
                      rx="10"
                      fill="#0F172A"
                      fillOpacity="0.6"
                    />
                    <rect
                      x="240"
                      y="2"
                      width={barW}
                      height="20"
                      rx="10"
                      fill={idx % 2 === 0 ? pal.accentPrimary : pal.accentSecondary}
                    />
                    <text
                      x={240 + maxBarW + 12}
                      y="17"
                      fill={pal.accentSecondary}
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="Inter, sans-serif"
                    >
                      {pct}%
                    </text>
                  </g>
                )
              })}

              {/* Milestones Section */}
              <text
                x="44"
                y="715"
                fill={pal.textPrimary}
                fontSize="16"
                fontWeight="800"
                fontFamily="Inter, sans-serif"
              >
                Fluxo Estruturado & Marcos Principais
              </text>

              {milestones.slice(0, 4).map((ms, idx) => {
                const y = 735 + idx * 82
                return (
                  <g key={idx} transform={`translate(44, ${y})`}>
                    <rect
                      width="712"
                      height="68"
                      rx="14"
                      fill={pal.bgCard}
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <circle cx="38" cy="34" r="20" fill={pal.accentPrimary} />
                    <text
                      x="38"
                      y="39"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="Inter, sans-serif"
                    >
                      {ms.phase}
                    </text>
                    <text
                      x="74"
                      y="28"
                      fill={pal.textPrimary}
                      fontSize="14"
                      fontWeight="700"
                      fontFamily="Inter, sans-serif"
                    >
                      {ms.title.slice(0, 48)}
                    </text>
                    <text
                      x="74"
                      y="49"
                      fill={pal.textMuted}
                      fontSize="11.5"
                      fontFamily="Inter, sans-serif"
                    >
                      {ms.description.slice(0, 72)}
                    </text>
                    <rect
                      x="595"
                      y="18"
                      width="98"
                      height="28"
                      rx="8"
                      fill={pal.bgPrimary}
                    />
                    <text
                      x="644"
                      y="36"
                      textAnchor="middle"
                      fill={pal.accentSecondary}
                      fontSize="10.5"
                      fontWeight="700"
                      fontFamily="Inter, sans-serif"
                    >
                      {ms.metric}
                    </text>
                  </g>
                )
              })}

              {/* Callout Banner */}
              <rect
                x="44"
                y="1072"
                width="712"
                height="72"
                rx="14"
                fill={pal.accentPrimary}
                fillOpacity="0.18"
                stroke={pal.accentPrimary}
                strokeWidth="1.5"
              />
              <text
                x="64"
                y="1098"
                fill={pal.accentSecondary}
                fontSize="12.5"
                fontWeight="800"
                fontFamily="Inter, sans-serif"
              >
                {calloutBanner.title}
              </text>
              <text
                x="64"
                y="1122"
                fill={pal.textPrimary}
                fontSize="11.5"
                fontFamily="Inter, sans-serif"
              >
                {calloutBanner.body.slice(0, 92)}
              </text>

              {/* Footer */}
              <text
                x="400"
                y="1174"
                textAnchor="middle"
                fill={pal.textMuted}
                fontSize="10.5"
                fontFamily="Inter, sans-serif"
              >
                Fonte: Estúdio Editorial & Analítico NEXORA AI 2.0 • 800×1200 Vector Poster
              </text>
            </svg>
          </div>
        </div>

        {/* Right Controls & Data Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Palette Switcher */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Palette className="w-4 h-4" />
              Paleta Cromática do Infográfico
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PALETTE_MAP).map(([id, spec]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaletteId(id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    paletteId === id
                      ? 'border-emerald-500 bg-emerald-500/10 text-foreground'
                      : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: spec.accentPrimary }}
                  />
                  <span className="truncate">{spec.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* KPI Editor */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Cartões de Destaque (Big Numbers KPIs)
            </div>
            <div className="space-y-2.5">
              {kpiCards.map((kpi, idx) => (
                <div
                  key={kpi.id}
                  className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border border-border bg-background"
                >
                  <input
                    type="text"
                    value={kpi.value}
                    onChange={(e) => {
                      const next = [...kpiCards]
                      next[idx] = { ...kpi, value: e.target.value }
                      setKpiCards(next)
                    }}
                    className="px-2 py-1 rounded border border-border bg-card text-xs font-bold text-emerald-400"
                  />
                  <input
                    type="text"
                    value={kpi.label}
                    onChange={(e) => {
                      const next = [...kpiCards]
                      next[idx] = { ...kpi, label: e.target.value }
                      setKpiCards(next)
                    }}
                    className="col-span-2 px-2 py-1 rounded border border-border bg-card text-xs text-foreground"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart Editor */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Dados do Gráfico de Barras (%)
              </span>
              <button
                type="button"
                onClick={() => {
                  if (chartItems.length >= 5) return
                  setChartItems((prev) => [
                    ...prev,
                    { label: 'Novo Indicador IA', value: 88, unit: '%' },
                  ])
                  setStatusMessage('Nova barra adicionada ao gráfico.')
                }}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Barra
              </button>
            </div>
            <div className="space-y-2">
              {chartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const next = [...chartItems]
                      next[idx] = { ...item, label: e.target.value }
                      setChartItems(next)
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs"
                  />
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={item.value}
                    onChange={(e) => {
                      const next = [...chartItems]
                      next[idx] = { ...item, value: Number(e.target.value) }
                      setChartItems(next)
                    }}
                    className="w-16 px-2 py-1.5 rounded-lg border border-border bg-background text-xs font-bold text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Actions */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4" />
              Comandos Visuais IA
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaletteId('ROYAL_GOLD')
                  setStatusMessage('Estilo Executive Luxury Gold aplicado ao poster.')
                }}
                className="text-left px-3 py-2 rounded-xl border border-border bg-background hover:border-emerald-500/50 text-xs text-foreground"
              >
                ✨ Aplicar tema executivo Royal Gold
              </button>
              <button
                type="button"
                onClick={() => {
                  if (milestones.length < 4) {
                    setMilestones((prev) => [
                      ...prev,
                      {
                        phase: `0${prev.length + 1}`,
                        title: 'Consolidação Global & Auditoria IA',
                        description:
                          'Otimização contínua de performance com relatórios executivos.',
                        metric: 'Q4 Meta',
                      },
                    ])
                    setStatusMessage('4.º marco cronológico adicionado ao poster.')
                  }
                }}
                className="text-left px-3 py-2 rounded-xl border border-border bg-background hover:border-emerald-500/50 text-xs text-foreground"
              >
                ✨ Adicionar 4.º marco estratégico na cronologia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
