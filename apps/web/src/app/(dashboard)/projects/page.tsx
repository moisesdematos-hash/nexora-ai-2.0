import { Plus, Search, Grid3X3, List, Presentation, BookOpen, FileText, Brain, BarChart3, Globe, FolderOpen } from 'lucide-react'
import Link from 'next/link'

const typeLabels: Record<string, { label: string; icon: React.ElementType; gradient: string }> = {
  PRESENTATION: { label: 'Apresentação', icon: Presentation, gradient: 'from-violet-500 to-purple-600' },
  EBOOK: { label: 'E-book', icon: BookOpen, gradient: 'from-blue-500 to-cyan-600' },
  DOCUMENT: { label: 'Documento', icon: FileText, gradient: 'from-green-500 to-emerald-600' },
  MIND_MAP: { label: 'Mapa Mental', icon: Brain, gradient: 'from-orange-500 to-amber-600' },
  INFOGRAPHIC: { label: 'Infográfico', icon: BarChart3, gradient: 'from-pink-500 to-rose-600' },
  WEBSITE: { label: 'Website', icon: Globe, gradient: 'from-teal-500 to-cyan-600' },
}

export default async function ProjectsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Todos os teus projetos NEXORA AI</p>
        </div>
        <Link href="/projects/new" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">
          <Plus className="w-4 h-4" />
          Novo projeto
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Pesquisar projetos..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background">
          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Vista de grelha">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Vista de lista">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-600 text-white">
          Todos
        </button>
        {Object.entries(typeLabels).map(([key, val]) => (
          <button key={key} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:border-violet-400 hover:text-violet-600 transition-colors">
            {val.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-950 dark:to-blue-950 flex items-center justify-center mb-4">
          <FolderOpen className="w-8 h-8 text-violet-600" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2">Nenhum projeto encontrado</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Começa por criar o teu primeiro projeto com IA. Apresentações, e-books, documentos e muito mais.
        </p>
        <Link href="/projects/new" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Criar primeiro projeto
        </Link>
      </div>
    </div>
  )
}
