import { Injectable } from '@nestjs/common';
import {
  CreateMindMapDto,
  MindMapDiagramType,
  MindMapThemeId,
} from '../dto/mindmaps.dto';

export interface MindMapNode {
  id: string;
  parentId: string | null;
  label: string;
  notes?: string;
  category?: string;
  level: number;
  color: string;
  x: number;
  y: number;
  metricBadge?: string;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  style: 'SOLID' | 'DASHED';
}

export interface MindMapDataSchema {
  diagramType: MindMapDiagramType;
  theme: MindMapThemeId;
  layoutDirection: 'RADIAL' | 'HORIZONTAL' | 'VERTICAL';
  rootNodeId: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  updatedByAiAt?: string;
}

@Injectable()
export class MindMapsEngineService {
  getDiagramTypes(): Array<{
    id: MindMapDiagramType;
    name: string;
    description: string;
    defaultLayout: 'RADIAL' | 'HORIZONTAL' | 'VERTICAL';
  }> {
    return [
      {
        id: 'MIND_MAP',
        name: 'Mapa Mental Estratégico',
        description:
          'Estrutura radial/ramificada ideal para brainstorming, planeamento de produto e decomposição de ideias.',
        defaultLayout: 'HORIZONTAL',
      },
      {
        id: 'FLOWCHART',
        name: 'Fluxograma de Processo',
        description:
          'Fluxo sequencial de etapas, decisões e automações operacionais de ponta a ponta.',
        defaultLayout: 'HORIZONTAL',
      },
      {
        id: 'ORG_CHART',
        name: 'Organograma & Governança',
        description:
          'Hierarquia organizacional de equipas, diretorias, squads e responsabilidades.',
        defaultLayout: 'VERTICAL',
      },
      {
        id: 'ARCHITECTURE',
        name: 'Arquitetura de Sistema',
        description:
          'Diagrama técnico de camadas (Frontend, API Gateway, Serviços, Base de Dados e IA).',
        defaultLayout: 'HORIZONTAL',
      },
      {
        id: 'CONCEPT_MAP',
        name: 'Mapa Conceitual & Conhecimento',
        description:
          'Rede semântica de conceitos interligados para ensino, pesquisa e síntese de domínio.',
        defaultLayout: 'RADIAL',
      },
    ];
  }

  getThemes(): Array<{
    id: MindMapThemeId;
    name: string;
    background: string;
    rootColor: string;
    branchPalette: string[];
    textColor: string;
  }> {
    return [
      {
        id: 'NEON_TECH',
        name: 'Neon Tech Dark',
        background: '#0F172A',
        rootColor: '#6366F1',
        branchPalette: ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'],
        textColor: '#F8FAFC',
      },
      {
        id: 'CORPORATE_BLUE',
        name: 'Corporate Executive',
        background: '#F8FAFC',
        rootColor: '#1E3A8A',
        branchPalette: ['#2563EB', '#0284C7', '#0D9488', '#4F46E5', '#475569'],
        textColor: '#0F172A',
      },
      {
        id: 'EMERALD_GROWTH',
        name: 'Emerald Growth',
        background: '#064E3B',
        rootColor: '#10B981',
        branchPalette: ['#34D399', '#14B8A6', '#84CC16', '#06B6D4', '#FBBF24'],
        textColor: '#ECFDF5',
      },
      {
        id: 'WARM_CREATIVE',
        name: 'Warm Creative Studio',
        background: '#18181B',
        rootColor: '#F97316',
        branchPalette: ['#FB923C', '#F43F5E', '#A855F7', '#EAB308', '#EC4899'],
        textColor: '#FAFAFA',
      },
      {
        id: 'MINIMAL_MONO',
        name: 'Minimalist Slate',
        background: '#FFFFFF',
        rootColor: '#0F172A',
        branchPalette: ['#334155', '#475569', '#64748B', '#1E293B', '#0F172A'],
        textColor: '#0F172A',
      },
    ];
  }

  generateMindMap(dto: CreateMindMapDto): MindMapDataSchema {
    const diagramType: MindMapDiagramType = dto.diagramType || 'MIND_MAP';
    const themeId: MindMapThemeId = dto.theme || 'NEON_TECH';
    const theme =
      this.getThemes().find((t) => t.id === themeId) || this.getThemes()[0];
    const topic = dto.title || dto.prompt || 'Estratégia Central';

    const nodes: MindMapNode[] = [];
    const edges: MindMapEdge[] = [];

    const rootNode: MindMapNode = {
      id: 'node-root',
      parentId: null,
      label: topic,
      notes: `Nó central do diagrama (${diagramType}): ${dto.prompt || topic}`,
      category: 'ROOT',
      level: 0,
      color: theme.rootColor,
      x: 220,
      y: 400,
      metricBadge: 'Core',
    };
    nodes.push(rootNode);

    const primaryBranches = this.getBranchesForType(diagramType, topic);

    primaryBranches.forEach((branch, idx) => {
      const branchColor =
        theme.branchPalette[idx % theme.branchPalette.length];
      const yOffset = 130 + idx * 170;
      const branchId = `node-l1-${idx + 1}`;

      nodes.push({
        id: branchId,
        parentId: rootNode.id,
        label: branch.title,
        notes: branch.notes,
        category: branch.category,
        level: 1,
        color: branchColor,
        x: 560,
        y: yOffset,
        metricBadge: branch.badge,
      });

      edges.push({
        id: `edge-root-${branchId}`,
        source: rootNode.id,
        target: branchId,
        label: branch.edgeLabel,
        style: 'SOLID',
      });

      branch.children.forEach((childLabel, cIdx) => {
        const childId = `node-l2-${idx + 1}-${cIdx + 1}`;
        const childY = yOffset - 40 + cIdx * 45;
        nodes.push({
          id: childId,
          parentId: branchId,
          label: childLabel,
          notes: `Sub-elemento de ${branch.title}`,
          category: branch.category,
          level: 2,
          color: branchColor,
          x: 920,
          y: childY,
        });

        edges.push({
          id: `edge-${branchId}-${childId}`,
          source: branchId,
          target: childId,
          style: 'SOLID',
        });
      });
    });

    return {
      diagramType,
      theme: themeId,
      layoutDirection:
        diagramType === 'ORG_CHART' ? 'VERTICAL' : 'HORIZONTAL',
      rootNodeId: rootNode.id,
      nodes,
      edges,
    };
  }

  private getBranchesForType(
    diagramType: MindMapDiagramType,
    topic: string,
  ): Array<{
    title: string;
    notes: string;
    category: string;
    badge: string;
    edgeLabel?: string;
    children: string[];
  }> {
    if (diagramType === 'ARCHITECTURE') {
      return [
        {
          title: '1. Camada de Experiência (Web & Mobile)',
          notes: 'Interfaces reativas Next.js 14 e Design System',
          category: 'Frontend',
          badge: 'Edge CDN',
          edgeLabel: 'HTTPS / WSS',
          children: [
            'App Router & SSR',
            'Estúdio Visual Interativo',
            'Gestão de Estado & Cache',
          ],
        },
        {
          title: '2. API Gateway & Orquestração',
          notes: 'Controladores NestJS, Auth JWT e Rate Limiting',
          category: 'Backend',
          badge: '< 50ms',
          edgeLabel: 'REST / RPC',
          children: [
            'Autenticação & RBAC Multi-tenant',
            'Validação de DTOs & Segurança',
            'Motor de Créditos & Billing',
          ],
        },
        {
          title: '3. Motor de Inteligência Artificial',
          notes: 'Pipelines multi-modelo e geração assíncrona',
          category: 'AI Core',
          badge: 'LLM Router',
          edgeLabel: 'Workers',
          children: [
            'Orquestração Multi-Provider',
            'Memória Contextual Persistente',
            'Filas BullMQ & Checkpoints',
          ],
        },
        {
          title: '4. Persistência & Exportação',
          notes: 'PostgreSQL + Prisma e motores documentais',
          category: 'Data',
          badge: 'ACID',
          edgeLabel: 'Prisma ORM',
          children: [
            'PostgreSQL Multi-tenant',
            'Motores PDF / EPUB / DOCX / PPTX',
            'Auditoria & Histórico de Versões',
          ],
        },
      ];
    }

    if (diagramType === 'FLOWCHART') {
      return [
        {
          title: 'Etapa 1: Entrada & Diagnóstico',
          notes: `Receção e validação inicial para ${topic}`,
          category: 'Input',
          badge: 'Step 01',
          edgeLabel: 'Início',
          children: [
            'Captura de Prompt ou Ficheiro',
            'Análise Semântica de Objetivo',
            'Validação de Parâmetros',
          ],
        },
        {
          title: 'Etapa 2: Planeamento & Estrutura',
          notes: 'Geração de plano e aprovação pelo utilizador',
          category: 'Planning',
          badge: 'Step 02',
          edgeLabel: 'Validação',
          children: [
            'Geração de Esboço Estruturado',
            'Revisão & Ajuste Interativo',
            'Alocação de Layout e Tema',
          ],
        },
        {
          title: 'Etapa 3: Produção & Refinamento IA',
          notes: 'Geração de conteúdo rico e validação visual',
          category: 'Execution',
          badge: 'Step 03',
          edgeLabel: 'Processamento',
          children: [
            'Escrita & Composição Visual',
            'Verificação de Coerência e Contraste',
            'Edição Assistida por Comandos IA',
          ],
        },
        {
          title: 'Etapa 4: Publicação & Exportação',
          notes: 'Entrega nos formatos finais de produção',
          category: 'Output',
          badge: 'Step 04',
          edgeLabel: 'Entrega',
          children: [
            'Exportação Multi-formato (PDF/SVG/DOCX)',
            'Versionamento & Partilha Segura',
            'Métricas de Utilização',
          ],
        },
      ];
    }

    // Default MIND_MAP / ORG_CHART / CONCEPT_MAP
    return [
      {
        title: '1. Visão & Posicionamento Estratégico',
        notes: `Fundamentos e proposta de valor para ${topic}`,
        category: 'Estratégia',
        badge: 'Prioridade 1',
        children: [
          'Proposta de Valor Diferenciadora',
          'Segmentação de Público-Alvo',
          'Metas Trimestrais (OKRs)',
        ],
      },
      {
        title: '2. Produto, Tecnologia & Inovação',
        notes: 'Capacidades técnicas, automação e experiência do utilizador',
        category: 'Produto',
        badge: 'Core Engine',
        children: [
          'Arquitetura Escalável & Segura',
          'Experiência do Utilizador (UX/UI)',
          'Automação Inteligente com IA',
        ],
      },
      {
        title: '3. Operações, Processos & Qualidade',
        notes: 'Eficiência operacional, governança e SLAs',
        category: 'Operações',
        badge: '99.9% SLA',
        children: [
          'Playbooks & Padronização (SOPs)',
          'Gestão de Riscos & Conformidade',
          'Monitorização Contínua de KPIs',
        ],
      },
      {
        title: '4. Crescimento, Receita & Expansão',
        notes: 'Aquisição, retenção e expansão internacional',
        category: 'Growth',
        badge: 'ROI +3.8x',
        children: [
          'Funil de Aquisição & Conversão',
          'Retenção, LTV & Sucesso do Cliente',
          'Expansão Multilíngue (PT/EN/ES/FR)',
        ],
      },
    ];
  }

  expandNode(
    currentData: MindMapDataSchema,
    nodeId: string,
    customPrompt?: string,
    branchCount = 3,
  ): {
    updatedData: MindMapDataSchema;
    addedNodes: MindMapNode[];
  } {
    const cloned: MindMapDataSchema = JSON.parse(JSON.stringify(currentData));
    const parent = cloned.nodes.find((n) => n.id === nodeId) || cloned.nodes[0];
    const count = Math.min(Math.max(branchCount, 1), 6);
    const addedNodes: MindMapNode[] = [];

    const existingChildren = cloned.nodes.filter((n) => n.parentId === parent.id);
    const baseX = (parent.x || 560) + 320;
    const baseY = parent.y || 380;

    const subTopics = [
      `Análise Executiva: ${customPrompt || parent.label}`,
      `Plano de Implementação (${parent.label})`,
      `Indicadores & Métricas de Sucesso`,
      `Otimização & Automação IA`,
      `Mitigação de Riscos Operacionais`,
      `Benchmark & Melhores Práticas`,
    ];

    for (let i = 0; i < count; i++) {
      const idx = existingChildren.length + i;
      const newNodeId = `node-ai-${Date.now()}-${i + 1}`;
      const newY = baseY - 50 + idx * 52;

      const newNode: MindMapNode = {
        id: newNodeId,
        parentId: parent.id,
        label: subTopics[i % subTopics.length],
        notes: `Ramo expandido automaticamente por IA a partir de "${parent.label}".`,
        category: parent.category || 'AI_EXPANSION',
        level: (parent.level || 1) + 1,
        color: parent.color || '#6366F1',
        x: baseX,
        y: newY,
        metricBadge: 'IA+',
      };

      cloned.nodes.push(newNode);
      cloned.edges.push({
        id: `edge-${parent.id}-${newNodeId}`,
        source: parent.id,
        target: newNodeId,
        style: 'SOLID',
      });
      addedNodes.push(newNode);
    }

    cloned.updatedByAiAt = new Date().toISOString();
    return { updatedData: cloned, addedNodes };
  }

  executeAiCommand(
    currentData: MindMapDataSchema,
    command: string,
  ): {
    updatedData: MindMapDataSchema;
    actionSummary: string;
  } {
    const cmd = command.toLowerCase();
    const cloned: MindMapDataSchema = JSON.parse(JSON.stringify(currentData));

    if (cmd.includes('fluxograma') || cmd.includes('flowchart')) {
      cloned.diagramType = 'FLOWCHART';
      cloned.layoutDirection = 'HORIZONTAL';
      return {
        updatedData: cloned,
        actionSummary: 'Diagrama convertido para modo Fluxograma Sequencial (FLOWCHART).',
      };
    }

    if (cmd.includes('organograma') || cmd.includes('org')) {
      cloned.diagramType = 'ORG_CHART';
      cloned.layoutDirection = 'VERTICAL';
      return {
        updatedData: cloned,
        actionSummary: 'Diagrama convertido para Organograma Hierárquico (ORG_CHART).',
      };
    }

    if (cmd.includes('métrica') || cmd.includes('kpi') || cmd.includes('meta')) {
      cloned.nodes.forEach((node, idx) => {
        if (node.level === 1) {
          node.metricBadge = `KPI #${idx}: +${18 + idx * 7}%`;
        }
      });
      return {
        updatedData: cloned,
        actionSummary: 'Badges de KPIs quantitativos adicionados aos ramos principais.',
      };
    }

    // Default: expand level-1 nodes or add strategic branch
    const l1Nodes = cloned.nodes.filter((n) => n.level === 1);
    const targetParent = l1Nodes[l1Nodes.length - 1] || cloned.nodes[0];
    const { updatedData, addedNodes } = this.expandNode(
      cloned,
      targetParent.id,
      command,
      2,
    );

    return {
      updatedData,
      actionSummary: `Comando IA executado: ${addedNodes.length} novos sub-ramos gerados em "${targetParent.label}".`,
    };
  }

  exportToMarkdown(title: string, data: MindMapDataSchema): string {
    const lines: string[] = [];
    lines.push(`# ${title}`);
    lines.push(
      `> **Tipo:** ${data.diagramType} | **Tema:** ${data.theme} | **Total de Nós:** ${data.nodes?.length || 0}`,
    );
    lines.push('');

    const root =
      data.nodes.find((n) => n.id === data.rootNodeId) ||
      data.nodes.find((n) => n.parentId === null) ||
      data.nodes[0];

    const renderChildren = (parentId: string, depth: number) => {
      const children = data.nodes.filter((n) => n.parentId === parentId);
      for (const child of children) {
        const indent = '  '.repeat(depth);
        const badge = child.metricBadge ? ` \`[${child.metricBadge}]\`` : '';
        lines.push(`${indent}- **${child.label}**${badge}`);
        if (child.notes) {
          lines.push(`${indent}  - _${child.notes}_`);
        }
        renderChildren(child.id, depth + 1);
      }
    };

    if (root) {
      lines.push(`## 🎯 ${root.label}`);
      if (root.notes) lines.push(`_${root.notes}_`);
      lines.push('');
      renderChildren(root.id, 0);
    }

    return lines.join('\n');
  }

  exportToSvg(title: string, data: MindMapDataSchema): string {
    const theme =
      this.getThemes().find((t) => t.id === data.theme) || this.getThemes()[0];
    const width = 1280;
    const height = 840;

    const escapeXml = (str: string) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const nodeMap = new Map<string, MindMapNode>();
    for (const n of data.nodes || []) {
      nodeMap.set(n.id, n);
    }

    const edgeElements: string[] = [];
    for (const edge of data.edges || []) {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) continue;

      const x1 = src.x + 110;
      const y1 = src.y + 26;
      const x2 = tgt.x - 10;
      const y2 = tgt.y + 26;
      const cx1 = x1 + (x2 - x1) * 0.5;
      const cx2 = x1 + (x2 - x1) * 0.5;
      const strokeColor = tgt.color || theme.rootColor;
      const dash = edge.style === 'DASHED' ? 'stroke-dasharray="6,4"' : '';

      edgeElements.push(
        `<path d="M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-opacity="0.75" ${dash} />`,
      );
      edgeElements.push(
        `<circle cx="${x2}" cy="${y2}" r="4" fill="${strokeColor}" />`,
      );
    }

    const nodeElements: string[] = [];
    for (const node of data.nodes || []) {
      const isRoot = node.level === 0;
      const boxW = isRoot ? 240 : node.level === 1 ? 230 : 220;
      const boxH = isRoot ? 64 : 52;
      const x = node.x - 10;
      const y = node.y;
      const fill = isRoot ? node.color : '#1E293B';
      const stroke = node.color || theme.rootColor;
      const labelText =
        node.label.length > 30 ? `${node.label.slice(0, 28)}...` : node.label;

      nodeElements.push(`
        <g transform="translate(${x}, ${y})">
          <rect width="${boxW}" height="${boxH}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="${isRoot ? 3 : 2}" />
          <text x="14" y="${isRoot ? 28 : 24}" fill="#FFFFFF" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${isRoot ? 13 : 11.5}" font-weight="700">
            ${escapeXml(labelText)}
          </text>
          <text x="14" y="${isRoot ? 46 : 40}" fill="#94A3B8" font-family="Inter, Helvetica, Arial, sans-serif" font-size="9.5">
            ${escapeXml(node.category || `Nível ${node.level}`)} ${node.metricBadge ? `• ${escapeXml(node.metricBadge)}` : ''}
          </text>
        </g>
      `);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <pattern id="mindmap-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#334155" fill-opacity="0.45" />
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="${theme.background}" />
  <rect width="${width}" height="${height}" fill="url(#mindmap-grid)" />
  <g transform="translate(36, 36)">
    <text x="0" y="0" fill="${theme.textColor}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="18" font-weight="800">
      ${escapeXml(title)}
    </text>
    <text x="0" y="20" fill="#94A3B8" font-family="Inter, Helvetica, Arial, sans-serif" font-size="11">
      NEXORA MIND MAPS • ${escapeXml(data.diagramType)} • ${data.nodes?.length || 0} nós conectados
    </text>
  </g>
  <g id="edges">
    ${edgeElements.join('\n    ')}
  </g>
  <g id="nodes">
    ${nodeElements.join('\n    ')}
  </g>
</svg>`;
  }
}
