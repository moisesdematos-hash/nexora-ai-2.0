'use client'

import React, { useState } from 'react'
import {
  Globe,
  Palette,
  Shield,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { SUPPORTED_LOCALES, t, SupportedLocale } from '@/lib/i18n'

export default function SettingsPage() {
  const [locale, setLocale] = useState<SupportedLocale>('pt')
  const [orgName, setOrgName] = useState('NEXORA Enterprise Studio')
  const [brandPrimary, setBrandPrimary] = useState('#6366F1')
  const [brandSecondary, setBrandSecondary] = useState('#06B6D4')
  const [brandFont, setBrandFont] = useState('Inter & Plus Jakarta Sans')
  const [savedNotice, setSavedNotice] = useState<string | null>(null)

  const handleSave = () => {
    setSavedNotice(
      `Preferências de idioma (${locale.toUpperCase()}), identidade visual e segurança multi-tenant guardadas com sucesso.`,
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            NEXORA Global I18n (PT/EN/ES/FR), Brand Kit & RBAC Governance
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t(locale, 'settingsTitle')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configura o idioma nativo da plataforma, a identidade visual da tua organização e as permissões de acesso (RBAC).
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 shadow-md"
        >
          Guardar Alterações
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {savedNotice}
          </span>
          <button onClick={() => setSavedNotice(null)} className="underline">
            Fechar
          </button>
        </div>
      )}

      {/* 1. Multilingual Internationalization (PT, EN, ES, FR) */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-foreground">
            1. Idioma da Plataforma & Geração Multilíngue (I18n)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {SUPPORTED_LOCALES.map((loc) => {
            const active = locale === loc.code
            return (
              <button
                key={loc.code}
                type="button"
                onClick={() => setLocale(loc.code)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  active
                    ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                    : 'border-border bg-background hover:border-indigo-500/40'
                }`}
              >
                <div className="text-2xl mb-1">{loc.flag}</div>
                <div className="font-bold text-sm text-foreground">
                  {loc.nativeName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {loc.name} ({loc.code.toUpperCase()})
                </div>
              </button>
            )
          })}
        </div>

        {/* Live I18n Dictionary Preview */}
        <div className="p-4 rounded-xl bg-background border border-border space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Pré-visualização em Tempo Real ({locale.toUpperCase()}):
          </div>
          <div className="text-sm font-bold text-foreground">
            {t(locale, 'studioTitle')}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'createPresentation',
              'createEbook',
              'createDocument',
              'createMindMap',
              'createInfographic',
              'createWebsite',
            ].map((k) => (
              <span
                key={k}
                className="px-3 py-1 rounded-lg bg-card border border-border text-xs font-medium text-foreground"
              >
                {t(locale, k)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Corporate Brand Kit */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-foreground">
            2. Identidade Visual Empresarial (Brand Kit)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Nome da Organização
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Cor Primária da Marca
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandPrimary}
                onChange={(e) => setBrandPrimary(e.target.value)}
                className="w-9 h-9 rounded-lg border border-border bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={brandPrimary}
                onChange={(e) => setBrandPrimary(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Cor Secundária / Destaque
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandSecondary}
                onChange={(e) => setBrandSecondary(e.target.value)}
                className="w-9 h-9 rounded-lg border border-border bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={brandSecondary}
                onChange={(e) => setBrandSecondary(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-muted-foreground mb-1">
              Par Tipográfico Padrão (Apresentações, E-books e Documentos)
            </label>
            <select
              value={brandFont}
              onChange={(e) => setBrandFont(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground"
            >
              <option value="Inter & Plus Jakarta Sans">
                Inter & Plus Jakarta Sans (Tech & SaaS)
              </option>
              <option value="Merriweather & Source Sans Pro">
                Merriweather & Source Sans Pro (Editorial & Livros)
              </option>
              <option value="Montserrat & Open Sans">
                Montserrat & Open Sans (Executivo & Corporativo)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Multi-Tenant RBAC Roles */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-foreground">
              3. Governança Multi-Tenant & Controlo de Acessos (RBAC)
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
            <Shield className="w-3.5 h-3.5" /> Isolamento Ativo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            {
              role: 'OWNER',
              desc: 'Controlo total da organização, faturação Stripe, planos e eliminação.',
            },
            {
              role: 'ADMIN',
              desc: 'Gestão de membros, pastas, temas corporativos e consumo de créditos.',
            },
            {
              role: 'EDITOR',
              desc: 'Criação, edição e exportação nos 6 estúdios criativos NEXORA.',
            },
            {
              role: 'VIEWER',
              desc: 'Visualização, leitura e apresentação sem permissão de alteração.',
            },
          ].map((r) => (
            <div
              key={r.role}
              className="p-3.5 rounded-xl border border-border bg-background space-y-1"
            >
              <div className="font-bold text-indigo-400">{r.role}</div>
              <p className="text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
