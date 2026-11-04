'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui.store'
import {
  LayoutDashboard,
  Presentation,
  BookOpen,
  FileText,
  Brain,
  BarChart3,
  Globe,
  FolderOpen,
  Settings,
  CreditCard,
  ChevronLeft,
  Sparkles,
  ShieldAlert,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projetos', href: '/projects', icon: FolderOpen },
  { name: 'Presentations', href: '/presentations', icon: Presentation },
  { name: 'Ebook Studio', href: '/ebooks', icon: BookOpen },
  { name: 'Documents', href: '/docs', icon: FileText },
  { name: 'Mind Maps', href: '/mindmaps', icon: Brain },
  { name: 'Infographics', href: '/infographics', icon: BarChart3 },
  { name: 'Nexora Web', href: '/websites', icon: Globe },
  { name: 'Templates', href: '/templates', icon: Sparkles },
]

const bottomItems = [
  { name: 'Super-Admin', href: '/admin', icon: ShieldAlert },
  { name: 'Planos & Créditos', href: '/credits', icon: CreditCard },
  { name: 'Definições', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 border-r border-border bg-card transition-all duration-300 shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!sidebarCollapsed && (
          <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            NEXORA AI
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors',
            sidebarCollapsed && 'mx-auto'
          )}
          aria-label={sidebarCollapsed ? 'Expandir menu' : 'Colapsar menu'}
        >
          <ChevronLeft
            className={cn('w-4 h-4 transition-transform', sidebarCollapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* Create Button */}
      <div className="p-3">
        <Link
          href="/dashboard?create=true"
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg',
            'bg-gradient-to-r from-violet-600 to-blue-600 text-white',
            'hover:from-violet-700 hover:to-blue-700 transition-all',
            'text-sm font-semibold shadow-md',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Criar novo</span>}
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto" aria-label="Navegação principal">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 py-3 space-y-0.5 border-t border-border">
        {bottomItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
