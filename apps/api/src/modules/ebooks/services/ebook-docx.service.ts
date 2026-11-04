import { Injectable } from '@nestjs/common';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
} from 'docx';

@Injectable()
export class EbookDocxService {
  /**
   * Generates a Microsoft Word (.docx) binary Buffer from a Book entity
   */
  async generateDocx(book: any): Promise<Buffer> {
    const title = book.title || 'E-book NEXORA AI';
    const subtitle = book.subtitle || '';
    const author = book.author || book.config?.author || 'NEXORA AI Studio';
    const targetPages = book.config?.targetPages || 10;
    const chapters: any[] = book.chapters || [];

    const children: Paragraph[] = [
      // ==========================================
      // CAPA (PÁGINA 1)
      // ==========================================
      new Paragraph({
        spacing: { before: 2400, after: 400 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'NEXORA EBOOK STUDIO',
            bold: true,
            size: 20,
            color: '7C3AED',
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 200, after: 300 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 56,
            color: '0F172A',
          }),
        ],
      }),
    ];

    if (subtitle) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 800 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: subtitle,
              italics: true,
              size: 28,
              color: '475569',
            }),
          ],
        }),
      );
    }

    children.push(
      new Paragraph({
        spacing: { before: 1200, after: 200 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Autor: ${author}`,
            bold: true,
            size: 26,
            color: '1E293B',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Meta Editorial: ${targetPages} páginas • ${book.currentWordCount || 0} palavras`,
            size: 20,
            color: '64748B',
          }),
          new PageBreak(),
        ],
      }),

      // ==========================================
      // SUMÁRIO / ÍNDICE (PÁGINA 2)
      // ==========================================
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 400 },
        children: [
          new TextRun({
            text: 'SUMÁRIO EDITORIAL',
            bold: true,
            size: 36,
            color: '0F172A',
          }),
        ],
      }),
    );

    chapters.forEach((ch, idx) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          children: [
            new TextRun({
              text: `Capítulo ${ch.position || idx + 1}: `,
              bold: true,
              size: 24,
              color: '7C3AED',
            }),
            new TextRun({
              text: ch.title || `Capítulo ${idx + 1}`,
              bold: true,
              size: 24,
              color: '1E293B',
            }),
          ],
        }),
      );
    });

    children.push(
      new Paragraph({
        children: [new PageBreak()],
      }),
    );

    // ==========================================
    // CAPÍTULOS E SECÇÕES
    // ==========================================
    chapters.forEach((ch, idx) => {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: `CAPÍTULO ${ch.position || idx + 1}`,
              bold: true,
              size: 20,
              color: '7C3AED',
            }),
          ],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 100, after: 300 },
          children: [
            new TextRun({
              text: ch.title || `Capítulo ${idx + 1}`,
              bold: true,
              size: 36,
              color: '0F172A',
            }),
          ],
        }),
      );

      if (ch.sections && ch.sections.length > 0) {
        ch.sections.forEach((sec: any) => {
          if (sec.title) {
            children.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 260, after: 140 },
                children: [
                  new TextRun({
                    text: sec.title,
                    bold: true,
                    size: 28,
                    color: '1E293B',
                  }),
                ],
              }),
            );
          }

          const paragraphs = (sec.content || '').split(/\n+/).filter(Boolean);
          paragraphs.forEach((pText: string) => {
            children.push(
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { before: 100, after: 180, line: 340 },
                children: [
                  new TextRun({
                    text: pText,
                    size: 23,
                    color: '1E293B',
                  }),
                ],
              }),
            );
          });
        });
      } else {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 200 },
            children: [
              new TextRun({
                text: ch.summary || 'Conteúdo em fase de elaboração.',
                italics: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),
        );
      }

      if (idx < chapters.length - 1) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          }),
        );
      }
    });

    const doc = new Document({
      creator: author,
      title,
      description: subtitle,
      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: title,
                      size: 16,
                      color: '94A3B8',
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      children: ['Página ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES],
                      size: 18,
                      color: '64748B',
                    }),
                  ],
                }),
              ],
            }),
          },
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return Buffer.from(buffer);
  }
}
