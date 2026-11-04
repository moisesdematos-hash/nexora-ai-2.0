'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Briefcase,
  Terminal,
  ClipboardCheck,
  Compass,
} from 'lucide-react'
import Link from 'next/link'

const DOC_TEMPLATES = [
  {
    id: 'EXECUTIVE_REPORT',
    name: 'Relatório Executivo',
    category: 'Gestão & Estratégia',
    desc: 'Sumário executivo, tabela de KPIs, diagnóstico estratégico e plano de ação.',
    color: '#4F46E5',
    icon: FileText,
  },
  {
    id: 'COMMERCIAL_PROPOSAL',
    name: 'Proposta Comercial Enterprise',
    category: 'Vendas & Negócios',
    desc: 'Contexto do cliente, solução proposta, cronograma em 4 fases e quadro de investimento ROI.',
    color: '#0EA5E9',
    icon: Briefcase,
  },
  {
    id: 'TECHNICAL_MANUAL',
    name: 'Manual Técnico & Arquitetura',
    category: 'Engenharia & Produto',
    desc: 'Visão arquitetural, matriz de componentes/SLAs, segurança e protocolo de deploy.',
    color: '#10B981',
    icon: Terminal,
  },
  {
    id: 'SOP_PLAYBOOK',
    name: 'Playbook & Procedimento (SOP)',
    category: 'Operações & Qualidade',
    desc: 'Diretrizes operacionais, matriz RACI, instruções passo a passo e pontos de controlo.',
    color: '#F59E0B',
    icon: ClipboardCheck,
  },
  {
    id: 'PROJECT_CHARTER',
    name: 'Project Charter & Plano Diretor',
    category: 'PMO & Projetos',
    desc: 'Objetivos SMART, pacotes de trabalho (WBS), governança e mitigação de riscos.',
    color: '#8B5CF6',
    icon: Compass,
  },
]

export default function NewDocPage() {
  const router = useRouter()
  const [title, setTitle] = useState('Relatório Estratégico de Transformação Digital & IA 2026')
  const [template, setTemplate] = useState('EXECUTIVE_REPORT')
  const [prompt, setPrompt] = useState(
    'Análise de impacto operacional, automação inteligente de processos, redução de custos em 32% e governança executiva.',
  )
  const [tone, setTone] = useState('Executivo e Analítico')
  const [language, setLanguage] = useState('pt')
  const [author, setAuthor] = useState('Direção de Estratégia — NEXORA AI')
  const [organizationName, setOrganizationName] = useState('NEXORA Enterprise')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!title.trim()) return
    setIsGenerating(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
    try {
      const res = await fetch(`${apiUrl}/docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: `proj-doc-${Date.now()}`,
          title,
          template,
          prompt,
          tone,
          language,
          author,
          organizationName,
        }),
      })
      if (res.ok) {
        const created = await res.json()
        router.push(`/docs/${created.id || 'demo-doc'}`)
        return
      }
    } catch {
      // Fallback to local studio mode
    }
    router.push(
      `/docs/demo-doc?title=${encodeURIComponent(title)}&template=${encodeURIComponent(template)}`,
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar a NEXORA Docs
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
          NEXORA DOCS ENGINE v2.0
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Configurar Novo Documento Profissional
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Escolhe a estrutura documental e define o contexto para gerar secções, tabelas e matriz de ação automaticamente.
          </p>
        </div>

        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Seleciona o Modelo Documental
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DOC_TEMPLATES.map((tpl) => {
              const Icon = tpl.icon
              const active = template === tpl.id
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                      : 'border-border bg-background hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="p-2 rounded-lg text-white"
                      style={{ backgroundColor: tpl.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    {active && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                  </div>
                  <div className="font-semibold text-sm text-foreground">{tpl.name}</div>
                  <div className="text-[11px] text-indigo-400 font-medium mb-1">
                    {tpl.category}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{tpl.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Título do Documento
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
              placeholder="Ex: Proposta Comercial de Modernização Cloud"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Briefing / Prompt Detalhado
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground"
              placeholder="Descreve os objetivos, pontos principais, métricas ou requisitos..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Autor / Equipa Responsável
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Organização / Empresa
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Tom Editorial
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
            >
              <option value="Executivo e Analítico">Executivo e Analítico</option>
              <option value="Persuasivo e Comercial">Persuasivo e Comercial</option>
              <option value="Técnico e Rigoroso">Técnico e Rigoroso</option>
              <option value="Instrutivo e Direto">Instrutivo e Direto</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Idioma
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
            >
              <option value="pt">Português (PT)</option>
              <option value="en">Inglês (EN)</option>
              <option value="es">Espanhol (ES)</option>
              <option value="fr">Francês (FR)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                A estruturar documento com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Documento no Estúdio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
