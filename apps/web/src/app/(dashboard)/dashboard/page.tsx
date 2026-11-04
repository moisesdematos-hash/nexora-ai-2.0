import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  Presentation,
  BookOpen,
  FileText,
  Brain,
  BarChart3,
  Globe,
  Plus,
  Clock,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { NexoraQuantumSuite } from '@/components/nexora-quantum/NexoraQuantumSuite'

const createModules = [
  {
    icon: Presentation,
    label: 'Apresentação',
    href: '/presentations/new',
    gradient: 'from-violet-500 to-purple-600',
    description: 'Slides profissionais com IA',
  },
  {
    icon: BookOpen,
    label: 'E-book',
    href: '/ebooks/new',
    gradient: 'from-blue-500 to-cyan-600',
    description: '10 a 500+ páginas',
  },
  {
    icon: FileText,
    label: 'Documento',
    href: '/docs/new',
    gradient: 'from-green-500 to-emerald-600',
    description: 'Relatórios e propostas',
  },
  {
    icon: Brain,
    label: 'Mapa Mental',
    href: '/mindmaps/new',
    gradient: 'from-orange-500 to-amber-600',
    description: 'Fluxogramas editáveis',
  },
  {
    icon: BarChart3,
    label: 'Infográfico',
    href: '/infographics/new',
    gradient: 'from-pink-500 to-rose-600',
    description: 'Visualizações de dados',
  },
  {
    icon: Globe,
    label: 'Website',
    href: '/websites/new',
    gradient: 'from-teal-500 to-cyan-600',
    description: 'Landing pages e portfólios',
  },
]

const stats = [
  { label: 'Créditos disponíveis', value: '3.420', icon: Zap, color: 'text-violet-600' },
  { label: 'Estúdios ativos', value: '6', icon: TrendingUp, color: 'text-blue-600' },
  { label: 'Formatos de exportação', value: '8', icon: Sparkles, color: 'text-green-600' },
]

export default async function DashboardPage() {
  let displayName = 'Criador NEXORA'
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Criador NEXORA'
    }
  } catch {
    // Fallback for local/demo mode
  }
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          O que vamos criar hoje?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
            >
              <div className="p-2 rounded-lg bg-accent">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Prompt Bar */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          Criar com IA
        </h2>
        <div className="flex items-center gap-3 p-2 rounded-xl border-2 border-border bg-background focus-within:border-violet-500 transition-colors">
          <input
            type="text"
            placeholder="Descreve o que queres criar... ex: 'Apresentação sobre marketing digital'"
            className="flex-1 px-3 py-2 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm"
          />
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
            <Sparkles className="w-4 h-4" />
            Criar
          </button>
        </div>
      </div>

      {/* Create Modules Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Criar novo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {createModules.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.label}
                href={mod.href}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{mod.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{mod.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Projetos recentes
          </h2>
          <Link href="/projects" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
            Ver todos
          </Link>
        </div>

        {/* Active Production Studios / Recent Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Pitch Deck Executivo Q4 — NEXORA AI',
              type: 'Apresentação 16:9 (12 Slides)',
              href: '/presentations/demo-pres',
              badge: 'PPTX / PDF',
              color: 'text-violet-600 bg-violet-500/10',
            },
            {
              title: 'Arquitetura de Sistemas de IA Generativa',
              type: 'E-book Longform (180 Páginas)',
              href: '/ebooks/demo-book',
              badge: 'PDF / EPUB 3.0 / DOCX',
              color: 'text-blue-600 bg-blue-500/10',
            },
            {
              title: 'Proposta Comercial Enterprise & SLA',
              type: 'Documento Corporativo A4',
              href: '/docs/demo-doc',
              badge: 'PDF / DOCX / MD',
              color: 'text-emerald-600 bg-emerald-500/10',
            },
            {
              title: 'Ecossistema Multi-Agente NEXORA 2.0',
              type: 'Mapa Mental & Arquitetura',
              href: '/mindmaps/demo-mindmap',
              badge: 'SVG Vetorial / MD',
              color: 'text-amber-600 bg-amber-500/10',
            },
            {
              title: 'Panorama Global de IA & Produtividade 2026',
              type: 'Infográfico Editorial (800×1200)',
              href: '/infographics/demo-infographic',
              badge: 'Poster SVG / PDF',
              color: 'text-rose-600 bg-rose-500/10',
            },
            {
              title: 'Landing Page SaaS Alta Conversão',
              type: 'Website Responsivo (9 Secções CRO)',
              href: '/websites/demo-website',
              badge: 'HTML5 / ZIP Bundle',
              color: 'text-cyan-600 bg-cyan-500/10',
            },
          ].map((proj) => (
            <Link
              key={proj.href}
              href={proj.href}
              className="group p-5 rounded-2xl border border-border bg-card hover:border-violet-400 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${proj.color} mb-3`}>
                  {proj.badge}
                </span>
                <h3 className="font-semibold text-foreground group-hover:text-violet-600 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{proj.type}</p>
              </div>
              <div className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                Abrir Editor de Produção →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* NEXORA Quantum Suite™ (Omni-Morph 1->6, Podcast Dual-Host, Living Lab, Co-Pilot, Embeds, Importer & Analytics) */}
      <NexoraQuantumSuite
        projectTitle="Arquitetura de Sistemas de IA Generativa Enterprise"
        projectSubtitle="Workspace Central Multimodal NEXORA AI 2.0"
        currentContent="# Workspace Central NEXORA AI 2.0"
      />
    </div>
  )
}
