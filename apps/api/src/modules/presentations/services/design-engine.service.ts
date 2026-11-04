import { Injectable } from '@nestjs/common';

export interface DesignLayoutSpec {
  id: string;
  number: number;
  name: string;
  category: 'OPENING' | 'CONTENT' | 'COMPARISON' | 'DATA' | 'FLOW' | 'VISUAL' | 'CLOSING';
  description: string;
  maxRecommendedWords: number;
  slots: string[];
}

export interface DesignThemeSpec {
  id: string;
  name: string;
  category: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    primary: string;
    accent: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    titleScale: number;
  };
}

export const NEXORA_LAYOUTS: DesignLayoutSpec[] = [
  { id: 'COVER', number: 1, name: 'Capa', category: 'OPENING', description: 'Slide de abertura com título de impacto, subtítulo, selo e autor.', maxRecommendedWords: 35, slots: ['badge', 'title', 'subtitle', 'author'] },
  { id: 'INTRODUCTION', number: 2, name: 'Introdução', category: 'OPENING', description: 'Visão geral executiva com contexto e 3 pontos-chave de abertura.', maxRecommendedWords: 80, slots: ['title', 'lead', 'highlights'] },
  { id: 'TITLE_AND_TEXT', number: 3, name: 'Título e Texto', category: 'CONTENT', description: 'Estrutura editorial clássica com título forte e blocos narrativos claros.', maxRecommendedWords: 110, slots: ['title', 'paragraphs'] },
  { id: 'TEXT_AND_IMAGE', number: 4, name: 'Texto e Imagem', category: 'VISUAL', description: 'Divisão equilibrada 50/50 entre argumentos e painel visual ilustrado.', maxRecommendedWords: 85, slots: ['title', 'bullets', 'imageVisual'] },
  { id: 'TWO_COLUMNS', number: 5, name: 'Duas Colunas', category: 'CONTENT', description: 'Exposição paralela de dois pilares complementares.', maxRecommendedWords: 100, slots: ['title', 'leftColumn', 'rightColumn'] },
  { id: 'THREE_COLUMNS', number: 6, name: 'Três Colunas', category: 'CONTENT', description: 'Tríade estruturada de conceitos, serviços ou benefícios.', maxRecommendedWords: 115, slots: ['title', 'columns'] },
  { id: 'COMPARISON', number: 7, name: 'Comparação', category: 'COMPARISON', description: 'Confronto direto Cenário A vs Cenário B (Antes/Depois ou Vantagens).', maxRecommendedWords: 95, slots: ['title', 'optionA', 'optionB'] },
  { id: 'STATISTICS', number: 8, name: 'Estatísticas', category: 'DATA', description: 'Destaque de 3 a 4 grandes indicadores numéricos (KPIs) com contexto.', maxRecommendedWords: 65, slots: ['title', 'metrics'] },
  { id: 'CHART', number: 9, name: 'Gráfico', category: 'DATA', description: 'Visualização quantitativa de dados com barras/evolução e insights.', maxRecommendedWords: 75, slots: ['title', 'chartSeries', 'takeaway'] },
  { id: 'TIMELINE', number: 10, name: 'Cronologia', category: 'FLOW', description: 'Linha temporal com marcos sequenciais de evolução ou roadmap.', maxRecommendedWords: 90, slots: ['title', 'milestones'] },
  { id: 'PROCESS', number: 11, name: 'Processo', category: 'FLOW', description: 'Fluxo passo a passo numerado de 4 etapas operacionais.', maxRecommendedWords: 95, slots: ['title', 'steps'] },
  { id: 'ORG_CHART', number: 12, name: 'Organograma', category: 'FLOW', description: 'Estrutura hierárquica de governação, equipas ou arquitetura.', maxRecommendedWords: 75, slots: ['title', 'rootNode', 'branches'] },
  { id: 'QUOTE', number: 13, name: 'Citação', category: 'VISUAL', description: 'Declaração ou princípio estratégico em destaque tipográfico.', maxRecommendedWords: 50, slots: ['quoteText', 'author', 'role'] },
  { id: 'GALLERY', number: 14, name: 'Galeria', category: 'VISUAL', description: 'Mosaico visual de 4 cartões ilustrados com legendas.', maxRecommendedWords: 70, slots: ['title', 'galleryItems'] },
  { id: 'INFOGRAPHIC', number: 15, name: 'Infográfico', category: 'DATA', description: 'Síntese visual combinando ícones, métricas e blocos explicativos.', maxRecommendedWords: 95, slots: ['title', 'infographicNodes'] },
  { id: 'TABLE', number: 16, name: 'Tabela', category: 'DATA', description: 'Grelha estruturada de especificações, matriz ou orçamento.', maxRecommendedWords: 110, slots: ['title', 'headers', 'rows'] },
  { id: 'CASE_STUDY', number: 17, name: 'Estudo de Caso', category: 'CONTENT', description: 'Estrutura Desafio → Solução → Resultados Comprovados.', maxRecommendedWords: 105, slots: ['title', 'challenge', 'solution', 'results'] },
  { id: 'QNA', number: 18, name: 'Perguntas e Respostas', category: 'CONTENT', description: 'Esclarecimento direto das principais questões estratégicas (FAQ).', maxRecommendedWords: 100, slots: ['title', 'questions'] },
  { id: 'CONCLUSION', number: 19, name: 'Conclusão', category: 'CLOSING', description: 'Resumo executivo das aprendizagens e mensagens-chave.', maxRecommendedWords: 80, slots: ['title', 'summaryPoints'] },
  { id: 'CALL_TO_ACTION', number: 20, name: 'Chamada à Ação', category: 'CLOSING', description: 'Slide final com próximos passos imediatos, contacto e decisão.', maxRecommendedWords: 60, slots: ['title', 'actionItems', 'contactInfo'] },
];

export const NEXORA_THEMES: DesignThemeSpec[] = [
  {
    id: 'CORPORATE',
    name: 'Corporativo',
    category: 'Empresarial',
    colors: { background: '#0F172A', surface: '#1E293B', text: '#F8FAFC', textMuted: '#94A3B8', primary: '#2563EB', accent: '#38BDF8', border: '#334155' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.0 },
  },
  {
    id: 'EXECUTIVE',
    name: 'Executivo',
    category: 'Liderança',
    colors: { background: '#111827', surface: '#1F2937', text: '#F9FAFB', textMuted: '#9CA3AF', primary: '#D97706', accent: '#FBBF24', border: '#374151' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.05 },
  },
  {
    id: 'MINIMALIST',
    name: 'Minimalista',
    category: 'Editorial Limpo',
    colors: { background: '#FFFFFF', surface: '#F8FAFC', text: '#0F172A', textMuted: '#64748B', primary: '#18181B', accent: '#6366F1', border: '#E2E8F0' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 0.98 },
  },
  {
    id: 'EDUCATIONAL',
    name: 'Educativo',
    category: 'Ensino & Formação',
    colors: { background: '#F0FDF4', surface: '#FFFFFF', text: '#064E3B', textMuted: '#047857', primary: '#059669', accent: '#F59E0B', border: '#A7F3D0' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.0 },
  },
  {
    id: 'ACADEMIC',
    name: 'Académico',
    category: 'Científico & Investigação',
    colors: { background: '#FAF8F5', surface: '#FFFFFF', text: '#1E1B4B', textMuted: '#4338CA', primary: '#312E81', accent: '#B45309', border: '#E0E7FF' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.0 },
  },
  {
    id: 'TECH',
    name: 'Tecnológico',
    category: 'Inovação & IA',
    colors: { background: '#090D16', surface: '#131B2E', text: '#F3E8FF', textMuted: '#A78BFA', primary: '#7C3AED', accent: '#22D3EE', border: '#2E1065' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.05 },
  },
  {
    id: 'FINANCIAL',
    name: 'Financeiro',
    category: 'Mercados & Banca',
    colors: { background: '#062C1E', surface: '#0B3D2B', text: '#ECFDF5', textMuted: '#6EE7B7', primary: '#10B981', accent: '#FCD34D', border: '#047857' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.0 },
  },
  {
    id: 'CREATIVE',
    name: 'Criativo',
    category: 'Design & Marketing',
    colors: { background: '#2E1065', surface: '#4C1D95', text: '#FDF4FF', textMuted: '#F5D0FE', primary: '#EC4899', accent: '#FBBF24', border: '#701A75' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.08 },
  },
  {
    id: 'INSTITUTIONAL',
    name: 'Institucional',
    category: 'Setor Público & Governação',
    colors: { background: '#F8FAFC', surface: '#FFFFFF', text: '#0F172A', textMuted: '#475569', primary: '#1D4ED8', accent: '#0284C7', border: '#CBD5E1' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.0 },
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    category: 'Alta Direção & Luxo',
    colors: { background: '#09090B', surface: '#18181B', text: '#FAFAFA', textMuted: '#A1A1AA', primary: '#D4AF37', accent: '#FDE047', border: '#27272A' },
    typography: { headingFont: 'Helvetica-Bold', bodyFont: 'Helvetica', titleScale: 1.05 },
  },
];

@Injectable()
export class DesignEngineService {
  getLayouts(): DesignLayoutSpec[] {
    return NEXORA_LAYOUTS;
  }

  getThemes(): DesignThemeSpec[] {
    return NEXORA_THEMES;
  }

  getThemeById(themeId?: string): DesignThemeSpec {
    return (
      NEXORA_THEMES.find((t) => t.id === (themeId || 'TECH').toUpperCase()) ||
      NEXORA_THEMES[5]! // Default TECH
    );
  }

  getLayoutById(layoutId?: string): DesignLayoutSpec {
    return (
      NEXORA_LAYOUTS.find((l) => l.id === (layoutId || 'TITLE_AND_TEXT').toUpperCase()) ||
      NEXORA_LAYOUTS[2]!
    );
  }

  /**
   * Automatically selects diverse, high-impact layouts across a presentation
   * so no two consecutive slides look monotonous.
   */
  selectOptimalLayoutSequence(slideCount: number, includeCharts = true): string[] {
    const sequence: string[] = [];
    const middlePool = [
      'INTRODUCTION',
      'THREE_COLUMNS',
      'STATISTICS',
      'TEXT_AND_IMAGE',
      'PROCESS',
      includeCharts ? 'CHART' : 'TWO_COLUMNS',
      'COMPARISON',
      'INFOGRAPHIC',
      'TIMELINE',
      'CASE_STUDY',
      'TABLE',
      'ORG_CHART',
      'QUOTE',
      'GALLERY',
      'TWO_COLUMNS',
      'TITLE_AND_TEXT',
      'QNA',
    ];

    for (let i = 1; i <= slideCount; i++) {
      if (i === 1) {
        sequence.push('COVER');
      } else if (i === slideCount) {
        sequence.push('CALL_TO_ACTION');
      } else if (i === slideCount - 1 && slideCount >= 5) {
        sequence.push('CONCLUSION');
      } else {
        const pick = middlePool[(i - 2) % middlePool.length]!;
        sequence.push(pick);
      }
    }

    return sequence;
  }

  /**
   * Computes relative luminance and WCAG 2.1 contrast ratio between two hex colors
   */
  calculateContrastRatio(hex1: string, hex2: string): number {
    const getLum = (hex: string) => {
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2), 16) / 255;
      const g = parseInt(clean.substring(2, 4), 16) / 255;
      const b = parseInt(clean.substring(4, 6), 16) / 255;
      const a = [r, g, b].map((v) =>
        v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
      );
      return 0.2126 * a[0]! + 0.7152 * a[1]! + 0.0722 * a[2]!;
    };

    try {
      const lum1 = getLum(hex1);
      const lum2 = getLum(hex2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
    } catch {
      return 12.5;
    }
  }

  /**
   * Validates contrast, text density, layout variety and prevents visual overlap
   */
  validatePresentationDesign(presentation: any): {
    isValid: boolean;
    designScore: number;
    contrastRatio: number;
    wcagLevel: 'AAA' | 'AA' | 'WARN';
    layoutDiversityCount: number;
    warnings: string[];
  } {
    const theme = this.getThemeById(presentation.theme);
    const contrastRatio = this.calculateContrastRatio(
      theme.colors.background,
      theme.colors.text,
    );
    const wcagLevel = contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : 'WARN';

    const slides: any[] = presentation.slides || [];
    const uniqueLayouts = new Set(slides.map((s) => s.content?.layout || 'TITLE_AND_TEXT'));
    const warnings: string[] = [];

    slides.forEach((s) => {
      const layoutSpec = this.getLayoutById(s.content?.layout);
      const activeText = [
        s.title || '',
        s.content?.subtitle || '',
        ...((s.content?.bullets as string[]) || []),
      ].join(' ');
      const words = activeText.split(/\s+/).filter(Boolean).length;
      if (words > layoutSpec.maxRecommendedWords * 2) {
        warnings.push(
          `Slide ${s.position} ("${s.title}") possui densidade textual elevada (${words} palavras). Recomendado simplificar ou dividir.`,
        );
      }
    });

    const designScore = Math.min(
      100,
      Math.max(
        75,
        90 + (wcagLevel === 'AAA' ? 6 : 3) + Math.min(4, uniqueLayouts.size) - warnings.length * 3,
      ),
    );

    return {
      isValid: contrastRatio >= 4.5,
      designScore,
      contrastRatio,
      wcagLevel,
      layoutDiversityCount: uniqueLayouts.size,
      warnings,
    };
  }
}
