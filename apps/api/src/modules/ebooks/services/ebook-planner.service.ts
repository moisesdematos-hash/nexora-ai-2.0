import { Injectable } from '@nestjs/common';
import { GenerateOutlineDto } from '../dto/ebook.dto';

export interface PlannedPart {
  position: number;
  title: string;
}

export interface PlannedChapter {
  position: number;
  partPosition: number;
  title: string;
  summary: string;
  targetWordCount: number;
}

export interface PlannedBookOutline {
  title: string;
  subtitle: string;
  synopsis: string;
  targetAudience: string;
  objective: string;
  tone: string;
  depth: string;
  editorialStyle: string;
  targetPages: number;
  totalWordCount: number;
  parts: PlannedPart[];
  chapters: PlannedChapter[];
}

@Injectable()
export class EbookPlannerService {
  /**
   * Estimates pages to word count: ~250 words per book page (standard format)
   */
  calculateWordCount(pages: number): number {
    return pages * 250;
  }

  /**
   * Plans the part and chapter distribution according to page targets (10 to 500+ pages)
   */
  planChapters(
    pages: number,
    requestedChapters?: number,
  ): { count: number; partsCount: number; wordsPerChapter: number } {
    let count = requestedChapters;
    let partsCount = 1;

    if (pages <= 10) {
      if (!count) count = 4;
      partsCount = 1;
    } else if (pages <= 20) {
      if (!count) count = 6;
      partsCount = 2;
    } else if (pages <= 50) {
      if (!count) count = 10;
      partsCount = 3;
    } else if (pages <= 100) {
      if (!count) count = 15;
      partsCount = 4;
    } else if (pages <= 200) {
      if (!count) count = 20;
      partsCount = 5;
    } else if (pages <= 500) {
      if (!count) count = 30;
      partsCount = 6;
    } else {
      if (!count) count = 40;
      partsCount = 8;
    }

    const totalWords = this.calculateWordCount(pages);
    const wordsPerChapter = Math.round(totalWords / count);

    return { count, partsCount, wordsPerChapter };
  }

  /**
   * Generates or plans a structured outline based on topic and parameters
   */
  async generateOutline(dto: GenerateOutlineDto): Promise<PlannedBookOutline> {
    const { count, partsCount, wordsPerChapter } = this.planChapters(dto.targetPages, dto.chaptersCount);
    const totalWordCount = this.calculateWordCount(dto.targetPages);
    const tone = dto.tone || 'Profissional e inspirador';
    const audience = dto.targetAudience || 'Profissionais, estudantes e decisores do setor';
    const objective = dto.objective || `Capacitar o leitor com domínio teórico e prático sobre ${dto.topic}`;
    const depth = dto.depth || (dto.targetPages >= 100 ? 'Aprofundado / Tratado Completo' : 'Prático e Direto');
    const editorialStyle = dto.editorialStyle || 'Executivo Contemporâneo';

    const partThemes = [
      'Fundamentos, Contexto e Paradigmas',
      'Arquitetura, Metodologias e Estruturas',
      'Implementação Prática e Operações',
      'Estratégias Avançadas e Otimização',
      'Casos de Estudo, Governação e Escala',
      'Futuro, Inovação e Síntese Executiva',
      'Tópicos Especializados e Fronteiras',
      'Diretrizes Finais e Plano de Ação',
    ];

    const parts: PlannedPart[] = [];
    for (let p = 1; p <= partsCount; p++) {
      parts.push({
        position: p,
        title: `Parte ${p} — ${partThemes[(p - 1) % partThemes.length]}`,
      });
    }

    const chapters: PlannedChapter[] = [];
    const chaptersPerPart = Math.ceil(count / partsCount);

    for (let i = 1; i <= count; i++) {
      const partPosition = Math.min(partsCount, Math.ceil(i / chaptersPerPart));
      let title = `Capítulo ${i}: Fundamentos e Práticas`;
      let summary = `Exploração aprofundada dos princípios essenciais, estratégias e estudos de caso relevantes para ${dto.topic}.`;

      if (i === 1) {
        title = `Capítulo 1: Introdução e Visão Geral de ${dto.topic}`;
        summary = `Apresentação dos conceitos fundamentais, contexto histórico e a relevância estratégica de ${dto.topic} no cenário contemporâneo.`;
      } else if (i === count) {
        title = `Capítulo ${count}: Conclusão, Tendências Futuras e Plano de Ação`;
        summary = `Síntese executiva dos aprendizados, visão de longo prazo e roteiro prático para aplicação imediata.`;
      } else {
        const aspectList = [
          'Princípios Estruturantes e Modelos Mentais',
          'Metodologias de Diagnóstico e Planeamento',
          'Ferramentas, Processos e Arquitetura Prática',
          'Execução Operacional Passo a Passo',
          'Métricas de Desempenho, KPIs e Validação',
          'Gestão de Riscos, Ética e Conformidade',
          'Otimização Contínua e Escala Organizacional',
          'Estudos de Caso Reais e Lições Aprendidas',
        ];
        const aspect = aspectList[(i - 2) % aspectList.length];
        title = `Capítulo ${i}: ${aspect} em ${dto.topic}`;
        summary = `Desenvolvimento analítico e prático sobre ${aspect.toLowerCase()} aplicados a ${dto.topic}, com foco em resultados mensuráveis.`;
      }

      chapters.push({
        position: i,
        partPosition,
        title,
        summary,
        targetWordCount: wordsPerChapter,
      });
    }

    return {
      title: `${dto.topic}: O Guia Definitivo`,
      subtitle: `Estratégias Práticas, Arquitetura e Fundamentos para Dominar ${dto.topic}`,
      synopsis: `Uma obra editorial estruturada em ${dto.targetPages} páginas (${partsCount} partes e ${count} capítulos, ~${totalWordCount.toLocaleString('pt-PT')} palavras) concebida para oferecer clareza, profundidade e aplicabilidade prática sobre ${dto.topic}.`,
      targetAudience: audience,
      objective,
      tone,
      depth,
      editorialStyle,
      targetPages: dto.targetPages,
      totalWordCount,
      parts,
      chapters,
    };
  }
}
