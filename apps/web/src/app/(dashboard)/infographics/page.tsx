import Link from 'next/link'
import {
  BarChart3,
  Plus,
  Sparkles,
  PieChart,
  Layers,
  Wand2,
  ArrowRight,
} from 'lucide-react'

export default function InfographicsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Infographics & Data Visualization Studio
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Infográficos, Cronologias & Visualização de Dados
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transforma estatísticas, processos e cronologias em posters infográficos verticais (800×1200) de alta resolução prontos para publicação em SVG e PDF.
          </p>
        </div>
        <Link
          href="/infographics/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Criar infográfico
        </Link>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              5 Arquétipos Visuais de Impacto
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Estatístico & KPIs, Cronologia Visual, Fluxo de Processo, Comparativo Lado a Lado e Guia em Blocos (Listicle).
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Composição Vertical 800×1200 px
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cabeçalho editorial, cartões de números de destaque, barras comparativas, linha temporal e rodapé de fontes.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 shrink-0">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Exportação Poster SVG & PDF
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Descarrega o poster vetorial escalável (.svg) ou ficheiro PDF de alta definição pronto para partilha.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border text-center bg-card/50">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg mb-4">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          Comunica dados complexos num único poster visual
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Escolhe o arquétipo e a paleta cromática para gerar automaticamente gráficos, KPIs e marcos visuais.
        </p>
        <Link
          href="/infographics/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all"
        >
          Abrir NEXORA Infographics Studio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
