'use client'

import React, { useState } from 'react'
import {
  Zap,
  Check,
  CreditCard,
  ArrowUpRight,
  History,
  Calculator,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

const PLANS = [
  {
    tier: 'FREE',
    name: 'Free Starter',
    priceMonthly: 0,
    priceYearly: 0,
    credits: 200,
    maxPages: 20,
    desc: 'Para explorar os 6 estúdios criativos e validar fluxos.',
    features: [
      '200 créditos de IA mensais',
      'Acesso aos 6 módulos NEXORA',
      'E-books até 20 páginas',
      'Exportação PDF e Markdown',
    ],
    highlighted: false,
  },
  {
    tier: 'STARTER',
    name: 'Creator Starter',
    priceMonthly: 15,
    priceYearly: 144,
    credits: 1000,
    maxPages: 100,
    desc: 'Para profissionais independentes e criadores.',
    features: [
      '1.000 créditos de IA mensais',
      'E-books até 100 páginas',
      'Exportação PDF, DOCX e PPTX',
      'Sem marca de água NEXORA',
    ],
    highlighted: false,
  },
  {
    tier: 'PRO',
    name: 'Pro Studio',
    priceMonthly: 39,
    priceYearly: 372,
    credits: 3500,
    maxPages: 500,
    desc: 'Produção editorial e visual intensiva sem limites de formato.',
    features: [
      '3.500 créditos de IA mensais',
      'E-books longos até 500 páginas',
      'Todos os formatos: PDF, DOCX, PPTX, EPUB 3.0, SVG, HTML/ZIP',
      'Temas visuais personalizados e capas HD',
      'Histórico ilimitado de versões',
    ],
    highlighted: true,
  },
  {
    tier: 'ENTERPRISE',
    name: 'Enterprise Cloud',
    priceMonthly: 129,
    priceYearly: 1240,
    credits: 15000,
    maxPages: 1000,
    desc: 'Governança multi-tenant, RBAC, auditoria e obras até 1.000 págs.',
    features: [
      '15.000 créditos de IA partilhados',
      'E-books até 1.000 páginas em fila',
      'Controlo RBAC (Owner, Admin, Editor, Viewer)',
      'Logs de auditoria imutáveis',
      'SLA 99.9% e Suporte 24/7',
    ],
    highlighted: false,
  },
]

const CREDIT_PACKS = [
  { id: 'PACK_500', name: 'Boost 500', credits: 500, price: 9 },
  { id: 'PACK_2000', name: 'Studio 2.000', credits: 2000, price: 29, badge: '+15% Económico' },
  { id: 'PACK_5000', name: 'Editorial 5.000', credits: 5000, price: 59, badge: 'Mais Vendido' },
  { id: 'PACK_15000', name: 'Enterprise 15.000', credits: 15000, price: 149, badge: '-35% Custo/Créd' },
]

const COST_TABLE = [
  { module: 'NEXORA PRESENTATIONS', op: 'Apresentação 10–15 Slides (16:9)', cost: 25 },
  { module: 'NEXORA EBOOK STUDIO', op: 'E-book Completo (10 Páginas)', cost: 30 },
  { module: 'NEXORA EBOOK STUDIO', op: 'E-book Completo (50 Páginas)', cost: 110 },
  { module: 'NEXORA EBOOK STUDIO', op: 'E-book Completo (100 Páginas)', cost: 200 },
  { module: 'NEXORA EBOOK STUDIO', op: 'E-book Longo (200 Páginas)', cost: 360 },
  { module: 'NEXORA EBOOK STUDIO', op: 'Obra Editorial (500 Páginas)', cost: 800 },
  { module: 'NEXORA DOCS', op: 'Relatório Executivo / Proposta / SOP', cost: 15 },
  { module: 'NEXORA MIND MAPS', op: 'Mapa Mental / Fluxograma Vetorial', cost: 12 },
  { module: 'NEXORA INFOGRAPHICS', op: 'Poster Infográfico 800×1200', cost: 18 },
  { module: 'NEXORA WEB', op: 'Landing Page / Website (9 Secções)', cost: 30 },
  { module: 'TODOS OS ESTÚDIOS', op: 'Comando Contextual IA / Tradução', cost: 4 },
]

export default function CreditsAndBillingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')
  const [currentTier, setCurrentTier] = useState('PRO')
  const [creditsBalance, setCreditsBalance] = useState(3420)
  const [creditsTotal, setCreditsTotal] = useState(3500)
  const [ebookSimPages, setEbookSimPages] = useState(120)
  const [statusBanner, setStatusBanner] = useState<string | null>(null)

  const [transactions, setTransactions] = useState([
    {
      id: 'tx-104',
      type: 'USAGE',
      desc: 'Geração de Landing Page SaaS (NEXORA WEB)',
      amount: -30,
      balanceAfter: 3420,
      date: '2026-11-04 09:30',
    },
    {
      id: 'tx-103',
      type: 'USAGE',
      desc: 'Poster Infográfico 800×1200 (NEXORA INFOGRAPHICS)',
      amount: -18,
      balanceAfter: 3450,
      date: '2026-11-04 09:12',
    },
    {
      id: 'tx-102',
      type: 'USAGE',
      desc: 'Apresentação Executiva 12 Slides (NEXORA PRESENTATIONS)',
      amount: -25,
      balanceAfter: 3468,
      date: '2026-11-04 08:45',
    },
    {
      id: 'tx-101',
      type: 'PURCHASE',
      desc: 'Renovação Subscrição Pro Studio (+3.500 créditos)',
      amount: 3500,
      balanceAfter: 3493,
      date: '2026-11-01 00:01',
    },
  ])

  const handleUpgradePlan = (tier: string, name: string, credits: number) => {
    setCurrentTier(tier)
    setCreditsBalance((prev) => prev + credits)
    setCreditsTotal((prev) => prev + credits)
    const newBalance = creditsBalance + credits
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'PURCHASE',
        desc: `Upgrade Stripe Checkout: Plano ${name} (${billingCycle})`,
        amount: credits,
        balanceAfter: newBalance,
        date: 'Agora mesmo',
      },
      ...prev,
    ])
    setStatusBanner(
      `Subscrição atualizada para ${name} (${billingCycle === 'YEARLY' ? 'Anual -20%' : 'Mensal'})! +${credits} créditos adicionados ao saldo.`,
    )
  }

  const handleBuyPack = (pack: (typeof CREDIT_PACKS)[0]) => {
    const newBalance = creditsBalance + pack.credits
    setCreditsBalance(newBalance)
    setCreditsTotal((prev) => prev + pack.credits)
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'PURCHASE',
        desc: `Compra Avulsa: ${pack.name} (€${pack.price})`,
        amount: pack.credits,
        balanceAfter: newBalance,
        date: 'Agora mesmo',
      },
      ...prev,
    ])
    setStatusBanner(
      `Pacote ${pack.name} adquirido com sucesso! Novo saldo: ${newBalance.toLocaleString()} créditos.`,
    )
  }

  const estimatedSimCredits = Math.ceil(ebookSimPages * 1.75)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            NEXORA Monetization, Stripe Billing & AI Credit Ledger
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Planos, Subscrições & Créditos de IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gere a tua subscrição SaaS, adquire pacotes de créditos sob demanda e acompanha o livro-razão de consumo em tempo real.
          </p>
        </div>

        {/* Active Balance Card */}
        <div className="p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 to-slate-900 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-indigo-300 font-medium">
              Saldo Disponível (Plano {currentTier})
            </div>
            <div className="text-2xl font-extrabold text-white">
              {creditsBalance.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">
                / {creditsTotal.toLocaleString()} créditos
              </span>
            </div>
          </div>
        </div>
      </div>

      {statusBanner && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusBanner}
          </span>
          <button onClick={() => setStatusBanner(null)} className="underline">
            Fechar
          </button>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-bold text-foreground">
          1. Planos de Subscrição NEXORA AI 2.0
        </h2>
        <div className="inline-flex items-center p-1 rounded-xl bg-muted border border-border">
          <button
            type="button"
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === 'MONTHLY'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Faturação Mensal
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === 'YEARLY'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Faturação Anual
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* 4 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier
          const price =
            billingCycle === 'YEARLY'
              ? Math.round(plan.priceYearly / 12)
              : plan.priceMonthly
          return (
            <div
              key={plan.tier}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                plan.highlighted
                  ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/20'
                  : 'border-border bg-card'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-foreground">
                    {plan.name}
                  </span>
                  {plan.highlighted && (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-5 min-h-[34px]">
                  {plan.desc}
                </p>
                <div className="mb-5">
                  <span className="text-3xl font-extrabold text-foreground">
                    € {price}
                  </span>
                  <span className="text-xs text-muted-foreground"> / mês</span>
                  {billingCycle === 'YEARLY' && plan.priceYearly > 0 && (
                    <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                      Faturado € {plan.priceYearly}/ano
                    </div>
                  )}
                </div>
                <ul className="space-y-2.5 text-xs text-foreground mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleUpgradePlan(plan.tier, plan.name, plan.credits)
                }
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isCurrent
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md'
                      : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                {isCurrent ? (
                  <>Plano Ativo (+Renovar)</>
                ) : (
                  <>
                    Subscrever {plan.name}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* On-Demand Credit Packs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-foreground">
            2. Pacotes Avulsos de Créditos IA (Top-Up Instantâneo)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-foreground">
                    {pack.name}
                  </span>
                  {pack.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                      {pack.badge}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-extrabold text-indigo-400">
                  +{pack.credits.toLocaleString()} créditos
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleBuyPack(pack)}
                className="w-full py-2 px-4 rounded-xl bg-background border border-border hover:border-indigo-500 text-xs font-bold text-foreground transition-all"
              >
                Comprar por € {pack.price}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Simulator & Table + Transaction Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Credit Cost Calculator & Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-foreground">
              Simulador & Tabela Oficial de Custos em Créditos
            </h3>
          </div>

          {/* Interactive E-book Slider */}
          <div className="p-4 rounded-xl bg-background border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                Simulador NEXORA EBOOK STUDIO: {ebookSimPages} páginas
              </span>
              <span className="font-bold text-indigo-400">
                Custo estimado: {estimatedSimCredits} créditos IA
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={ebookSimPages}
              onChange={(e) => setEbookSimPages(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>10 págs (30 créd.)</span>
              <span>100 págs (175 créd.)</span>
              <span>500 págs (875 créd.)</span>
              <span>1.000 págs (1.750 créd.)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 font-semibold">Módulo</th>
                  <th className="py-2 font-semibold">Operação IA</th>
                  <th className="py-2 font-semibold text-right">Custo</th>
                </tr>
              </thead>
              <tbody>
                {COST_TABLE.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-2 font-semibold text-indigo-400">
                      {row.module}
                    </td>
                    <td className="py-2 text-foreground">{row.op}</td>
                    <td className="py-2 text-right font-bold text-foreground">
                      {row.cost} créd.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Ledger (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-foreground">
                Livro-Razão de Transações (Ledger)
              </h3>
            </div>
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="space-y-2.5">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl border border-border bg-background flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{tx.desc}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {tx.date} • Saldo após: {tx.balanceAfter.toLocaleString()} créd.
                  </div>
                </div>
                <span
                  className={`font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                    tx.amount > 0
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-rose-500/15 text-rose-400'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
