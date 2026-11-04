import Link from 'next/link'
import {
  GitBranch,
  Plus,
  Sparkles,
  Network,
  Workflow,
  Wand2,
  ArrowRight,
} from 'lucide-react'

export default function MindMapsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Mind Maps & Flowchart Engine
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Mapas Mentais, Fluxogramas & Diagramas com IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Decompõe temas complexos em mapas mentais radiais, fluxogramas operacionais, organogramas e diagramas de arquitetura com expansão de nós assistida por IA.
          </p>
        </div>
        <Link
          href="/mindmaps/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Criar mapa mental
        </Link>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              5 Tipos de Diagramas Estruturados
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mapa Mental Estratégico, Fluxograma de Processo, Organograma, Arquitetura de Sistema e Mapa Conceitual.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 shrink-0">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Expansão de Ramos por IA
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Seleciona qualquer nó do diagrama e pede à IA para gerar sub-ramos, métricas KPI ou converter o layout.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Exportação Vetorial SVG & Markdown
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Exporta diagramas vetoriais de alta resolução (.svg) com curvas Bézier ou estruturas hierárquicas Markdown (.md).
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border text-center bg-card/50">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-4">
          <GitBranch className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          Visualiza e expande ideias em mapas mentais interativos
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Gera a árvore principal a partir de um prompt e expande cada ramo com o motor NEXORA Mind Maps.
        </p>
        <Link
          href="/mindmaps/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all"
        >
          Abrir NEXORA Mind Maps Studio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
