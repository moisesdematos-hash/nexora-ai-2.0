import Link from 'next/link'
import {
  FileText,
  Plus,
  Sparkles,
  FileCheck,
  Table,
  Wand2,
  ArrowRight,
} from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Docs & Corporate Editorial Studio
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Documentos, Relatórios & Propostas Inteligentes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cria relatórios executivos, propostas comerciais B2B, manuais técnicos, playbooks SOP e planos diretores com exportação PDF, DOCX e Markdown.
          </p>
        </div>
        <Link
          href="/docs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Criar documento
        </Link>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              5 Templates Corporativos & Técnicos
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Relatório Executivo, Proposta Comercial Enterprise, Manual Técnico, Playbook SOP (Matriz RACI) e Project Charter.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 shrink-0">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Blocos Estruturados & Matrizes de Ação
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sumário executivo, secções hierárquicas, tabelas de KPIs editáveis, caixas de destaque (Callouts) e checklists de responsáveis.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Exportação Oficial PDF, DOCX & Markdown
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Geração nativa de ficheiros PDF paginados (A4), documentos Microsoft Word (.docx) e Markdown estruturado (.md).
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border text-center bg-card/50">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          Redige documentos executivos e manuais completos em segundos
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Seleciona o template corporativo, descreve o contexto ou objetivo e edita com o Assistente de IA da NEXORA.
        </p>
        <Link
          href="/docs/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md transition-all"
        >
          Abrir NEXORA Docs Studio
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
