import { Injectable } from '@nestjs/common';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfmake = require('pdfmake');

@Injectable()
export class EbookPdfService {
  private fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  /**
   * Generates a PDF buffer from a book structure
   */
  async generatePdf(book: any): Promise<Buffer> {
    pdfmake.setFonts(this.fonts);
    pdfmake.setUrlAccessPolicy(() => false);
    pdfmake.setLocalAccessPolicy((p: string) => p.startsWith('Helvetica'));

    const docDefinition: TDocumentDefinitions = {
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.4,
        color: '#1E293B',
      },
      pageMargins: [50, 60, 50, 60],
      header: (currentPage) => {
        if (currentPage <= 2) return null; // No header on cover and TOC
        return {
          text: book.title || 'NEXORA EBOOK',
          alignment: 'center',
          fontSize: 8,
          color: '#94A3B8',
          margin: [0, 25, 0, 0],
        };
      },
      footer: (currentPage, pageCount) => {
        if (currentPage === 1) return null; // No footer on cover
        return {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: 'center',
          fontSize: 9,
          color: '#64748B',
          margin: [0, 0, 0, 20],
        };
      },
      content: [
        // ==========================================
        // CAPA DO LIVRO (PÁGINA 1)
        // ==========================================
        {
          text: '',
          margin: [0, 100, 0, 0],
        },
        {
          text: 'NEXORA AI  •  PUBLICAÇÃO DIGITAL',
          fontSize: 10,
          bold: true,
          color: '#7C3AED',
          characterSpacing: 2,
          margin: [0, 0, 0, 20],
        },
        {
          text: book.title || 'Título do Livro',
          fontSize: 32,
          bold: true,
          color: '#0F172A',
          lineHeight: 1.2,
          margin: [0, 0, 0, 10],
        },
        {
          text: book.subtitle || 'Subtítulo da obra',
          fontSize: 16,
          color: '#475569',
          margin: [0, 0, 0, 40],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 200,
              y2: 0,
              lineWidth: 3,
              lineColor: '#2563EB',
            },
          ],
          margin: [0, 0, 0, 40],
        },
        {
          text: `Autor: ${book.author || 'NEXORA Studio AI'}`,
          fontSize: 12,
          bold: true,
          color: '#1E293B',
          margin: [0, 0, 0, 5],
        },
        {
          text: `Idioma: ${(book.language || 'pt').toUpperCase()}  •  Edição 2.0`,
          fontSize: 10,
          color: '#64748B',
        },

        // ==========================================
        // PÁGINA 2: ÍNDICE / SUMÁRIO
        // ==========================================
        {
          text: '',
          pageBreak: 'before',
        },
        {
          text: 'ÍNDICE GERAL',
          fontSize: 18,
          bold: true,
          color: '#0F172A',
          margin: [0, 20, 0, 25],
        },
        ...((book.chapters || []).map((ch: any) => ({
          columns: [
            {
              text: ch.title,
              fontSize: 11,
              bold: true,
              color: '#1E293B',
              width: '*',
            },
            {
              text: `Capítulo ${ch.position}`,
              fontSize: 10,
              color: '#7C3AED',
              alignment: 'right',
              width: 'auto',
            },
          ],
          margin: [0, 6, 0, 6],
        }))),

        // ==========================================
        // CAPÍTULOS E CONTEÚDOS
        // ==========================================
        ...((book.chapters || []).flatMap((ch: any) => {
          const chapterContent: any[] = [
            {
              text: '',
              pageBreak: 'before',
            },
            {
              text: `CAPÍTULO ${ch.position}`,
              fontSize: 10,
              bold: true,
              color: '#7C3AED',
              characterSpacing: 1.5,
              margin: [0, 10, 0, 5],
            },
            {
              text: ch.title,
              fontSize: 22,
              bold: true,
              color: '#0F172A',
              margin: [0, 0, 0, 15],
            },
          ];

          if (ch.summary) {
            chapterContent.push({
              text: ch.summary,
              fontSize: 11,
              italics: true,
              color: '#475569',
              margin: [0, 0, 0, 20],
            });
          }

          if (ch.sections && ch.sections.length > 0) {
            ch.sections.forEach((sec: any) => {
              if (sec.title) {
                chapterContent.push({
                  text: sec.title,
                  fontSize: 13,
                  bold: true,
                  color: '#1E293B',
                  margin: [0, 15, 0, 8],
                });
              }
              chapterContent.push({
                text: sec.content || '',
                fontSize: 10.5,
                lineHeight: 1.5,
                alignment: 'justify',
                margin: [0, 0, 0, 12],
              });
            });
          } else {
            chapterContent.push({
              text: 'Conteúdo em fase de elaboração com IA...',
              fontSize: 10,
              italics: true,
              color: '#94A3B8',
            });
          }

          return chapterContent;
        })),
      ],
    };

    const pdfDoc = pdfmake.createPdf(docDefinition);
    const buffer = await pdfDoc.getBuffer();
    return Buffer.from(buffer);
  }
}
