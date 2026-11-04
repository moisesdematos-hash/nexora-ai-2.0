import Link from 'next/link'
import {
  Presentation,
  Plus,
  Sparkles,
  Layout,
  Palette,
  Wand2,
  ArrowRight,
} from 'lucide-react'

export default function PresentationsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Presentation & Design Engine
          </div>
          <h1 className="text-2xl font-bold text-foreground">Apresentações Inteligentes com IA</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transforma prompts, documentos, dados CSV ou URLs em apresentações widescreen 16:9 com 20 layouts inteligentes e 10 temas profissionais.
          </p>
        </div>
        <Link
          href="/presentations/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Criar apresentação
        </Link>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 shrink-0">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">20 Layouts-Base Inteligentes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Seleção automática de Capa, Colunas, Comparação, KPIs, Gráficos, Cronologia, Processo, Infográfico, Tabela e Estudo de Caso.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">10 Temas & Validação WCAG</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Corporativo, Executivo, Minimalista, Educativo, Académico, Tecnológico, Financeiro, Criativo, Institucional e Premium.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Assistente de IA Reversível</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comandos em linguagem natural para transformar slides em infográficos, criar +10 slides, traduzir ou gerar notas do orador.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State / CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border text-center bg-card/50">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-lg mb-4">
          <Presentation className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          Cria a tua próxima apresentação executiva em segundos
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Escolhe a fonte (Prompt, Texto, Documento ou URL), aprova o esboço estruturado e personaliza no Editor Visual com exportação PPTX e PDF 16:9.
        </p>
        <Link
          href="/presentations/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all"
        >
          Iniciar NEXORA Presentation Engine
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
