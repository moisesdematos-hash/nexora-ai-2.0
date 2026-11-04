import { Injectable } from '@nestjs/common';
import {
  CreateInfographicDto,
  InfographicType,
  InfographicPaletteId,
} from '../dto/infographics.dto';

export interface InfographicKpiCard {
  id: string;
  value: string;
  label: string;
  trend: string;
}

export interface InfographicChartItem {
  label: string;
  value: number;
  unit: string;
  color?: string;
}

export interface InfographicMilestone {
  phase: string;
  title: string;
  description: string;
  metric?: string;
}

export interface InfographicDataSchema {
  infographicType: InfographicType;
  palette: InfographicPaletteId;
  subtitle: string;
  badgeText: string;
  kpiCards: InfographicKpiCard[];
  chartTitle: string;
  chartItems: InfographicChartItem[];
  milestonesTitle: string;
  milestones: InfographicMilestone[];
  calloutBanner: {
    title: string;
    body: string;
  };
  footerSource: string;
  updatedByAiAt?: string;
}

@Injectable()
export class InfographicsEngineService {
  private readonly fonts = {
    Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  getArchetypes(): Array<{
    id: InfographicType;
    name: string;
    description: string;
  }> {
    return [
      {
        id: 'STATISTICAL',
        name: 'Infográfico Estatístico & KPIs',
        description:
          'Destaque visual para números de impacto, gráficos comparativos de barras e indicadores de mercado.',
      },
      {
        id: 'TIMELINE',
        name: 'Cronologia & Roadmap Visual',
        description:
          'Evolução temporal estruturada em marcos sequenciais, fases históricas ou planos de lançamento.',
      },
      {
        id: 'PROCESS',
        name: 'Fluxo de Processo Passo a Passo',
        description:
          'Explicação visual clara de metodologias, funis de conversão e ciclos operacionais.',
      },
      {
        id: 'COMPARISON',
        name: 'Comparativo Visual & Benchmark',
        description:
          'Contraste direto de cenários (Antes vs. Depois, Solução A vs. Solução B) com métricas.',
      },
      {
        id: 'LISTICLE',
        name: 'Guia Visual em Blocos (Top Insights)',
        description:
          'Síntese editorial de pilares estratégicos, boas práticas e recomendações executivas.',
      },
    ];
  }

  getPalettes(): Array<{
    id: InfographicPaletteId;
    name: string;
    bgPrimary: string;
    bgCard: string;
    accentPrimary: string;
    accentSecondary: string;
    textPrimary: string;
    textMuted: string;
  }> {
    return [
      {
        id: 'CYBER_INDIGO',
        name: 'Cyber Indigo Dark',
        bgPrimary: '#0F172A',
        bgCard: '#1E293B',
        accentPrimary: '#6366F1',
        accentSecondary: '#06B6D4',
        textPrimary: '#F8FAFC',
        textMuted: '#94A3B8',
      },
      {
        id: 'EXECUTIVE_NAVY',
        name: 'Executive Navy & Cyan',
        bgPrimary: '#0B132B',
        bgCard: '#1C2541',
        accentPrimary: '#3A86FF',
        accentSecondary: '#00F5D4',
        textPrimary: '#FFFFFF',
        textMuted: '#CBD5E1',
      },
      {
        id: 'EMERALD_ECO',
        name: 'Emerald Sustainability',
        bgPrimary: '#062C22',
        bgCard: '#0D4436',
        accentPrimary: '#10B981',
        accentSecondary: '#FBBF24',
        textPrimary: '#ECFDF5',
        textMuted: '#A7F3D0',
      },
      {
        id: 'SUNSET_CORAL',
        name: 'Sunset Coral Studio',
        bgPrimary: '#18111E',
        bgCard: '#2A1E35',
        accentPrimary: '#F43F5E',
        accentSecondary: '#FB923C',
        textPrimary: '#FFF1F2',
        textMuted: '#FDA4AF',
      },
      {
        id: 'ROYAL_GOLD',
        name: 'Royal Gold Luxury',
        bgPrimary: '#111111',
        bgCard: '#1F1F1F',
        accentPrimary: '#D4AF37',
        accentSecondary: '#F3E5AB',
        textPrimary: '#FAFAFA',
        textMuted: '#A3A3A3',
      },
    ];
  }

  generateInfographic(dto: CreateInfographicDto): InfographicDataSchema {
    const infographicType: InfographicType =
      dto.infographicType || 'STATISTICAL';
    const palette: InfographicPaletteId = dto.palette || 'CYBER_INDIGO';
    const topic = dto.prompt || dto.title;

    return {
      infographicType,
      palette,
      subtitle: `Síntese Visual de Dados, Indicadores e Marcos Estratégicos sobre ${topic}`,
      badgeText: `NEXORA INFOGRAPHICS • ${infographicType}`,
      kpiCards: [
        {
          id: 'kpi-1',
          value: '+68%',
          label: 'Ganho de Produtividade',
          trend: '▲ +14% vs. ano anterior',
        },
        {
          id: 'kpi-2',
          value: '3.9x',
          label: 'Retorno sobre Investimento',
          trend: '▲ Payback em 4 meses',
        },
        {
          id: 'kpi-3',
          value: '99.4%',
          label: 'Precisão & Conformidade',
          trend: '▲ Padrão Enterprise',
        },
      ],
      chartTitle: `Distribuição de Impacto por Vetor (${dto.title})`,
      chartItems: [
        { label: 'Automação & IA Generativa', value: 92, unit: '%' },
        { label: 'Eficiência de Processos Core', value: 84, unit: '%' },
        { label: 'Redução de Tempo de Entrega', value: 76, unit: '%' },
        { label: 'Adoção pelas Equipas', value: 89, unit: '%' },
      ],
      milestonesTitle: 'Fluxo Estruturado & Marcos Principais',
      milestones: [
        {
          phase: '01',
          title: 'Diagnóstico & Mapeamento de Dados',
          description: `Levantamento de indicadores críticos e alinhamento de metas para ${dto.title}.`,
          metric: 'Semana 1-2',
        },
        {
          phase: '02',
          title: 'Implementação & Automação Inteligente',
          description:
            'Configuração de fluxos assistidos por IA e integração com fontes de dados.',
          metric: 'Semana 3-5',
        },
        {
          phase: '03',
          title: 'Monitorização em Tempo Real & Escala',
          description:
            'Acompanhamento contínuo de KPIs e expansão para todas as unidades de negócio.',
          metric: 'Contínuo',
        },
      ],
      calloutBanner: {
        title: 'Insight Executivo Principal',
        body: `Organizações que utilizam comunicação visual orientada a dados em ${dto.title} aceleram a tomada de decisão estratégica em até 3,2 vezes.`,
      },
      footerSource: `Fonte: Estúdio Editorial & Analítico NEXORA AI 2.0 • Gerado em ${new Date().toISOString().split('T')[0]}`,
    };
  }

  executeAiCommand(
    currentData: InfographicDataSchema,
    command: string,
  ): {
    updatedData: InfographicDataSchema;
    actionSummary: string;
  } {
    const cmd = command.toLowerCase();
    const cloned: InfographicDataSchema = JSON.parse(
      JSON.stringify(currentData),
    );

    if (cmd.includes('paleta') || cmd.includes('cor') || cmd.includes('ouro') || cmd.includes('gold')) {
      cloned.palette =
        cloned.palette === 'CYBER_INDIGO' ? 'ROYAL_GOLD' : 'EMERALD_ECO';
      return {
        updatedData: cloned,
        actionSummary: `Paleta visual atualizada para ${cloned.palette}.`,
      };
    }

    if (cmd.includes('cronologia') || cmd.includes('timeline') || cmd.includes('marco')) {
      cloned.infographicType = 'TIMELINE';
      cloned.milestones.push({
        phase: `0${cloned.milestones.length + 1}`,
        title: 'Expansão Internacional & Otimização Contínua',
        description:
          'Consolidação dos resultados globais com auditoria automatizada de performance.',
        metric: 'Q4 Meta',
      });
      return {
        updatedData: cloned,
        actionSummary:
          'Novo marco cronológico adicionado e estrutura otimizada para Timeline.',
      };
    }

    // Default: add new chart bar + boost KPI
    cloned.chartItems.push({
      label: `Novo Vetor IA (${command.slice(0, 22)})`,
      value: 95,
      unit: '%',
    });
    cloned.updatedByAiAt = new Date().toISOString();

    return {
      updatedData: cloned,
      actionSummary: `Comando IA "${command}" aplicado com novo indicador visual no gráfico.`,
    };
  }

  exportToSvg(
    title: string,
    width: number,
    height: number,
    data: InfographicDataSchema,
  ): string {
    const w = width || 800;
    const h = height || 1200;
    const pal =
      this.getPalettes().find((p) => p.id === data.palette) ||
      this.getPalettes()[0];

    const escapeXml = (str: string) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    // KPI Cards SVG
    const kpiBlocks = (data.kpiCards || []).slice(0, 3).map((kpi, idx) => {
      const cardW = 224;
      const x = 44 + idx * 244;
      const y = 190;
      return `
        <g transform="translate(${x}, ${y})">
          <rect width="${cardW}" height="128" rx="16" fill="${pal.bgCard}" stroke="${pal.accentPrimary}" stroke-width="1.5" stroke-opacity="0.6" />
          <text x="20" y="50" fill="${pal.accentSecondary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="32" font-weight="800">
            ${escapeXml(kpi.value)}
          </text>
          <text x="20" y="80" fill="${pal.textPrimary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="13" font-weight="700">
            ${escapeXml(kpi.label.slice(0, 26))}
          </text>
          <text x="20" y="104" fill="${pal.textMuted}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="11">
            ${escapeXml(kpi.trend)}
          </text>
        </g>
      `;
    });

    // Horizontal Bar Chart SVG
    const chartBars = (data.chartItems || []).slice(0, 5).map((item, idx) => {
      const y = 400 + idx * 54;
      const maxBarW = 420;
      const pct = Math.min(Math.max(item.value || 50, 5), 100);
      const barW = Math.round((pct / 100) * maxBarW);
      return `
        <g transform="translate(64, ${y})">
          <text x="0" y="16" fill="${pal.textPrimary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12.5" font-weight="600">
            ${escapeXml(item.label.slice(0, 32))}
          </text>
          <rect x="235" y="2" width="${maxBarW}" height="20" rx="10" fill="#0F172A" fill-opacity="0.6" />
          <rect x="235" y="2" width="${barW}" height="20" rx="10" fill="${idx % 2 === 0 ? pal.accentPrimary : pal.accentSecondary}" />
          <text x="${235 + maxBarW + 14}" y="17" fill="${pal.accentSecondary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="13" font-weight="800">
            ${pct}${escapeXml(item.unit || '%')}
          </text>
        </g>
      `;
    });

    // Milestones SVG
    const milestoneBlocks = (data.milestones || [])
      .slice(0, 4)
      .map((ms, idx) => {
        const y = 735 + idx * 82;
        return `
        <g transform="translate(44, ${y})">
          <rect width="712" height="68" rx="14" fill="${pal.bgCard}" stroke="#334155" stroke-width="1" />
          <circle cx="38" cy="34" r="20" fill="${pal.accentPrimary}" />
          <text x="38" y="39" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Helvetica, Arial, sans-serif" font-size="13" font-weight="800">
            ${escapeXml(ms.phase)}
          </text>
          <text x="74" y="28" fill="${pal.textPrimary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="14" font-weight="700">
            ${escapeXml(ms.title.slice(0, 52))}
          </text>
          <text x="74" y="49" fill="${pal.textMuted}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="11.5">
            ${escapeXml(ms.description.slice(0, 78))}
          </text>
          <rect x="600" y="18" width="94" height="28" rx="8" fill="${pal.bgPrimary}" />
          <text x="647" y="36" text-anchor="middle" fill="${pal.accentSecondary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="10.5" font-weight="700">
            ${escapeXml(ms.metric || 'Etapa')}
          </text>
        </g>
      `;
      });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${pal.accentPrimary}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="${pal.bgCard}" stop-opacity="0.98" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="${pal.bgPrimary}" />

  <!-- Top Header Banner -->
  <rect x="28" y="24" width="${w - 56}" height="142" rx="20" fill="url(#headerGrad)" />
  <text x="56" y="58" fill="${pal.accentSecondary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="1.5">
    ${escapeXml(data.badgeText || 'NEXORA INFOGRAPHICS')}
  </text>
  <text x="56" y="96" fill="#FFFFFF" font-family="Inter, Helvetica, Arial, sans-serif" font-size="26" font-weight="800">
    ${escapeXml(title.slice(0, 44))}
  </text>
  <text x="56" y="128" fill="#E2E8F0" font-family="Inter, Helvetica, Arial, sans-serif" font-size="13">
    ${escapeXml((data.subtitle || '').slice(0, 82))}
  </text>

  <!-- KPI Row -->
  ${kpiBlocks.join('\n  ')}

  <!-- Chart Container -->
  <rect x="44" y="340" width="712" height="335" rx="18" fill="${pal.bgCard}" stroke="#334155" stroke-width="1" />
  <text x="64" y="376" fill="${pal.textPrimary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="16" font-weight="800">
    ${escapeXml(data.chartTitle || 'Indicadores Comparativos')}
  </text>
  ${chartBars.join('\n  ')}

  <!-- Milestones Section -->
  <text x="44" y="715" fill="${pal.textPrimary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="16" font-weight="800">
    ${escapeXml(data.milestonesTitle || 'Fluxo Estruturado & Marcos')}
  </text>
  ${milestoneBlocks.join('\n  ')}

  <!-- Callout Banner -->
  <rect x="44" y="1072" width="712" height="72" rx="14" fill="${pal.accentPrimary}" fill-opacity="0.18" stroke="${pal.accentPrimary}" stroke-width="1.5" />
  <text x="64" y="1098" fill="${pal.accentSecondary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12.5" font-weight="800">
    ${escapeXml(data.calloutBanner?.title || 'Destaque Executivo')}
  </text>
  <text x="64" y="1122" fill="${pal.textPrimary}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="11.5">
    ${escapeXml((data.calloutBanner?.body || '').slice(0, 95))}
  </text>

  <!-- Footer -->
  <text x="400" y="1174" text-anchor="middle" fill="${pal.textMuted}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="10.5">
    ${escapeXml(data.footerSource || 'NEXORA AI 2.0 • Infographic Studio')}
  </text>
</svg>`;
  }

  async exportToPdf(
    title: string,
    data: InfographicDataSchema,
  ): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfmake = require('pdfmake');
    pdfmake.setFonts(this.fonts);
    if (typeof pdfmake.setUrlAccessPolicy === 'function') {
      pdfmake.setUrlAccessPolicy(() => false);
    }
    if (typeof pdfmake.setLocalAccessPolicy === 'function') {
      pdfmake.setLocalAccessPolicy((p: string) => p.startsWith('Helvetica'));
    }

    const pal =
      this.getPalettes().find((p) => p.id === data.palette) ||
      this.getPalettes()[0];

    const kpiCols = (data.kpiCards || []).slice(0, 3).map((kpi) => ({
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: [
                {
                  text: kpi.value,
                  fontSize: 22,
                  bold: true,
                  color: pal.accentSecondary,
                  margin: [0, 0, 0, 4],
                },
                {
                  text: kpi.label,
                  fontSize: 10,
                  bold: true,
                  color: '#FFFFFF',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: kpi.trend,
                  fontSize: 8.5,
                  color: '#CBD5E1',
                },
              ],
              fillColor: pal.bgCard,
              margin: [10, 10, 10, 10],
            },
          ],
        ],
      },
      layout: 'noBorders',
    }));

    const chartTableRows: any[][] = [
      [
        {
          text: 'Indicador / Vetor',
          bold: true,
          fontSize: 9.5,
          color: '#FFFFFF',
          fillColor: pal.accentPrimary,
          margin: [6, 5, 6, 5],
        },
        {
          text: 'Resultado',
          bold: true,
          fontSize: 9.5,
          color: '#FFFFFF',
          fillColor: pal.accentPrimary,
          margin: [6, 5, 6, 5],
        },
      ],
    ];
    for (const item of data.chartItems || []) {
      chartTableRows.push([
        {
          text: item.label,
          fontSize: 9.5,
          color: '#F8FAFC',
          fillColor: pal.bgCard,
          margin: [6, 5, 6, 5],
        },
        {
          text: `${item.value}${item.unit || '%'}`,
          fontSize: 10,
          bold: true,
          color: pal.accentSecondary,
          fillColor: pal.bgCard,
          margin: [6, 5, 6, 5],
        },
      ]);
    }

    const milestoneStack = (data.milestones || []).map((ms) => ({
      table: {
        widths: [40, '*', 80],
        body: [
          [
            {
              text: ms.phase,
              fontSize: 12,
              bold: true,
              color: pal.accentSecondary,
              fillColor: pal.bgCard,
              alignment: 'center',
              margin: [4, 8, 4, 8],
            },
            {
              stack: [
                {
                  text: ms.title,
                  fontSize: 10.5,
                  bold: true,
                  color: '#FFFFFF',
                  margin: [0, 0, 0, 2],
                },
                {
                  text: ms.description,
                  fontSize: 9,
                  color: '#CBD5E1',
                },
              ],
              fillColor: pal.bgCard,
              margin: [6, 6, 6, 6],
            },
            {
              text: ms.metric || '',
              fontSize: 9,
              bold: true,
              color: pal.accentSecondary,
              fillColor: pal.bgCard,
              alignment: 'right',
              margin: [6, 10, 8, 6],
            },
          ],
        ],
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 8],
    }));

    const docDefinition = {
      pageSize: { width: 600, height: 900 },
      pageMargins: [30, 30, 30, 30],
      background: () => ({
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 600,
            h: 900,
            color: pal.bgPrimary,
          },
        ],
      }),
      defaultStyle: { font: 'Roboto', color: '#FFFFFF' },
      content: [
        {
          text: data.badgeText || 'NEXORA INFOGRAPHICS',
          fontSize: 9,
          bold: true,
          color: pal.accentSecondary,
          characterSpacing: 1.2,
          margin: [0, 0, 0, 4],
        },
        {
          text: title,
          fontSize: 22,
          bold: true,
          color: '#FFFFFF',
          margin: [0, 0, 0, 6],
        },
        {
          text: data.subtitle || '',
          fontSize: 10.5,
          color: '#CBD5E1',
          margin: [0, 0, 0, 16],
        },
        {
          columns: kpiCols,
          columnGap: 10,
          margin: [0, 0, 0, 18],
        },
        {
          text: data.chartTitle || 'Indicadores Principais',
          fontSize: 13,
          bold: true,
          color: '#FFFFFF',
          margin: [0, 0, 0, 8],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 90],
            body: chartTableRows,
          },
          margin: [0, 0, 0, 18],
        },
        {
          text: data.milestonesTitle || 'Marcos e Etapas',
          fontSize: 13,
          bold: true,
          color: '#FFFFFF',
          margin: [0, 0, 0, 8],
        },
        ...milestoneStack,
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    {
                      text: data.calloutBanner?.title || 'Insight Executivo',
                      fontSize: 10.5,
                      bold: true,
                      color: pal.accentSecondary,
                      margin: [0, 0, 0, 3],
                    },
                    {
                      text: data.calloutBanner?.body || '',
                      fontSize: 9.5,
                      color: '#F8FAFC',
                    },
                  ],
                  fillColor: pal.bgCard,
                  margin: [12, 10, 12, 10],
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 10, 0, 14],
        },
        {
          text: data.footerSource || 'NEXORA AI 2.0',
          fontSize: 8,
          color: '#94A3B8',
          alignment: 'center',
        },
      ],
    };

    const pdf = pdfmake.createPdf(docDefinition);
    return await pdf.getBuffer();
  }
}
