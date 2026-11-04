import { Injectable } from '@nestjs/common';
import {
  CreateWebsiteDto,
  WebsiteArchetype,
  WebsiteThemeId,
} from '../dto/websites.dto';

export interface WebsiteDataSchema {
  archetype: WebsiteArchetype;
  theme: WebsiteThemeId;
  brandName: string;
  language: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogType: string;
    slug: string;
  };
  navbar: {
    links: Array<{ label: string; href: string }>;
    ctaText: string;
    ctaHref: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    highlightMetric: string;
  };
  metricsBanner: Array<{
    value: string;
    label: string;
  }>;
  featuresGrid: {
    heading: string;
    subheading: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      badge: string;
    }>;
  };
  showcaseSteps: {
    heading: string;
    steps: Array<{
      step: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
  pricingTable: {
    heading: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      description: string;
      highlighted: boolean;
      features: string[];
      ctaText: string;
    }>;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  ctaFooter: {
    headline: string;
    subheadline: string;
    buttonText: string;
    copyright: string;
  };
  updatedByAiAt?: string;
}

@Injectable()
export class WebsitesEngineService {
  getArchetypes(): Array<{
    id: WebsiteArchetype;
    name: string;
    description: string;
    sectionsCount: number;
  }> {
    return [
      {
        id: 'SAAS_LANDING',
        name: 'Landing Page SaaS & Produto IA',
        description:
          'Estrutura de alta conversão com Hero, Prova Social, Grid de Funcionalidades, Como Funciona, Preços e FAQ.',
        sectionsCount: 9,
      },
      {
        id: 'EXECUTIVE_PORTFOLIO',
        name: 'Portfólio Executivo & Consultoria',
        description:
          'Apresentação de autoridade profissional, casos de sucesso, especialidades, testemunhos e agendamento.',
        sectionsCount: 8,
      },
      {
        id: 'PRODUCT_LAUNCH',
        name: 'Lançamento Digital & E-book Funnel',
        description:
          'Página de captura e vendas para produtos digitais, livros, cursos executivos e webinars.',
        sectionsCount: 8,
      },
      {
        id: 'AGENCY_CORPORATE',
        name: 'Website Institucional & Agência B2B',
        description:
          'Presença digital corporativa com serviços, métricas de impacto, metodologia de entrega e contacto.',
        sectionsCount: 9,
      },
      {
        id: 'EVENT_CONFERENCE',
        name: 'Summit, Conferência & Evento Tech',
        description:
          'Página de evento com agenda, oradores principais, patrocinadores, bilhetes e FAQ.',
        sectionsCount: 8,
      },
    ];
  }

  getThemes(): Array<{
    id: WebsiteThemeId;
    name: string;
    bgPage: string;
    bgSection: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    isDark: boolean;
  }> {
    return [
      {
        id: 'MIDNIGHT_INDIGO',
        name: 'Midnight Indigo SaaS',
        bgPage: '#090D16',
        bgSection: '#0F172A',
        bgCard: '#1E293B',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        accentPrimary: '#6366F1',
        accentSecondary: '#06B6D4',
        isDark: true,
      },
      {
        id: 'CLEAN_MINIMAL',
        name: 'Clean Minimal Light',
        bgPage: '#FFFFFF',
        bgSection: '#F8FAFC',
        bgCard: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        accentPrimary: '#2563EB',
        accentSecondary: '#4F46E5',
        isDark: false,
      },
      {
        id: 'EMERALD_FINTECH',
        name: 'Emerald Fintech & Growth',
        bgPage: '#041F1A',
        bgSection: '#062C24',
        bgCard: '#0D3B31',
        textPrimary: '#ECFDF5',
        textSecondary: '#A7F3D0',
        accentPrimary: '#10B981',
        accentSecondary: '#34D399',
        isDark: true,
      },
      {
        id: 'CYBER_NEON',
        name: 'Cyber Violet & Magenta',
        bgPage: '#0D0714',
        bgSection: '#160D24',
        bgCard: '#221536',
        textPrimary: '#FAF5FF',
        textSecondary: '#D8B4FE',
        accentPrimary: '#A855F7',
        accentSecondary: '#EC4899',
        isDark: true,
      },
      {
        id: 'WARM_LUXURY',
        name: 'Warm Luxury Editorial',
        bgPage: '#12100E',
        bgSection: '#1C1917',
        bgCard: '#292524',
        textPrimary: '#FAFAF9',
        textSecondary: '#D6D3D1',
        accentPrimary: '#D97706',
        accentSecondary: '#F59E0B',
        isDark: true,
      },
    ];
  }

  generateWebsite(dto: CreateWebsiteDto): WebsiteDataSchema {
    const archetype: WebsiteArchetype = dto.archetype || 'SAAS_LANDING';
    const theme: WebsiteThemeId = dto.theme || 'MIDNIGHT_INDIGO';
    const brandName = dto.brandName || dto.title.split(' ')[0] || 'NEXORA';
    const topic = dto.prompt || dto.title;
    const ctaText = dto.primaryCtaText || 'Começar Agora Gratuitamente';
    const slug =
      dto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'nexora-site';

    return {
      archetype,
      theme,
      brandName,
      language: dto.language || 'pt',
      seo: {
        title: `${dto.title} | ${brandName} Official`,
        description: `Transforma ideias em resultados extraordinários com ${dto.title}. ${topic.slice(0, 120)}`,
        keywords: [
          brandName,
          'IA Generativa',
          'SaaS',
          'Produtividade',
          'Automação',
          archetype.toLowerCase(),
        ],
        ogType: 'website',
        slug,
      },
      navbar: {
        links: [
          { label: 'Funcionalidades', href: '#features' },
          { label: 'Como Funciona', href: '#workflow' },
          { label: 'Testemunhos', href: '#testimonials' },
          { label: 'Preços', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ],
        ctaText,
        ctaHref: '#pricing',
      },
      hero: {
        badge: `✨ ${brandName} AI 2.0 • Nova Geração`,
        headline: dto.title,
        subheadline: `A plataforma completa e inteligente para equipas que procuram velocidade, precisão editorial e design de alto impacto em ${topic}.`,
        primaryCta: ctaText,
        secondaryCta: 'Ver Demonstração Interativa',
        highlightMetric: 'Mais de 12.500 profissionais e empresas aceleram resultados todos os dias',
      },
      metricsBanner: [
        { value: '10x', label: 'Mais Velocidade de Produção' },
        { value: '99.9%', label: 'Uptime & Fiabilidade Enterprise' },
        { value: '-68%', label: 'Redução de Custos Operacionais' },
        { value: '4.9/5', label: 'Satisfação Média dos Clientes' },
      ],
      featuresGrid: {
        heading: 'Capacidades Desenhadas para Alta Performance',
        subheading:
          'Tudo o que precisas num único ecossistema integrado, seguro e pronto para escalar.',
        items: [
          {
            id: 'feat-1',
            title: 'Orquestração Inteligente com IA',
            description:
              'Geração estruturada com memória contextual, revisão automática de coerência e comandos em linguagem natural.',
            badge: 'AI Core',
          },
          {
            id: 'feat-2',
            title: 'Design System & Layouts Adaptativos',
            description:
              'Hierarquia tipográfica, paletas cromáticas harmoniosas e validação automática de contraste WCAG AAA.',
            badge: 'Design Engine',
          },
          {
            id: 'feat-3',
            title: 'Exportação Multi-Formato Oficial',
            description:
              'Exporta instantaneamente em PDF, DOCX, PPTX, EPUB, SVG Vetorial e pacotes HTML5 prontos para produção.',
            badge: 'Multi-Export',
          },
          {
            id: 'feat-4',
            title: 'Segurança & Governança Multi-Tenant',
            description:
              'Controlo de acessos baseado em papéis (RBAC), isolamento por organização e registos de auditoria.',
            badge: 'Enterprise Security',
          },
          {
            id: 'feat-5',
            title: 'Colaboração & Histórico Reversível',
            description:
              'Checkpoints automáticos, controlo de versões completo e restauro instantâneo a qualquer ponto.',
            badge: 'Versioning',
          },
          {
            id: 'feat-6',
            title: 'Escala Internacional Multilíngue',
            description:
              'Produção e tradução nativa em Português, Inglês, Espanhol e Francês com adaptação cultural.',
            badge: 'Global Ready',
          },
        ],
      },
      showcaseSteps: {
        heading: 'Da Ideia à Publicação em 3 Etapas Simples',
        steps: [
          {
            step: '01',
            title: 'Define o Objetivo ou Carrega a Tua Fonte',
            description:
              'Introduz um prompt detalhado, cola um documento ou seleciona um dos modelos estratégicos validados.',
          },
          {
            step: '02',
            title: 'Personaliza com o Assistente Visual de IA',
            description:
              'Ajusta secções, aplica novos temas com um clique e refina o conteúdo com instruções conversacionais.',
          },
          {
            step: '03',
            title: 'Publica na Web ou Exporta em Alta Resolução',
            description:
              'Partilha através de um URL público otimizado para SEO ou descarrega o pacote completo de código.',
          },
        ],
      },
      testimonials: [
        {
          quote:
            'Reduzimos o tempo de criação de apresentações executivas, propostas e landing pages de duas semanas para menos de 15 minutos.',
          author: 'Sofia Almeida',
          role: 'VP de Operações & Estratégia',
          company: 'Vanguard Tech Europe',
        },
        {
          quote:
            'A qualidade editorial e a consistência visual superaram qualquer ferramenta que já testámos. Tornou-se o padrão da nossa equipa.',
          author: 'Marc Dubois',
          role: 'Chief Product Officer',
          company: 'Lumina Digital Paris',
        },
        {
          quote:
            'O retorno sobre o investimento foi imediato no primeiro mês. A capacidade de exportar pacotes prontos para produção é imbatível.',
          author: 'Carlos Mendoza',
          role: 'Diretor de Transformação Digital',
          company: 'NovaScale Madrid',
        },
      ],
      pricingTable: {
        heading: 'Planos Transparentes para Cada Fase de Crescimento',
        plans: [
          {
            name: 'Starter',
            price: '€ 0',
            period: '/ mês',
            description: 'Ideal para explorar a plataforma e criar os primeiros projetos com IA.',
            highlighted: false,
            features: [
              '200 créditos de IA iniciais',
              'Acesso aos 6 estúdios criativos',
              'Exportação PDF e Markdown',
              'Suporte da comunidade',
            ],
            ctaText: 'Começar Grátis',
          },
          {
            name: 'Pro Studio',
            price: '€ 29',
            period: '/ mês',
            description: 'Para profissionais, criadores e equipas em crescimento acelerado.',
            highlighted: true,
            features: [
              '3.000 créditos de IA mensais',
              'E-books até 500+ páginas',
              'Exportação PPTX, DOCX, EPUB, SVG e HTML/ZIP',
              'Temas personalizados e sem marca de água',
            ],
            ctaText: 'Assinar Plano Pro',
          },
          {
            name: 'Enterprise',
            price: '€ 99',
            period: '/ mês',
            description: 'Governança avançada, múltiplos workspaces e SLA dedicado.',
            highlighted: false,
            features: [
              '15.000 créditos de IA partilhados',
              'Controlo RBAC Multi-tenant e Auditoria',
              'Identidade visual corporativa dedicada',
              'Gestor de conta e SLA 99.9%',
            ],
            ctaText: 'Falar com Vendas',
          },
        ],
      },
      faq: [
        {
          question: 'Posso exportar o código HTML/CSS completo do website?',
          answer:
            'Sim. O NEXORA WEB permite exportar tanto um ficheiro HTML5 autónomo como um pacote ZIP estruturado (HTML, CSS, JS e Manifesto) pronto para alojar em qualquer servidor.',
        },
        {
          question: 'Os websites gerados são responsivos para telemóvel e tablet?',
          answer:
            'Totalmente. Todos os layouts utilizam grelhas responsivas modernas que se adaptam automaticamente a ecrãs Desktop, Tablet e Smartphone.',
        },
        {
          question: 'Posso alterar o tema visual depois de o website estar criado?',
          answer:
            'Sim, podes alternar instantaneamente entre os 5 temas visuais ou pedir ao Assistente de IA para ajustar cores, textos e chamadas à ação.',
        },
        {
          question: 'O website inclui otimização para motores de busca (SEO)?',
          answer:
            'Sim. Cada página é gerada com meta tags de título, descrição, palavras-chave, OpenGraph e estrutura semântica HTML5.',
        },
      ],
      ctaFooter: {
        headline: `Pronto para Elevar o Padrão Digital com ${brandName}?`,
        subheadline:
          'Junta-te a milhares de líderes e criadores que transformam ideias em produtos digitais extraordinários.',
        buttonText: ctaText,
        copyright: `© ${new Date().getFullYear()} ${brandName} • Criado com NEXORA WEB AI 2.0. Todos os direitos reservados.`,
      },
    };
  }

  executeAiCommand(
    currentData: WebsiteDataSchema,
    command: string,
  ): {
    updatedData: WebsiteDataSchema;
    actionSummary: string;
  } {
    const cmd = command.toLowerCase();
    const cloned: WebsiteDataSchema = JSON.parse(JSON.stringify(currentData));

    if (cmd.includes('conversão') || cmd.includes('cro') || cmd.includes('copy')) {
      cloned.hero.badge = '🔥 Oferta Limitada • Garantia de Resultados em 30 Dias';
      cloned.hero.primaryCta = 'Garantir Acesso Imediato (Teste Grátis)';
      cloned.ctaFooter.buttonText = 'Começar Agora Sem Risco';
      return {
        updatedData: cloned,
        actionSummary:
          'Copywriting e botões de ação (CTAs) otimizados para máxima taxa de conversão (CRO).',
      };
    }

    if (cmd.includes('minimal') || cmd.includes('claro') || cmd.includes('light')) {
      cloned.theme = 'CLEAN_MINIMAL';
      return {
        updatedData: cloned,
        actionSummary: 'Tema visual alterado para Clean Minimal Light.',
      };
    }

    if (cmd.includes('inglês') || cmd.includes('ingles') || cmd.includes('english')) {
      cloned.language = 'en';
      cloned.hero.badge = `✨ ${cloned.brandName} AI 2.0 • Next-Gen Platform`;
      cloned.hero.primaryCta = 'Start Free Trial Now';
      cloned.hero.secondaryCta = 'Watch Interactive Demo';
      cloned.featuresGrid.heading = 'Enterprise-Grade Capabilities Built for Scale';
      cloned.ctaFooter.headline = `Ready to Transform Your Workflow with ${cloned.brandName}?`;
      return {
        updatedData: cloned,
        actionSummary: 'Secções principais da Landing Page traduzidas para Inglês (EN).',
      };
    }

    if (cmd.includes('faq') || cmd.includes('pergunta')) {
      cloned.faq.push({
        question: 'Como funciona a segurança e privacidade dos dados empresariais?',
        answer:
          'Todos os dados são encriptados em trânsito (TLS 1.3) e em repouso (AES-256), com isolamento estrito por organização e conformidade RGPD.',
      });
      return {
        updatedData: cloned,
        actionSummary: 'Nova pergunta estratégica adicionada à secção de FAQ.',
      };
    }

    // Default: add new feature card
    cloned.featuresGrid.items.push({
      id: `feat-ai-${Date.now()}`,
      title: `Módulo Especializado: ${command.slice(0, 28)}`,
      description:
        'Capacidade adicionada pelo Assistente NEXORA WEB IA para potenciar a proposta de valor da página.',
      badge: 'Novo IA',
    });
    cloned.updatedByAiAt = new Date().toISOString();

    return {
      updatedData: cloned,
      actionSummary: `Instrução "${command}" aplicada com sucesso à estrutura da página.`,
    };
  }

  exportToHtml(title: string, data: WebsiteDataSchema): string {
    const theme =
      this.getThemes().find((t) => t.id === data.theme) || this.getThemes()[0];

    const esc = (str: string) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const navLinksHtml = (data.navbar?.links || [])
      .map(
        (l) =>
          `<a href="${esc(l.href)}" class="text-sm font-medium opacity-80 hover:opacity-100 transition">${esc(l.label)}</a>`,
      )
      .join('\n          ');

    const metricsHtml = (data.metricsBanner || [])
      .map(
        (m) => `
        <div class="p-6 rounded-2xl text-center border border-white/10" style="background:${theme.bgCard}">
          <div class="text-3xl md:text-4xl font-extrabold mb-1" style="color:${theme.accentSecondary}">${esc(m.value)}</div>
          <div class="text-xs md:text-sm opacity-80">${esc(m.label)}</div>
        </div>`,
      )
      .join('\n');

    const featuresHtml = (data.featuresGrid?.items || [])
      .map(
        (f) => `
        <div class="p-6 rounded-2xl border border-white/10 transition hover:-translate-y-1" style="background:${theme.bgCard}">
          <span class="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3" style="background:${theme.accentPrimary}22; color:${theme.accentSecondary}">
            ${esc(f.badge)}
          </span>
          <h3 class="text-lg font-bold mb-2">${esc(f.title)}</h3>
          <p class="text-sm opacity-80 leading-relaxed">${esc(f.description)}</p>
        </div>`,
      )
      .join('\n');

    const stepsHtml = (data.showcaseSteps?.steps || [])
      .map(
        (s) => `
        <div class="p-6 rounded-2xl border border-white/10 relative" style="background:${theme.bgCard}">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white mb-4" style="background:${theme.accentPrimary}">
            ${esc(s.step)}
          </div>
          <h3 class="text-lg font-bold mb-2">${esc(s.title)}</h3>
          <p class="text-sm opacity-80 leading-relaxed">${esc(s.description)}</p>
        </div>`,
      )
      .join('\n');

    const testimonialsHtml = (data.testimonials || [])
      .map(
        (t) => `
        <div class="p-6 rounded-2xl border border-white/10 flex flex-col justify-between" style="background:${theme.bgCard}">
          <p class="text-sm italic opacity-90 mb-6 leading-relaxed">"${esc(t.quote)}"</p>
          <div>
            <div class="font-bold text-sm">${esc(t.author)}</div>
            <div class="text-xs opacity-70">${esc(t.role)} • ${esc(t.company)}</div>
          </div>
        </div>`,
      )
      .join('\n');

    const pricingHtml = (data.pricingTable?.plans || [])
      .map(
        (p) => `
        <div class="p-8 rounded-2xl border ${p.highlighted ? 'ring-2' : 'border-white/10'} flex flex-col justify-between" style="background:${theme.bgCard}; border-color:${p.highlighted ? theme.accentPrimary : 'rgba(255,255,255,0.1)'}">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-bold">${esc(p.name)}</h3>
              ${p.highlighted ? `<span class="text-xs font-bold px-2.5 py-1 rounded-full text-white" style="background:${theme.accentPrimary}">Mais Popular</span>` : ''}
            </div>
            <p class="text-xs opacity-75 mb-6">${esc(p.description)}</p>
            <div class="mb-6">
              <span class="text-4xl font-extrabold">${esc(p.price)}</span>
              <span class="text-sm opacity-70">${esc(p.period)}</span>
            </div>
            <ul class="space-y-2.5 text-sm mb-8">
              ${(p.features || []).map((feat) => `<li class="flex items-center gap-2"><span style="color:${theme.accentSecondary}">✓</span> ${esc(feat)}</li>`).join('\n              ')}
            </ul>
          </div>
          <a href="#contact" class="block w-full py-3 px-4 rounded-xl text-center font-semibold text-sm text-white transition hover:opacity-90" style="background:${p.highlighted ? theme.accentPrimary : '#334155'}">
            ${esc(p.ctaText)}
          </a>
        </div>`,
      )
      .join('\n');

    const faqHtml = (data.faq || [])
      .map(
        (item) => `
        <details class="group p-5 rounded-2xl border border-white/10 cursor-pointer" style="background:${theme.bgCard}">
          <summary class="font-semibold text-base flex items-center justify-between list-none">
            <span>${esc(item.question)}</span>
            <span class="text-lg transition group-open:rotate-45" style="color:${theme.accentSecondary}">+</span>
          </summary>
          <p class="text-sm opacity-80 mt-3 leading-relaxed">${esc(item.answer)}</p>
        </details>`,
      )
      .join('\n');

    return `<!DOCTYPE html>
<html lang="${esc(data.language || 'pt')}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(data.seo?.title || title)}</title>
  <meta name="description" content="${esc(data.seo?.description || '')}" />
  <meta name="keywords" content="${esc((data.seo?.keywords || []).join(', '))}" />
  <meta property="og:title" content="${esc(data.seo?.title || title)}" />
  <meta property="og:description" content="${esc(data.seo?.description || '')}" />
  <meta property="og:type" content="website" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: ${theme.bgPage};
      color: ${theme.textPrimary};
    }
  </style>
</head>
<body class="antialiased selection:bg-indigo-500 selection:text-white">
  <!-- Navbar -->
  <header class="sticky top-0 z-50 backdrop-blur-md border-b border-white/10" style="background:${theme.bgPage}CC">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white" style="background:${theme.accentPrimary}">
          ${esc((data.brandName || 'N').charAt(0).toUpperCase())}
        </div>
        <span class="font-extrabold text-lg tracking-tight">${esc(data.brandName || 'NEXORA')}</span>
      </div>
      <nav class="hidden md:flex items-center gap-8">
        ${navLinksHtml}
      </nav>
      <a href="${esc(data.navbar?.ctaHref || '#pricing')}" class="px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-lg transition hover:opacity-90" style="background:${theme.accentPrimary}">
        ${esc(data.navbar?.ctaText || 'Começar Agora')}
      </a>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="py-24 px-6 text-center relative overflow-hidden">
      <div class="max-w-4xl mx-auto space-y-6">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-white/10" style="background:${theme.bgCard}; color:${theme.accentSecondary}">
          ${esc(data.hero?.badge || 'NEXORA WEB AI')}
        </span>
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          ${esc(data.hero?.headline || title)}
        </h1>
        <p class="text-lg sm:text-xl max-w-2xl mx-auto opacity-80 leading-relaxed">
          ${esc(data.hero?.subheadline || '')}
        </p>
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#pricing" class="px-8 py-4 rounded-2xl font-bold text-base text-white shadow-xl transition hover:opacity-95" style="background:linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})">
            ${esc(data.hero?.primaryCta || 'Começar Agora')}
          </a>
          <a href="#features" class="px-8 py-4 rounded-2xl font-semibold text-base border border-white/15 hover:bg-white/5 transition">
            ${esc(data.hero?.secondaryCta || 'Explorar Recursos')}
          </a>
        </div>
        <p class="text-xs opacity-60 pt-4">${esc(data.hero?.highlightMetric || '')}</p>
      </div>
    </section>

    <!-- Metrics Banner -->
    <section class="py-10 px-6">
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        ${metricsHtml}
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-20 px-6" style="background:${theme.bgSection}">
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <h2 class="text-3xl font-extrabold">${esc(data.featuresGrid?.heading || 'Funcionalidades')}</h2>
          <p class="text-base opacity-80">${esc(data.featuresGrid?.subheading || '')}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${featuresHtml}
        </div>
      </div>
    </section>

    <!-- Workflow Steps -->
    <section id="workflow" class="py-20 px-6">
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-3xl font-extrabold">${esc(data.showcaseSteps?.heading || 'Como Funciona')}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${stepsHtml}
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-20 px-6" style="background:${theme.bgSection}">
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-3xl font-extrabold">O Que Dizem os Nossos Clientes</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${testimonialsHtml}
        </div>
      </div>
    </section>

    <!-- Pricing Table -->
    <section id="pricing" class="py-20 px-6">
      <div class="max-w-6xl mx-auto space-y-12">
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-3xl font-extrabold">${esc(data.pricingTable?.heading || 'Planos e Preços')}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${pricingHtml}
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-20 px-6" style="background:${theme.bgSection}">
      <div class="max-w-3xl mx-auto space-y-8">
        <h2 class="text-3xl font-extrabold text-center">Perguntas Frequentes (FAQ)</h2>
        <div class="space-y-4">
          ${faqHtml}
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section id="contact" class="py-24 px-6 text-center">
      <div class="max-w-4xl mx-auto p-12 rounded-3xl border border-white/15 space-y-6" style="background:linear-gradient(135deg, ${theme.bgCard}, ${theme.bgSection})">
        <h2 class="text-3xl sm:text-4xl font-extrabold">${esc(data.ctaFooter?.headline || '')}</h2>
        <p class="text-base opacity-80 max-w-xl mx-auto">${esc(data.ctaFooter?.subheadline || '')}</p>
        <div>
          <a href="#pricing" class="inline-block px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition hover:opacity-90" style="background:${theme.accentPrimary}">
            ${esc(data.ctaFooter?.buttonText || 'Começar Agora')}
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="py-10 px-6 border-t border-white/10 text-center text-xs opacity-60">
    ${esc(data.ctaFooter?.copyright || '')}
  </footer>
</body>
</html>`;
  }

  async exportToZip(title: string, data: WebsiteDataSchema): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const JSZip = require('jszip');
    const zip = new JSZip();

    const htmlContent = this.exportToHtml(title, data);
    zip.file('index.html', htmlContent);

    zip.file(
      'assets/css/custom.css',
      `/* NEXORA WEB AI 2.0 Custom Stylesheet */\n:root {\n  --brand-name: "${data.brandName}";\n}\n`,
    );

    zip.file(
      'assets/js/main.js',
      `// NEXORA WEB AI 2.0 Interactive Bundle\nconsole.log("NEXORA Website Ready:", ${JSON.stringify(title)});\n`,
    );

    zip.file(
      'manifest.json',
      JSON.stringify(
        {
          name: title,
          short_name: data.brandName || 'NEXORA',
          start_url: '/index.html',
          display: 'standalone',
          generator: 'NEXORA WEB AI 2.0',
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    zip.file(
      'README.md',
      `# ${title}\n\nPacote estático gerado pelo motor **NEXORA WEB AI 2.0**.\n\n## Como publicar\n1. Faz upload do conteúdo deste pacote para Vercel, Netlify, Cloudflare Pages ou AWS S3.\n2. O ficheiro principal é \`index.html\`.\n`,
    );

    return await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
  }
}
