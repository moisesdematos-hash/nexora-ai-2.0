import Link from 'next/link'
import {
  Globe,
  Plus,
  Sparkles,
  LayoutTemplate,
  Smartphone,
  Code2,
  ArrowRight,
} from 'lucide-react'

export default function WebsitesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Web & Landing Page Studio
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Landing Pages, Portfólios & Websites com IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cria páginas de alta conversão, portfólios executivos e websites institucionais responsivos com SEO integrado e exportação de pacote HTML5/ZIP completo.
          </p>
        </div>
        <Link
          href="/websites/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Criar website
        </Link>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              9 Secções de Alta Conversão (CRO)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Navbar, Hero, Métricas de Impacto, Grid de Funcionalidades, Fluxo em 3 Etapas, Testemunhos, Tabela de Preços, FAQ e CTA Final.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Preview Responsivo Desktop, Tablet & Mobile
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Testa e edita o website em tempo real nos três formatos de ecrã com 5 temas visuais e metadados OpenGraph/SEO.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Publicação Instantânea & Pacote HTML5/ZIP
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Publica num domínio partilhável ou exporta o código-fonte limpo (.html autónomo ou pacote .zip pronto para deploy).
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border text-center bg-card/50">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-4">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          Lança a tua próxima landing page ou website em minutos
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Descreve o teu produto, serviço ou evento e o motor NEXORA WEB gera a arquitetura completa, copy persuasiva e design responsivo.
        </p>
        <Link
          href="/websites/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all"
        >
          Abrir NEXORA Web Studio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
