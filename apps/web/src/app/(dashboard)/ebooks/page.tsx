import Link from 'next/link'
import { BookOpen, Plus, Sparkles, FileText, ArrowRight, Clock, Award } from 'lucide-react'

export default function EbooksPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Ebook Studio
          </div>
          <h1 className="text-2xl font-bold text-foreground">E-books & Publicações Digitais</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Criação de e-books completos com escrita incremental, memória editorial e paginação real (10 a 500+ páginas).
          </p>
        </div>
        <Link
          href="/ebooks/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Criar novo e-book
        </Link>
      </div>

      {/* Highlights / Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Escrita Incremental</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Capítulos gerados progressivamente com salvamento automático e checkpoints de recuperação.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Memória Editorial</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Preservação de contexto, conceitos, estilo e terminologia entre capítulos sem repetições.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Exportação Profissional</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Geração de PDFs diagramados com capa personalizada, sumário automático e numeração.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State / CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border text-center bg-card/50">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-lg mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">Pronto para escrever o teu próximo livro?</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Define o tema, público e meta de páginas (10 ou 20 páginas para o MVP inicial) e a IA estruturará o índice completo para a tua aprovação.
        </p>
        <Link
          href="/ebooks/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all"
        >
          Iniciar assistente de criação
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
