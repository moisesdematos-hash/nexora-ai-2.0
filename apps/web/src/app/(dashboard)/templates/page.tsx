'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  LayoutTemplate,
  Sparkles,
  Presentation,
  BookOpen,
  FileText,
  GitBranch,
  BarChart3,
  Globe,
  ArrowRight,
} from 'lucide-react'

const TEMPLATES_CATALOG = [
  {
    id: 'tpl-pres-1',
    name: 'Pitch Deck Executivo & Investidores (Série A/B)',
    type: 'PRESENTATION',
    badge: '16:9 Widescreen',
    desc: '12 slides estruturados: Problema, Solução, Mercado TAM/SAM/SOM, Tração, Modelo de Negócio e Equipa.',
    href: '/presentations/new',
    color: 'from-violet-600 to-indigo-600',
    icon: Presentation,
  },
  {
    id: 'tpl-ebook-1',
    name: 'E-book Técnico & Guia Definitivo (100 a 500 Páginas)',
    type: 'EBOOK',
    badge: 'Longform Engine',
    desc: 'Obra editorial completa com Partes, Capítulos, Secções, Memória Editorial, Capa HD e exportação EPUB 3.0/PDF/DOCX.',
    href: '/ebooks/new',
    color: 'from-amber-600 to-orange-600',
    icon: BookOpen,
  },
  {
    id: 'tpl-doc-1',
    name: 'Proposta Comercial Enterprise & ROI B2B',
    type: 'DOCUMENT',
    badge: 'Corporate Doc',
    desc: 'Diagnóstico do cliente, arquitetura proposta, cronograma em 4 sprints, quadro de investimento e SLA.',
    href: '/docs/new',
    color: 'from-indigo-600 to-blue-600',
    icon: FileText,
  },
  {
    id: 'tpl-mm-1',
    name: 'Arquitetura Cloud & Mapa Mental de Produto',
    type: 'MINDMAP',
    badge: 'Vector SVG',
    desc: 'Árvore hierárquica com curvas Bézier, badges de KPI e expansão dinâmica de sub-ramos por IA.',
    href: '/mindmaps/new',
    color: 'from-cyan-600 to-blue-600',
    icon: GitBranch,
  },
  {
    id: 'tpl-info-1',
    name: 'Poster Infográfico de Estatísticas & Marcos (800×1200)',
    type: 'INFOGRAPHIC',
    badge: '800×1200 Poster',
    desc: 'Composição vertical com 3 Big Number KPIs, gráfico comparativo de barras e linha temporal.',
    href: '/infographics/new',
    color: 'from-emerald-600 to-teal-600',
    icon: BarChart3,
  },
  {
    id: 'tpl-web-1',
    name: 'Landing Page SaaS de Alta Conversão (9 Secções)',
    type: 'WEBSITE',
    badge: 'HTML5 + ZIP',
    desc: 'Página responsiva Desktop/Tablet/Mobile com Hero, Métricas, Funcionalidades, Preços, FAQ e SEO OpenGraph.',
    href: '/websites/new',
    color: 'from-blue-600 to-indigo-600',
    icon: Globe,
  },
]

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>('ALL')

  const filtered =
    filter === 'ALL'
      ? TEMPLATES_CATALOG
      : TEMPLATES_CATALOG.filter((t) => t.type === filter)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Unified Template Library
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Biblioteca Oficial de Modelos & Estruturas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Inicia qualquer projeto em segundos com modelos desenhados por especialistas editoriais, designers e arquitetos de software.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: 'Todos os Módulos (6)' },
          { id: 'PRESENTATION', label: 'Apresentações' },
          { id: 'EBOOK', label: 'E-books (10–500+ págs)' },
          { id: 'DOCUMENT', label: 'Documentos & Propostas' },
          { id: 'MINDMAP', label: 'Mapas Mentais' },
          { id: 'INFOGRAPHIC', label: 'Infográficos' },
          { id: 'WEBSITE', label: 'Websites & Landing Pages' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filter === cat.id
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => {
          const Icon = tpl.icon
          return (
            <div
              key={tpl.id}
              className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between shadow-sm hover:border-indigo-500/50 transition-all"
            >
              <div>
                <div
                  className={`h-28 bg-gradient-to-br ${tpl.color} p-5 flex items-start justify-between text-white`}
                >
                  <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-sm">
                    {tpl.badge}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    {tpl.type}
                  </div>
                  <h2 className="text-base font-bold text-foreground">
                    {tpl.name}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tpl.desc}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link
                  href={tpl.href}
                  className="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-indigo-600 hover:text-white text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-all"
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  Usar Este Modelo
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
