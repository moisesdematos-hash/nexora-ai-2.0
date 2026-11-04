import { Injectable } from '@nestjs/common';
import { DesignEngineService } from './design-engine.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSZip = require('jszip');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfmake = require('pdfmake');

@Injectable()
export class PresentationExportService {
  private fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  constructor(private readonly designEngine: DesignEngineService) {}

  private escapeXml(str: string): string {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generates a Widescreen 16:9 PDF Presentation Deck
   */
  async generatePdf(presentation: any): Promise<Buffer> {
    pdfmake.setFonts(this.fonts);
    pdfmake.setUrlAccessPolicy(() => false);
    pdfmake.setLocalAccessPolicy((p: string) => p.startsWith('Helvetica'));

    const theme = this.designEngine.getThemeById(presentation.theme);
    const slides: any[] = presentation.slides || [];
    const content: any[] = [];

    slides.forEach((slide, idx) => {
      const c = slide.content || {};
      const layout = c.layout || 'TITLE_AND_TEXT';

      const slideBlock: any[] = [
        // Badge
        {
          text: `${c.badge || `SLIDE ${idx + 1} • ${layout}`}   |   TEMA: ${theme.name.toUpperCase()}`,
          fontSize: 9,
          bold: true,
          color: theme.colors.accent,
          margin: [0, 0, 0, 10],
        },
        // Slide Title
        {
          text: slide.title || `Slide ${idx + 1}`,
          fontSize: layout === 'COVER' ? 32 : 24,
          bold: true,
          color: theme.colors.text,
          margin: [0, 0, 0, 8],
        },
        // Subtitle
        c.subtitle
          ? {
              text: c.subtitle,
              fontSize: 13,
              color: theme.colors.textMuted,
              margin: [0, 0, 0, 18],
            }
          : { text: '', margin: [0, 0, 0, 10] },
      ];

      // Layout-specific visual blocks in PDF
      if (layout === 'STATISTICS' && Array.isArray(c.metrics)) {
        slideBlock.push({
          columns: c.metrics.map((m: any) => ({
            stack: [
              { text: m.value, fontSize: 28, bold: true, color: theme.colors.accent },
              { text: m.label, fontSize: 12, bold: true, color: theme.colors.text, margin: [0, 4, 0, 2] },
              { text: m.delta || m.description || '', fontSize: 10, color: theme.colors.textMuted },
            ],
            margin: [0, 15, 15, 15],
          })),
        });
      } else if (
        (layout === 'THREE_COLUMNS' || layout === 'TWO_COLUMNS') &&
        Array.isArray(c.columns)
      ) {
        const cols = layout === 'TWO_COLUMNS' ? c.columns.slice(0, 2) : c.columns;
        slideBlock.push({
          columns: cols.map((col: any) => ({
            stack: [
              { text: col.title, fontSize: 14, bold: true, color: theme.colors.accent, margin: [0, 0, 0, 6] },
              { text: col.body, fontSize: 11, color: theme.colors.text, lineHeight: 1.4 },
            ],
            margin: [0, 10, 15, 10],
          })),
        });
      } else if (layout === 'COMPARISON' && c.comparison) {
        slideBlock.push({
          columns: [
            {
              stack: [
                { text: c.comparison.optionA?.title || 'Cenário A', fontSize: 14, bold: true, color: theme.colors.textMuted, margin: [0, 0, 0, 8] },
                { ul: c.comparison.optionA?.points || [], fontSize: 11, color: theme.colors.text, lineHeight: 1.4 },
              ],
            },
            {
              stack: [
                { text: c.comparison.optionB?.title || 'Cenário B (NEXORA)', fontSize: 14, bold: true, color: theme.colors.accent, margin: [0, 0, 0, 8] },
                { ul: c.comparison.optionB?.points || [], fontSize: 11, color: theme.colors.text, lineHeight: 1.4 },
              ],
            },
          ],
          columnGap: 30,
        });
      } else if (Array.isArray(c.bullets) && c.bullets.length > 0) {
        slideBlock.push({
          ul: c.bullets.map((b: string) => ({
            text: b,
            fontSize: 13,
            color: theme.colors.text,
            margin: [0, 6, 0, 6],
          })),
          margin: [0, 10, 0, 15],
        });
      } else if (Array.isArray(c.paragraphs)) {
        c.paragraphs.forEach((p: string) => {
          slideBlock.push({
            text: p,
            fontSize: 12,
            color: theme.colors.text,
            lineHeight: 1.5,
            margin: [0, 0, 0, 10],
          });
        });
      }

      if (slide.speakerNotes) {
        slideBlock.push({
          text: `Notas do Apresentador: ${slide.speakerNotes}`,
          fontSize: 9,
          italics: true,
          color: theme.colors.textMuted,
          margin: [0, 25, 0, 0],
        });
      }

      if (idx < slides.length - 1) {
        slideBlock.push({ text: '', pageBreak: 'after' });
      }

      content.push(...slideBlock);
    });

    const docDefinition: any = {
      pageSize: { width: 960, height: 540 },
      pageMargins: [60, 55, 60, 45],
      background: () => ({
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 960,
            h: 540,
            color: theme.colors.background,
          },
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 960,
            h: 6,
            color: theme.colors.primary,
          },
        ],
      }),
      defaultStyle: {
        font: 'Helvetica',
        color: theme.colors.text,
      },
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          {
            text: presentation.title || 'NEXORA PRESENTATIONS',
            fontSize: 9,
            color: theme.colors.textMuted,
            margin: [60, 0, 0, 0],
          },
          {
            text: `Slide ${currentPage} / ${pageCount}`,
            alignment: 'right',
            fontSize: 9,
            bold: true,
            color: theme.colors.accent,
            margin: [0, 0, 60, 0],
          },
        ],
      }),
      content,
    };

    const pdfDoc = pdfmake.createPdf(docDefinition);
    const buffer = await pdfDoc.getBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Generates a valid OpenXML PowerPoint (.pptx) Presentation Archive
   */
  async generatePptx(presentation: any): Promise<Buffer> {
    const zip = new JSZip();
    const slides: any[] = presentation.slides || [];
    const theme = this.designEngine.getThemeById(presentation.theme);

    // 1. [Content_Types].xml
    const slideOverrides = slides
      .map(
        (_, i) =>
          `  <Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`,
      )
      .join('\n');

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
${slideOverrides}
</Types>`;
    zip.file('[Content_Types].xml', contentTypesXml);

    // 2. _rels/.rels
    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;
    zip.file('_rels/.rels', rootRels);

    // 3. ppt/_rels/presentation.xml.rels
    const presRelsItems = slides
      .map(
        (_, i) =>
          `  <Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`,
      )
      .join('\n');

    const presRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${presRelsItems}
</Relationships>`;
    zip.file('ppt/_rels/presentation.xml.rels', presRelsXml);

    // 4. ppt/presentation.xml (16:9 Widescreen 12192000 x 6858000 EMUs)
    const sldIdLst = slides
      .map(
        (_, i) => `    <p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`,
      )
      .join('\n');

    const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
${sldIdLst}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;
    zip.file('ppt/presentation.xml', presentationXml);

    // 5. ppt/slides/slide1..N.xml
    const bgHex = theme.colors.background.replace('#', '');
    const textHex = theme.colors.text.replace('#', '');
    const accentHex = theme.colors.accent.replace('#', '');

    slides.forEach((slide, idx) => {
      const slideNum = idx + 1;
      const c = slide.content || {};
      const titleText = this.escapeXml(slide.title || `Slide ${slideNum}`);
      const badgeText = this.escapeXml(c.badge || `SLIDE ${slideNum} • ${c.layout || 'NEXORA'}`);
      const bullets: string[] = Array.isArray(c.bullets)
        ? c.bullets
        : Array.isArray(c.paragraphs)
        ? c.paragraphs
        : [c.subtitle || 'Conteúdo gerado pelo NEXORA Presentation Engine'];

      const bulletParagraphsXml = bullets
        .map(
          (b: string) => `          <a:p>
            <a:r>
              <a:rPr lang="pt-PT" sz="1800">
                <a:solidFill><a:srgbClr val="${textHex}"/></a:solidFill>
              </a:rPr>
              <a:t>• ${this.escapeXml(b)}</a:t>
            </a:r>
          </a:p>`,
        )
        .join('\n');

      const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg>
      <p:bgPr>
        <a:solidFill><a:srgbClr val="${bgHex}"/></a:solidFill>
        <a:effectLst/>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr/>
      <!-- Title Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="685800" y="457200"/>
            <a:ext cx="10820400" cy="1371600"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:rPr lang="pt-PT" sz="1100" b="1">
                <a:solidFill><a:srgbClr val="${accentHex}"/></a:solidFill>
              </a:rPr>
              <a:t>${badgeText}</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:r>
              <a:rPr lang="pt-PT" sz="3200" b="1">
                <a:solidFill><a:srgbClr val="${textHex}"/></a:solidFill>
              </a:rPr>
              <a:t>${titleText}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <!-- Content Body Shape -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="685800" y="2057400"/>
            <a:ext cx="10820400" cy="4114800"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
${bulletParagraphsXml}
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`;

      zip.file(`ppt/slides/slide${slideNum}.xml`, slideXml);
    });

    return zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
  }
}
