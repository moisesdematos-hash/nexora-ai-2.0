import { Injectable } from '@nestjs/common';
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { CreateDocumentDto, DocumentTemplateType } from '../dto/docs.dto';

export interface DocumentSectionBlock {
  id: string;
  heading: string;
  level: 1 | 2 | 3;
  body: string;
  bullets?: string[];
  callout?: {
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'EXECUTIVE';
    title: string;
    text: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface DocumentContentSchema {
  template: DocumentTemplateType;
  subtitle: string;
  author: string;
  organizationName: string;
  version: string;
  date: string;
  language: string;
  tone: string;
  targetAudience: string;
  executiveSummary: string;
  sections: DocumentSectionBlock[];
  actionItems: Array<{
    id: string;
    task: string;
    owner: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  }>;
  themeColor: string;
}

@Injectable()
export class DocsEngineService {
  private readonly fonts = {
    Roboto: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  getTemplates(): Array<{
    id: DocumentTemplateType;
    name: string;
    description: string;
    category: string;
    defaultTone: string;
    themeColor: string;
    sectionCount: number;
  }> {
    return [
      {
        id: 'EXECUTIVE_REPORT',
        name: 'Relatório Executivo',
        description:
          'Relatório de gestão com sumário executivo, análise de KPIs, diagnóstico estratégico e recomendações acionáveis.',
        category: 'Gestão & Estratégia',
        defaultTone: 'Executivo e Analítico',
        themeColor: '#4F46E5',
        sectionCount: 5,
      },
      {
        id: 'COMMERCIAL_PROPOSAL',
        name: 'Proposta Comercial Enterprise',
        description:
          'Proposta B2B estruturada com diagnóstico do cliente, escopo de solução, arquitetura de entrega, cronograma e investimento.',
        category: 'Vendas & Negócios',
        defaultTone: 'Persuasivo e Corporativo',
        themeColor: '#0EA5E9',
        sectionCount: 6,
      },
      {
        id: 'TECHNICAL_MANUAL',
        name: 'Manual Técnico & Arquitetura',
        description:
          'Documentação de engenharia com arquitetura de sistema, requisitos, especificações de API, segurança e operação.',
        category: 'Engenharia & Produto',
        defaultTone: 'Técnico e Preciso',
        themeColor: '#10B981',
        sectionCount: 5,
      },
      {
        id: 'SOP_PLAYBOOK',
        name: 'Playbook & Procedimento Operacional (SOP)',
        description:
          'Guia passo a passo padronizado para operações, governança, checklists de qualidade e matriz de responsabilidades.',
        category: 'Operações & Qualidade',
        defaultTone: 'Instrutivo e Direto',
        themeColor: '#F59E0B',
        sectionCount: 5,
      },
      {
        id: 'PROJECT_CHARTER',
        name: 'Project Charter & Plano Diretor',
        description:
          'Termo de abertura de projeto com objetivos SMART, stakeholders, pacotes de trabalho (WBS), riscos e orçamento.',
        category: 'PMO & Projetos',
        defaultTone: 'Estruturado e Formal',
        themeColor: '#8B5CF6',
        sectionCount: 5,
      },
    ];
  }

  generateStructuredDocument(dto: CreateDocumentDto): {
    content: DocumentContentSchema;
    wordCount: number;
  } {
    const template: DocumentTemplateType = dto.template || 'EXECUTIVE_REPORT';
    const topic = dto.prompt || dto.title;
    const language = dto.language || 'pt';
    const tone = dto.tone || 'Executivo e Profissional';
    const author = dto.author || 'Equipa Editorial NEXORA AI';
    const organizationName = dto.organizationName || 'NEXORA Enterprise Studio';
    const today = new Date().toISOString().split('T')[0];

    const templateMeta =
      this.getTemplates().find((t) => t.id === template) || this.getTemplates()[0];

    let sections: DocumentSectionBlock[] = [];

    if (template === 'COMMERCIAL_PROPOSAL') {
      sections = [
        {
          id: 'sec-1',
          heading: '1. Contexto e Desafio do Cliente',
          level: 1,
          body: `As organizações modernas enfrentam pressões crescentes de eficiência operacional e transformação digital no domínio de ${topic}. Este documento apresenta um diagnóstico claro dos gargalos atuais e a oportunidade imediata de criação de valor.`,
          bullets: [
            `Eliminação de processos manuais fragmentados relacionados com ${topic}`,
            'Redução do tempo de resposta operacional em até 65%',
            'Governança centralizada com visibilidade em tempo real para a direção',
          ],
          callout: {
            type: 'EXECUTIVE',
            title: 'Oportunidade de Impacto Direto',
            text: `A adoção desta solução permite capturar ganhos mensuráveis nos primeiros 60 dias de implementação.`,
          },
        },
        {
          id: 'sec-2',
          heading: '2. Solução Proposta e Arquitetura de Valor',
          level: 1,
          body: `A solução concebida para ${dto.title} combina automação inteligente, fluxos auditáveis e integração nativa com o ecossistema existente da organização.`,
          bullets: [
            'Módulo Core de Processamento e Inteligência Analítica',
            'Painel Executivo de Monitorização de Indicadores (SLAs e KPIs)',
            'Camada de Segurança, Conformidade e Controlo de Acessos (RBAC)',
          ],
        },
        {
          id: 'sec-3',
          heading: '3. Metodologia e Cronograma de Implementação',
          level: 1,
          body: `A execução é dividida em 4 fases estruturadas com entregas validadas ao final de cada sprint, mitigando riscos técnicos e garantindo adoção rápida pelas equipas.`,
          table: {
            headers: ['Fase', 'Entregável Principal', 'Duração', 'Responsável'],
            rows: [
              ['Fase 1 — Discovery', 'Diagnóstico & Arquitetura Técnica', '2 Semanas', 'Arquiteto Líder'],
              ['Fase 2 — Core Setup', 'Configuração e Integrações', '4 Semanas', 'Equipa Engenharia'],
              ['Fase 3 — Piloto & QA', 'Testes de Aceitação e Formação', '2 Semanas', 'Gestor de Sucesso'],
              ['Fase 4 — Go-Live', 'Operação Assistida e Rollout', '2 Semanas', 'Equipa Conjunta'],
            ],
          },
        },
        {
          id: 'sec-4',
          heading: '4. Investimento Comercial e Retorno Esperado (ROI)',
          level: 1,
          body: `O modelo comercial foi desenhado para alinhar o investimento à geração de valor contínua, garantindo previsibilidade financeira e retorno sobre o investimento no primeiro ano fiscal.`,
          table: {
            headers: ['Componente', 'Descrição', 'Periodicidade', 'Investimento'],
            rows: [
              ['Setup & Onboarding', 'Parametrização, migração e formação inicial', 'Único', '€ 14.500'],
              ['Licenciamento Enterprise', 'Acesso ilimitado + SLA 99.9% + Suporte 24/7', 'Anual', '€ 28.000 / ano'],
              ['Pacote de Expansão IA', 'Créditos dedicados de processamento avançado', 'Mensal', 'Incluído no Plano'],
            ],
          },
        },
        {
          id: 'sec-5',
          heading: '5. Garantias, SLA e Próximos Passos',
          level: 1,
          body: `Garantimos disponibilidade contratual de 99,9% e acompanhamento executivo mensal. Para formalizar o início dos trabalhos, apresentamos abaixo o plano de ação imediato.`,
          callout: {
            type: 'SUCCESS',
            title: 'Validade da Proposta',
            text: 'As condições comerciais apresentadas neste documento são válidas por 30 dias corridos.',
          },
        },
      ];
    } else if (template === 'TECHNICAL_MANUAL') {
      sections = [
        {
          id: 'sec-1',
          heading: '1. Visão Geral da Arquitetura e Especificações',
          level: 1,
          body: `Este manual técnico documenta a arquitetura, os padrões de engenharia e os procedimentos operacionais referentes a ${dto.title} (${topic}).`,
          bullets: [
            'Arquitetura modular baseada em microsserviços e eventos assíncronos',
            'Persistência relacional em PostgreSQL com isolamento multi-tenant',
            'Camada de cache distribuído e filas de processamento resilientes',
          ],
          callout: {
            type: 'INFO',
            title: 'Pré-requisitos de Ambiente',
            text: 'Requer Node.js >= 20 LTS, PostgreSQL 16+ e variáveis de ambiente validadas no arranque.',
          },
        },
        {
          id: 'sec-2',
          heading: '2. Matriz de Componentes e Contratos de Dados',
          level: 1,
          body: `Os módulos comunicam através de contratos estritamente tipados e validados na camada de entrada, garantindo integridade transacional.`,
          table: {
            headers: ['Componente', 'Tecnologia', 'Responsabilidade', 'SLA Alvo'],
            rows: [
              ['API Gateway & Auth', 'NestJS + JWT', 'Autenticação, Rate Limiting e Routing', '< 50ms p95'],
              ['Motor Core', 'TypeScript + Workers', 'Orquestração de regras de negócio e IA', '< 250ms p95'],
              ['Camada de Dados', 'PostgreSQL + Prisma', 'Persistência ACID e auditoria histórica', '99.95% Uptime'],
            ],
          },
        },
        {
          id: 'sec-3',
          heading: '3. Segurança, Autenticação e Conformidade',
          level: 1,
          body: `Toda a comunicação externa utiliza TLS 1.3. As credenciais são armazenadas exclusivamente em cofres seguros e nunca expostas no código-fonte.`,
          bullets: [
            'Validação rigorosa de payloads via DTOs e sanitização contra XSS/SQLi',
            'Registo imutável de auditoria para operações críticas de escrita e exportação',
            'Políticas de backup incremental diário e retenção de 30 dias',
          ],
        },
        {
          id: 'sec-4',
          heading: '4. Procedimentos de Deploy, Monitorização e Troubleshooting',
          level: 1,
          body: `O pipeline de CI/CD executa linting, verificação de tipos, testes automatizados e build antes de qualquer promoção para produção.`,
          callout: {
            type: 'WARNING',
            title: 'Protocolo de Rollback',
            text: 'Em caso de anomalia no healthcheck após deploy, acionar reversão imediata para a release anterior verificada.',
          },
        },
      ];
    } else if (template === 'SOP_PLAYBOOK') {
      sections = [
        {
          id: 'sec-1',
          heading: '1. Objetivo e Âmbito de Aplicação do Procedimento',
          level: 1,
          body: `Este Procedimento Operacional Padrão (SOP) estabelece as diretrizes obrigatórias para execução consistente de ${dto.title}, assegurando qualidade, rastreabilidade e mitigação de erros humanos.`,
          bullets: [
            'Aplicável a todas as equipas operacionais e de supervisão',
            'Revisão trimestral obrigatória pelo líder de qualidade',
            'Conformidade verificada através de checklists auditáveis',
          ],
        },
        {
          id: 'sec-2',
          heading: '2. Matriz de Responsabilidades (RACI)',
          level: 1,
          body: `A clareza de papéis em cada etapa do fluxo garante que nenhuma atividade crítica fique sem responsável direto.`,
          table: {
            headers: ['Atividade', 'Executor (R)', 'Aprovador (A)', 'Consultado (C)', 'Informado (I)'],
            rows: [
              ['Preparação e Triagem', 'Analista Operacional', 'Coordenador', 'Especialista Técnico', 'Equipa'],
              ['Execução do Fluxo Principal', 'Especialista', 'Gestor da Área', 'Qualidade (QA)', 'Stakeholders'],
              ['Validação e Homologação', 'Auditor QA', 'Diretor Operacional', 'Segurança', 'Cliente Interno'],
            ],
          },
        },
        {
          id: 'sec-3',
          heading: '3. Instruções Passo a Passo de Execução',
          level: 1,
          body: `Siga rigorosamente a sequência abaixo. Não avance para a etapa seguinte sem validar os critérios de aceitação da etapa atual.`,
          bullets: [
            'Passo 1: Verificar integridade dos insumos e permissões de acesso no sistema.',
            'Passo 2: Executar o protocolo principal de processamento e registar evidências.',
            'Passo 3: Realizar conferência cruzada com os parâmetros de referência.',
            'Passo 4: Emitir relatório de conclusão e atualizar estado no painel central.',
          ],
          callout: {
            type: 'WARNING',
            title: 'Ponto Crítico de Controlo',
            text: 'Qualquer desvio superior a 5% nos indicadores padrão exige paragem imediata e notificação à supervisão.',
          },
        },
      ];
    } else if (template === 'PROJECT_CHARTER') {
      sections = [
        {
          id: 'sec-1',
          heading: '1. Justificativa e Objetivos Estratégicos (SMART)',
          level: 1,
          body: `O projeto ${dto.title} foi instituído para estruturar e escalar as capacidades de ${topic}, alinhado às metas estratégicas anuais da organização.`,
          bullets: [
            'Entregar 100% do escopo funcional dentro do prazo de 12 semanas',
            'Atingir índice de satisfação dos utilizadores (CSAT) superior a 90%',
            'Manter variação orçamental dentro da margem máxima de ±5%',
          ],
        },
        {
          id: 'sec-2',
          heading: '2. Escopo, Entregáveis e Exclusões',
          level: 1,
          body: `A definição explícita das fronteiras do projeto previne desvios de escopo (scope creep) e protege o cronograma crítico.`,
          table: {
            headers: ['Pacote de Trabalho (WBS)', 'Entregável Verificável', 'Critério de Aceitação', 'Prioridade'],
            rows: [
              ['WBS 1.0 — Planeamento', 'Plano Diretor e Matriz de Riscos', 'Aprovação formal do Sponsor', 'Crítica'],
              ['WBS 2.0 — Execução Core', 'Sistema Funcional Homologado', '100% dos testes críticos aprovados', 'Alta'],
              ['WBS 3.0 — Transição', 'Manual de Operação e Formação', 'Equipa certificada em produção', 'Alta'],
            ],
          },
        },
        {
          id: 'sec-3',
          heading: '3. Matriz de Riscos e Plano de Mitigação',
          level: 1,
          body: `Os riscos identificados são monitorizados semanalmente pelo Comité de Projeto.`,
          callout: {
            type: 'INFO',
            title: 'Governança Semanal',
            text: 'Reuniões de Status Report ocorrem todas as segundas-feiras às 10h00 com presença obrigatória dos líderes de frente.',
          },
        },
      ];
    } else {
      // EXECUTIVE_REPORT (default)
      sections = [
        {
          id: 'sec-1',
          heading: '1. Panorama Estratégico e Diagnóstico Atual',
          level: 1,
          body: `A análise aprofundada sobre ${topic} demonstra uma transformação acelerada nos padrões de produtividade, eficiência de capital e diferenciação competitiva. Este relatório consolida os principais indicadores e tendências relevantes para a tomada de decisão executiva.`,
          bullets: [
            `Crescimento de 38% na maturidade operacional associada a ${topic}`,
            'Otimização direta de recursos através de automação inteligente e governança',
            'Redução significativa do tempo entre planeamento estratégico e execução tática',
          ],
          callout: {
            type: 'EXECUTIVE',
            title: 'Conclusão Chave para a Direção',
            text: `Priorizar investimentos estruturados em ${dto.title} gera vantagem competitiva sustentável e retorno mensurável já no próximo trimestre.`,
          },
        },
        {
          id: 'sec-2',
          heading: '2. Análise de Indicadores de Desempenho (KPIs)',
          level: 1,
          body: `A tabela seguinte sintetiza o desempenho comparativo entre o baseline histórico, o resultado atual e a meta estipulada para o ciclo vigente.`,
          table: {
            headers: ['Indicador (KPI)', 'Baseline Anterior', 'Resultado Atual', 'Meta Anual', 'Status'],
            rows: [
              ['Eficiência Operacional', '64%', '86%', '92%', 'No Caminho (On Track)'],
              ['Tempo Médio de Entrega (SLA)', '14 dias', '4.5 dias', '3.0 dias', 'Forte Evolução'],
              ['Custo por Unidade Produzida', '€ 120,00', '€ 74,00', '€ 65,00', 'Acima da Meta'],
              ['Índice de Qualidade & Conformidade', '88%', '98.4%', '99.0%', 'Excelente'],
            ],
          },
        },
        {
          id: 'sec-3',
          heading: '3. Alavancas de Crescimento e Oportunidades',
          level: 1,
          body: `Identificámos três vetores principais capazes de acelerar os resultados globais sem aumento proporcional da estrutura de custos fixos:`,
          bullets: [
            'Padronização de processos críticos com templates e playbooks auditáveis',
            'Integração de dados interdepartamentais para eliminar silos de informação',
            'Capacitação contínua das equipas em ferramentas de alta produtividade assistidas por IA',
          ],
        },
        {
          id: 'sec-4',
          heading: '4. Riscos Mapeados e Salvaguardas Operacionais',
          level: 1,
          body: `Para garantir a sustentabilidade dos resultados, foram estabelecidos mecanismos preventivos de controlo e contingência operacional.`,
          callout: {
            type: 'WARNING',
            title: 'Atenção à Gestão da Mudança',
            text: 'O alinhamento entre lideranças intermédias e equipas técnicas é indispensável para evitar resistência na adoção dos novos fluxos.',
          },
        },
        {
          id: 'sec-5',
          heading: '5. Recomendações Finais e Roteiro de Execução',
          level: 1,
          body: `Recomenda-se a aprovação imediata do plano de ação detalhado abaixo, com revisão quinzenal de progresso junto aos responsáveis designados.`,
        },
      ];
    }

    const content: DocumentContentSchema = {
      template,
      subtitle: `Documento Oficial — ${templateMeta.name}`,
      author,
      organizationName,
      version: '1.0',
      date: today,
      language,
      tone,
      targetAudience: dto.targetAudience || 'Direção Executiva e Stakeholders',
      executiveSummary: `Este documento (${templateMeta.name}) apresenta uma estrutura completa, rigorosa e orientada a resultados sobre "${dto.title}". Elaborado com foco em clareza editorial, fundamentação analítica e aplicabilidade prática imediata.`,
      sections,
      actionItems: [
        {
          id: 'act-1',
          task: `Aprovar diretrizes principais de ${dto.title}`,
          owner: 'Direção Executiva',
          priority: 'HIGH',
          dueDate: today,
          status: 'DONE',
        },
        {
          id: 'act-2',
          task: 'Alocar equipa responsável e validar indicadores de sucesso (KPIs)',
          owner: 'Gestor de Projeto / Operações',
          priority: 'HIGH',
          dueDate: today,
          status: 'IN_PROGRESS',
        },
        {
          id: 'act-3',
          task: 'Realizar revisão de acompanhamento após 30 dias de operação',
          owner: 'Comité de Qualidade',
          priority: 'MEDIUM',
          dueDate: today,
          status: 'PENDING',
        },
      ],
      themeColor: templateMeta.themeColor,
    };

    return {
      content,
      wordCount: this.calculateWordCount(content),
    };
  }

  calculateWordCount(content: any): number {
    if (!content) return 0;
    const parts: string[] = [];
    if (content.subtitle) parts.push(content.subtitle);
    if (content.executiveSummary) parts.push(content.executiveSummary);
    if (Array.isArray(content.sections)) {
      for (const s of content.sections) {
        if (s.heading) parts.push(s.heading);
        if (s.body) parts.push(s.body);
        if (Array.isArray(s.bullets)) parts.push(...s.bullets);
        if (s.callout?.text) parts.push(s.callout.text);
        if (s.table?.rows) {
          for (const r of s.table.rows) {
            parts.push(...r);
          }
        }
      }
    }
    const text = parts.join(' ').trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }

  executeAiCommand(
    currentTitle: string,
    currentContent: DocumentContentSchema,
    command: string,
    targetSectionId?: string,
  ): {
    updatedContent: DocumentContentSchema;
    actionSummary: string;
  } {
    const cmd = command.toLowerCase();
    const cloned: DocumentContentSchema = JSON.parse(JSON.stringify(currentContent));

    if (cmd.includes('resum') || cmd.includes('sintetiz')) {
      cloned.executiveSummary = `[Síntese Executiva Otimizada por IA] ${cloned.executiveSummary.slice(0, 260)} — Foco prioritário em eficiência operacional, governança de KPIs e execução acelerada nos próximos 90 dias.`;
      return {
        updatedContent: cloned,
        actionSummary: 'Sumário executivo condensado com foco nos pontos críticos de decisão.',
      };
    }

    if (cmd.includes('expand') || cmd.includes('aprofund') || cmd.includes('detalh')) {
      const target = targetSectionId
        ? cloned.sections.find((s) => s.id === targetSectionId)
        : cloned.sections[0];
      if (target) {
        target.body += `\n\nAnálise Complementar (IA): O aprofundamento desta frente demonstra que organizações que padronizam este fluxo obtêm ganhos consistentes de previsibilidade, reduzindo custos de retrabalho e acelerando a tomada de decisão baseada em evidências.`;
        target.bullets = [
          ...(target.bullets || []),
          'Implementação de indicadores preditivos de qualidade e performance',
          'Ciclo de melhoria contínua com auditoria quinzenal automatizada',
        ];
      }
      return {
        updatedContent: cloned,
        actionSummary: `Secção "${target?.heading || 'Principal'}" expandida com análise detalhada e novos pontos-chave.`,
      };
    }

    if (cmd.includes('tabela') || cmd.includes('kpi') || cmd.includes('métrica')) {
      cloned.sections.push({
        id: `sec-${Date.now()}`,
        heading: `${cloned.sections.length + 1}. Matriz Complementar de Indicadores e Metas`,
        level: 1,
        body: 'Quadro analítico gerado pelo Assistente de IA da NEXORA para controlo rigoroso de resultados.',
        table: {
          headers: ['Métrica Estratégica', 'Meta Trimestral', 'Meta Anual', 'Responsável'],
          rows: [
            ['Taxa de Adoção Operacional', '85%', '98%', 'Direção de Operações'],
            ['Redução de Custos Diretos', '-18%', '-32%', 'Controladoria & Finanças'],
            ['NPS / Satisfação Interna', '78 pts', '88 pts', 'Gestão de Produto'],
          ],
        },
      });
      return {
        updatedContent: cloned,
        actionSummary: 'Nova secção com tabela estruturada de KPIs adicionada ao documento.',
      };
    }

    if (cmd.includes('ação') || cmd.includes('plano') || cmd.includes('checklist')) {
      cloned.actionItems.push({
        id: `act-${Date.now()}`,
        task: `Executar auditoria de validação e homologação final (${currentTitle})`,
        owner: 'Líder de Governança',
        priority: 'HIGH',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
      });
      return {
        updatedContent: cloned,
        actionSummary: 'Novo item de ação prioritário adicionado à matriz de execução.',
      };
    }

    if (cmd.includes('francês') || cmd.includes('frances') || cmd.includes('french')) {
      cloned.language = 'fr';
      cloned.subtitle = `Document Officiel — ${currentTitle}`;
      cloned.executiveSummary = `[Traduit en Français] Ce document présente une analyse stratégique complète et structurée concernant "${currentTitle}", orientée vers la performance opérationnelle et la gouvernance exécutive.`;
      return {
        updatedContent: cloned,
        actionSummary: 'Sumário e metadados traduzidos e adaptados para Francês (FR).',
      };
    }

    if (cmd.includes('inglês') || cmd.includes('ingles') || cmd.includes('english')) {
      cloned.language = 'en';
      cloned.subtitle = `Executive Document — ${currentTitle}`;
      cloned.executiveSummary = `[Translated to English] This executive document provides a comprehensive, data-driven framework for "${currentTitle}", focusing on operational excellence, measurable KPIs, and strategic execution.`;
      return {
        updatedContent: cloned,
        actionSummary: 'Sumário e metadados traduzidos e adaptados para Inglês (EN).',
      };
    }

    // Default command: formal / editorial polish
    cloned.tone = 'Executivo Premium';
    cloned.version = (parseFloat(cloned.version || '1.0') + 0.1).toFixed(1);
    cloned.sections.push({
      id: `sec-${Date.now()}`,
      heading: `${cloned.sections.length + 1}. Nota Editorial & Diretriz Complementar`,
      level: 1,
      body: `Secção gerada em resposta à instrução: "${command}". O alinhamento contínuo entre estratégia, tecnologia e operação assegura a excelência sustentável de ${currentTitle}.`,
      callout: {
        type: 'INFO',
        title: 'Diretriz Aplicada',
        text: `Comando processado com sucesso pelo motor NEXORA DOCS: "${command}".`,
      },
    });

    return {
      updatedContent: cloned,
      actionSummary: `Instrução "${command}" aplicada com atualização para a versão v${cloned.version}.`,
    };
  }

  exportToMarkdown(title: string, content: DocumentContentSchema): string {
    const lines: string[] = [];
    lines.push(`# ${title}`);
    lines.push(`**${content.subtitle || 'Documento NEXORA DOCS'}**`);
    lines.push(
      `> **Autor:** ${content.author} | **Organização:** ${content.organizationName} | **Versão:** v${content.version} | **Data:** ${content.date}`,
    );
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Sumário Executivo');
    lines.push(content.executiveSummary || '');
    lines.push('');

    for (const sec of content.sections || []) {
      const hashes = '#'.repeat(Math.min(Math.max((sec.level || 1) + 1, 2), 4));
      lines.push(`${hashes} ${sec.heading}`);
      lines.push('');
      if (sec.body) {
        lines.push(sec.body);
        lines.push('');
      }
      if (sec.bullets && sec.bullets.length > 0) {
        for (const b of sec.bullets) {
          lines.push(`- ${b}`);
        }
        lines.push('');
      }
      if (sec.callout) {
        lines.push(`> **[${sec.callout.type}] ${sec.callout.title}:** ${sec.callout.text}`);
        lines.push('');
      }
      if (sec.table && sec.table.headers?.length) {
        lines.push(`| ${sec.table.headers.join(' | ')} |`);
        lines.push(`| ${sec.table.headers.map(() => '---').join(' | ')} |`);
        for (const row of sec.table.rows || []) {
          lines.push(`| ${row.join(' | ')} |`);
        }
        lines.push('');
      }
    }

    if (content.actionItems && content.actionItems.length > 0) {
      lines.push('## Plano de Ação e Próximos Passos');
      lines.push('');
      lines.push('| Tarefa | Responsável | Prioridade | Prazo | Estado |');
      lines.push('| --- | --- | --- | --- | --- |');
      for (const item of content.actionItems) {
        lines.push(
          `| ${item.task} | ${item.owner} | ${item.priority} | ${item.dueDate} | ${item.status} |`,
        );
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  async exportToPdf(title: string, content: DocumentContentSchema): Promise<Buffer> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfmake = require('pdfmake');
    pdfmake.setFonts(this.fonts);
    if (typeof pdfmake.setUrlAccessPolicy === 'function') {
      pdfmake.setUrlAccessPolicy(() => false);
    }
    if (typeof pdfmake.setLocalAccessPolicy === 'function') {
      pdfmake.setLocalAccessPolicy((p: string) => p.startsWith('Helvetica'));
    }

    const accent = content.themeColor || '#4F46E5';
    const docBody: any[] = [];

    // Header Banner
    docBody.push({
      table: {
        widths: ['*'],
        body: [
          [
            {
              stack: [
                {
                  text: (content.organizationName || 'NEXORA DOCS').toUpperCase(),
                  fontSize: 9,
                  bold: true,
                  color: '#E0E7FF',
                  characterSpacing: 1.5,
                  margin: [0, 0, 0, 4],
                },
                {
                  text: title,
                  fontSize: 22,
                  bold: true,
                  color: '#FFFFFF',
                  margin: [0, 0, 0, 4],
                },
                {
                  text: content.subtitle || 'Documento Corporativo',
                  fontSize: 11,
                  color: '#E2E8F0',
                  margin: [0, 0, 0, 8],
                },
                {
                  text: `Autor: ${content.author || 'NEXORA AI'}  •  Versão: v${content.version || '1.0'}  •  Data: ${content.date || ''}`,
                  fontSize: 9,
                  color: '#CBD5E1',
                },
              ],
              fillColor: accent,
              margin: [18, 16, 18, 16],
              border: [false, false, false, false],
            },
          ],
        ],
      },
      margin: [0, 0, 0, 18],
    });

    // Executive Summary Box
    if (content.executiveSummary) {
      docBody.push({
        text: 'SUMÁRIO EXECUTIVO',
        fontSize: 10,
        bold: true,
        color: accent,
        characterSpacing: 1,
        margin: [0, 0, 0, 6],
      });
      docBody.push({
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: content.executiveSummary,
                fontSize: 10.5,
                lineHeight: 1.4,
                color: '#1E293B',
                fillColor: '#F8FAFC',
                margin: [12, 10, 12, 10],
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 16],
      });
    }

    // Sections
    for (const sec of content.sections || []) {
      docBody.push({
        text: sec.heading,
        fontSize: sec.level === 1 ? 14 : 12,
        bold: true,
        color: '#0F172A',
        margin: [0, 10, 0, 6],
      });

      if (sec.body) {
        docBody.push({
          text: sec.body,
          fontSize: 10.5,
          lineHeight: 1.45,
          color: '#334155',
          margin: [0, 0, 0, 8],
        });
      }

      if (sec.bullets && sec.bullets.length > 0) {
        docBody.push({
          ul: sec.bullets.map((b) => ({
            text: b,
            fontSize: 10,
            color: '#334155',
            margin: [0, 2, 0, 2],
          })),
          margin: [8, 0, 0, 10],
        });
      }

      if (sec.callout) {
        docBody.push({
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    {
                      text: `${sec.callout.title}`,
                      fontSize: 10,
                      bold: true,
                      color: accent,
                      margin: [0, 0, 0, 3],
                    },
                    {
                      text: sec.callout.text,
                      fontSize: 9.5,
                      color: '#334155',
                    },
                  ],
                  fillColor: '#EEF2FF',
                  margin: [10, 8, 10, 8],
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 4, 0, 10],
        });
      }

      if (sec.table && sec.table.headers?.length) {
        const colCount = sec.table.headers.length;
        const widths = Array(colCount).fill('*');
        const bodyRows: any[][] = [
          sec.table.headers.map((h) => ({
            text: h,
            bold: true,
            fontSize: 9.5,
            color: '#FFFFFF',
            fillColor: '#1E293B',
            margin: [6, 5, 6, 5],
          })),
        ];
        for (const r of sec.table.rows || []) {
          bodyRows.push(
            r.map((cell) => ({
              text: String(cell ?? ''),
              fontSize: 9,
              color: '#334155',
              margin: [6, 5, 6, 5],
            })),
          );
        }
        docBody.push({
          table: {
            headerRows: 1,
            widths,
            body: bodyRows,
          },
          margin: [0, 4, 0, 12],
        });
      }
    }

    // Action Items
    if (content.actionItems && content.actionItems.length > 0) {
      docBody.push({
        text: 'Plano de Ação e Responsabilidades',
        fontSize: 13,
        bold: true,
        color: '#0F172A',
        margin: [0, 12, 0, 6],
      });
      const actionRows: any[][] = [
        ['Tarefa', 'Responsável', 'Prioridade', 'Estado'].map((h) => ({
          text: h,
          bold: true,
          fontSize: 9.5,
          color: '#FFFFFF',
          fillColor: accent,
          margin: [6, 5, 6, 5],
        })),
      ];
      for (const item of content.actionItems) {
        actionRows.push([
          { text: item.task, fontSize: 9, margin: [6, 4, 6, 4] },
          { text: item.owner, fontSize: 9, margin: [6, 4, 6, 4] },
          { text: item.priority, fontSize: 9, bold: true, margin: [6, 4, 6, 4] },
          { text: item.status, fontSize: 9, margin: [6, 4, 6, 4] },
        ]);
      }
      docBody.push({
        table: {
          headerRows: 1,
          widths: ['*', 110, 70, 80],
          body: actionRows,
        },
        margin: [0, 4, 0, 10],
      });
    }

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [45, 45, 45, 50],
      defaultStyle: { font: 'Roboto' },
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          {
            text: `${title} • ${content.organizationName || 'NEXORA DOCS'}`,
            fontSize: 8,
            color: '#94A3B8',
            margin: [45, 15, 0, 0],
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'right',
            fontSize: 8,
            color: '#94A3B8',
            margin: [0, 15, 45, 0],
          },
        ],
      }),
      content: docBody,
    };

    const pdf = pdfmake.createPdf(docDefinition);
    return await pdf.getBuffer();
  }

  async exportToDocx(title: string, content: DocumentContentSchema): Promise<Buffer> {
    const children: any[] = [];

    children.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        spacing: { after: 120 },
      }),
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${content.subtitle || 'Documento Corporativo'} | Autor: ${content.author || 'NEXORA AI'} | Versão: v${content.version || '1.0'}`,
            italics: true,
            color: '475569',
            size: 20,
          }),
        ],
        spacing: { after: 300 },
      }),
    );

    if (content.executiveSummary) {
      children.push(
        new Paragraph({
          text: 'Sumário Executivo',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 120 },
        }),
      );
      children.push(
        new Paragraph({
          text: content.executiveSummary,
          spacing: { after: 240 },
        }),
      );
    }

    for (const sec of content.sections || []) {
      children.push(
        new Paragraph({
          text: sec.heading,
          heading:
            sec.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        }),
      );

      if (sec.body) {
        children.push(
          new Paragraph({
            text: sec.body,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 160 },
          }),
        );
      }

      if (sec.bullets && sec.bullets.length > 0) {
        for (const b of sec.bullets) {
          children.push(
            new Paragraph({
              text: b,
              bullet: { level: 0 },
              spacing: { after: 80 },
            }),
          );
        }
      }

      if (sec.callout) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[${sec.callout.title}] `,
                bold: true,
                color: '4F46E5',
              }),
              new TextRun({
                text: sec.callout.text,
                italics: true,
              }),
            ],
            spacing: { before: 120, after: 180 },
          }),
        );
      }

      if (sec.table && sec.table.headers?.length) {
        const tableRows: TableRow[] = [
          new TableRow({
            children: sec.table.headers.map(
              (h) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: h, bold: true })],
                    }),
                  ],
                }),
            ),
          }),
        ];
        for (const r of sec.table.rows || []) {
          tableRows.push(
            new TableRow({
              children: r.map(
                (cell) =>
                  new TableCell({
                    children: [new Paragraph({ text: String(cell ?? '') })],
                  }),
              ),
            }),
          );
        }
        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            },
          }),
        );
      }
    }

    const doc = new DocxDocument({
      creator: content.author || 'NEXORA AI',
      title,
      description: content.subtitle || '',
      sections: [{ children }],
    });

    return await Packer.toBuffer(doc);
  }
}
