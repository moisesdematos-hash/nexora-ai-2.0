import { Injectable, BadRequestException } from '@nestjs/common';
import {
  PlanTierType,
  CreditPackId,
  AiOperationKey,
  BillingCycleType,
} from '../dto/billing.dto';

export interface PlanCatalogItem {
  tier: PlanTierType;
  name: string;
  description: string;
  priceMonthlyEur: number;
  priceYearlyEur: number;
  monthlyCredits: number;
  maxEbookPages: number;
  features: string[];
  highlighted: boolean;
}

export interface CreditPackItem {
  id: CreditPackId;
  name: string;
  credits: number;
  priceEur: number;
  bonusLabel?: string;
}

@Injectable()
export class BillingEngineService {
  getPlansCatalog(): PlanCatalogItem[] {
    return [
      {
        tier: 'FREE',
        name: 'Free Starter',
        description:
          'Para testar os 6 estúdios criativos e produzir os primeiros documentos e apresentações.',
        priceMonthlyEur: 0,
        priceYearlyEur: 0,
        monthlyCredits: 200,
        maxEbookPages: 20,
        highlighted: false,
        features: [
          '200 créditos de IA mensais',
          'Acesso aos 6 módulos NEXORA',
          'E-books até 20 páginas',
          'Exportação PDF e Markdown',
        ],
      },
      {
        tier: 'STARTER',
        name: 'Creator Starter',
        description:
          'Ideal para profissionais independentes, consultores e criadores de conteúdo digital.',
        priceMonthlyEur: 15,
        priceYearlyEur: 144,
        monthlyCredits: 1000,
        maxEbookPages: 100,
        highlighted: false,
        features: [
          '1.000 créditos de IA mensais',
          'E-books até 100 páginas',
          'Exportação PDF, DOCX e PPTX',
          'Sem marca de água NEXORA',
        ],
      },
      {
        tier: 'PRO',
        name: 'Pro Studio',
        description:
          'Produção editorial e visual intensiva com todos os formatos e motores desbloqueados.',
        priceMonthlyEur: 39,
        priceYearlyEur: 372,
        monthlyCredits: 3500,
        maxEbookPages: 500,
        highlighted: true,
        features: [
          '3.500 créditos de IA mensais',
          'E-books longos até 500 páginas',
          'Exportação completa: PDF, DOCX, PPTX, EPUB 3.0, SVG e HTML5/ZIP',
          'Temas visuais personalizados e capas de alta resolução',
          'Histórico ilimitado de versões reversíveis',
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Enterprise Cloud',
        description:
          'Governança multi-tenant, RBAC, auditoria completa e capacidade para obras de 1.000 páginas.',
        priceMonthlyEur: 129,
        priceYearlyEur: 1240,
        monthlyCredits: 15000,
        maxEbookPages: 1000,
        highlighted: false,
        features: [
          '15.000 créditos de IA partilhados na organização',
          'E-books extensos até 1.000 páginas com processamento em fila',
          'Controlo RBAC (Owner, Admin, Editor, Viewer)',
          'Registos de auditoria imutáveis (AuditLog)',
          'SLA contratual de 99,9% e suporte prioritário 24/7',
        ],
      },
    ];
  }

  getCreditPacks(): CreditPackItem[] {
    return [
      {
        id: 'PACK_500',
        name: 'Pacote Boost 500',
        credits: 500,
        priceEur: 9,
      },
      {
        id: 'PACK_2000',
        name: 'Pacote Studio 2.000',
        credits: 2000,
        priceEur: 29,
        bonusLabel: '+15% Económico',
      },
      {
        id: 'PACK_5000',
        name: 'Pacote Editorial 5.000',
        credits: 5000,
        priceEur: 59,
        bonusLabel: 'Mais Vendido',
      },
      {
        id: 'PACK_15000',
        name: 'Pacote Enterprise 15.000',
        credits: 15000,
        priceEur: 149,
        bonusLabel: 'Melhor Valor (-35%)',
      },
    ];
  }

  getCreditCostsTable(): Record<
    AiOperationKey,
    { credits: number; label: string; module: string }
  > {
    return {
      PRESENTATION_GENERATE: {
        credits: 25,
        label: 'Geração Completa de Apresentação (10–15 slides)',
        module: 'NEXORA PRESENTATIONS',
      },
      EBOOK_10_PAGES: {
        credits: 30,
        label: 'Produção Editorial de E-book (10 páginas)',
        module: 'NEXORA EBOOK STUDIO',
      },
      EBOOK_50_PAGES: {
        credits: 110,
        label: 'Produção Editorial de E-book (50 páginas)',
        module: 'NEXORA EBOOK STUDIO',
      },
      EBOOK_100_PAGES: {
        credits: 200,
        label: 'Produção Editorial de E-book (100 páginas)',
        module: 'NEXORA EBOOK STUDIO',
      },
      EBOOK_200_PAGES: {
        credits: 360,
        label: 'Produção Editorial de E-book (200 páginas)',
        module: 'NEXORA EBOOK STUDIO',
      },
      EBOOK_500_PAGES: {
        credits: 800,
        label: 'Obra Longa Completa (500 páginas)',
        module: 'NEXORA EBOOK STUDIO',
      },
      DOCUMENT_GENERATE: {
        credits: 15,
        label: 'Relatório Executivo / Proposta / Manual Técnico',
        module: 'NEXORA DOCS',
      },
      MINDMAP_GENERATE: {
        credits: 12,
        label: 'Mapa Mental / Fluxograma / Arquitetura',
        module: 'NEXORA MIND MAPS',
      },
      INFOGRAPHIC_GENERATE: {
        credits: 18,
        label: 'Poster Infográfico Vertical 800×1200',
        module: 'NEXORA INFOGRAPHICS',
      },
      WEBSITE_GENERATE: {
        credits: 30,
        label: 'Landing Page / Website Responsivo (9 secções)',
        module: 'NEXORA WEB',
      },
      AI_REWRITE_COMMAND: {
        credits: 4,
        label: 'Comando Contextual de Assistente IA / Tradução',
        module: 'ALL STUDIOS',
      },
      AI_IMAGE_GENERATE: {
        credits: 8,
        label: 'Geração de Capa Editorial / Ilustração Vetorial',
        module: 'DESIGN ENGINE',
      },
    };
  }

  estimateEbookCreditCost(targetPages: number): {
    targetPages: number;
    estimatedCredits: number;
    recommendedTier: PlanTierType;
  } {
    const pages = Math.max(10, Math.min(targetPages || 10, 1000));
    const estimatedCredits = Math.ceil(pages * 1.75);
    let recommendedTier: PlanTierType = 'FREE';
    if (pages > 500) recommendedTier = 'ENTERPRISE';
    else if (pages > 100) recommendedTier = 'PRO';
    else if (pages > 20) recommendedTier = 'STARTER';

    return {
      targetPages: pages,
      estimatedCredits,
      recommendedTier,
    };
  }

  calculateLedgerDeduction(
    currentBalance: number,
    operation: AiOperationKey,
    customAmount?: number,
  ): {
    cost: number;
    balanceBefore: number;
    balanceAfter: number;
    operationLabel: string;
  } {
    const costs = this.getCreditCostsTable();
    const spec = costs[operation];
    if (!spec && !customAmount) {
      throw new BadRequestException(`Operação de IA desconhecida: ${operation}`);
    }

    const cost = customAmount ?? spec.credits;
    if (currentBalance < cost) {
      throw new BadRequestException(
        `Saldo de créditos insuficiente (${currentBalance} disponíveis, ${cost} necessários para "${spec?.label || operation}").`,
      );
    }

    return {
      cost,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance - cost,
      operationLabel: spec?.label || operation,
    };
  }

  createStripeCheckoutUrl(
    organizationId: string,
    planTier: PlanTierType,
    billingCycle: BillingCycleType = 'MONTHLY',
  ): {
    sessionId: string;
    checkoutUrl: string;
    plan: PlanCatalogItem;
    amountEur: number;
    billingCycle: BillingCycleType;
  } {
    const plan =
      this.getPlansCatalog().find((p) => p.tier === planTier) ||
      this.getPlansCatalog()[2];
    const amountEur =
      billingCycle === 'YEARLY' ? plan.priceYearlyEur : plan.priceMonthlyEur;
    const sessionId = `cs_live_nexora_${planTier.toLowerCase()}_${Date.now()}`;

    return {
      sessionId,
      checkoutUrl: `https://checkout.stripe.com/c/pay/${sessionId}?org=${encodeURIComponent(organizationId)}&plan=${planTier}&cycle=${billingCycle}`,
      plan,
      amountEur,
      billingCycle,
    };
  }

  getSupportedLocales(): Array<{
    code: 'pt' | 'en' | 'es' | 'fr';
    name: string;
    nativeName: string;
    flag: string;
    dictionary: Record<string, string>;
  }> {
    return [
      {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        flag: '🇵🇹',
        dictionary: {
          welcome: 'Bem-vindo ao Estúdio Criativo NEXORA AI 2.0',
          createPresentation: 'Criar apresentação',
          createEbook: 'Criar e-book',
          createDocument: 'Criar documento',
          createMindMap: 'Criar mapa mental',
          createInfographic: 'Criar infográfico',
          createWebsite: 'Criar website',
          availableCredits: 'Créditos disponíveis',
          upgradePlan: 'Atualizar Plano',
        },
      },
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        dictionary: {
          welcome: 'Welcome to NEXORA AI 2.0 Creative Studio',
          createPresentation: 'Create presentation',
          createEbook: 'Create e-book',
          createDocument: 'Create document',
          createMindMap: 'Create mind map',
          createInfographic: 'Create infographic',
          createWebsite: 'Create website',
          availableCredits: 'Available credits',
          upgradePlan: 'Upgrade Plan',
        },
      },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        dictionary: {
          welcome: 'Bienvenido al Estudio Creativo NEXORA AI 2.0',
          createPresentation: 'Crear presentación',
          createEbook: 'Crear e-book',
          createDocument: 'Crear documento',
          createMindMap: 'Crear mapa mental',
          createInfographic: 'Crear infografía',
          createWebsite: 'Crear sitio web',
          availableCredits: 'Créditos disponibles',
          upgradePlan: 'Mejorar Plan',
        },
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        dictionary: {
          welcome: 'Bienvenue dans le Studio Créatif NEXORA AI 2.0',
          createPresentation: 'Créer une présentation',
          createEbook: 'Créer un e-book',
          createDocument: 'Créer un document',
          createMindMap: 'Créer une carte mentale',
          createInfographic: 'Créer une infographie',
          createWebsite: 'Créer un site web',
          availableCredits: 'Crédits disponibles',
          upgradePlan: 'Améliorer le forfait',
        },
      },
    ];
  }
}
