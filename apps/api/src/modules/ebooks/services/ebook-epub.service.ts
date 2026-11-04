import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSZip = require('jszip');

@Injectable()
export class EbookEpubService {
  private escapeXml(str: string): string {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generates a valid EPUB 3.0 binary Buffer from a Book entity
   */
  async generateEpub(book: any): Promise<Buffer> {
    const zip = new JSZip();

    // 1. OCF Mimetype (must be first, uncompressed STORE)
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // 2. META-INF/container.xml
    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    zip.file('META-INF/container.xml', containerXml);

    const title = this.escapeXml(book.title || 'E-book NEXORA AI');
    const subtitle = this.escapeXml(book.subtitle || '');
    const author = this.escapeXml(book.author || book.config?.author || 'NEXORA AI Studio');
    const language = this.escapeXml(book.language || 'pt');
    const bookUid = `urn:uuid:nexora-${book.id || Date.now()}`;
    const modifiedDate = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    const chapters: any[] = book.chapters || [];

    // 3. OEBPS/styles.css
    const css = `body {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.65;
  color: #1e293b;
  margin: 5%;
}
h1 {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1.8em;
  color: #0f172a;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  border-bottom: 2px solid #7c3aed;
  padding-bottom: 0.3em;
}
h2 {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1.25em;
  color: #334155;
  margin-top: 1.4em;
  margin-bottom: 0.4em;
}
p {
  text-align: justify;
  margin-top: 0;
  margin-bottom: 1em;
}
.cover-box {
  text-align: center;
  padding: 3em 1em;
  background: #0f172a;
  color: #f8fafc;
  border-radius: 8px;
}
.cover-badge {
  color: #a855f7;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 0.85em;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.cover-title {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 2.2em;
  color: #ffffff;
  border: none;
  margin: 0.6em 0 0.3em 0;
}
.cover-subtitle {
  font-size: 1.1em;
  color: #cbd5e1;
  margin-bottom: 2em;
}
.cover-author {
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  color: #38bdf8;
}`;
    zip.file('OEBPS/styles.css', css);

    // 4. OEBPS/cover.xhtml
    const coverXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
  <section class="cover-box" epub:type="cover">
    <div class="cover-badge">NEXORA EBOOK STUDIO</div>
    <h1 class="cover-title">${title}</h1>
    ${subtitle ? `<p class="cover-subtitle">${subtitle}</p>` : ''}
    <p class="cover-author">${author}</p>
  </section>
</body>
</html>`;
    zip.file('OEBPS/cover.xhtml', coverXhtml);

    // 5. OEBPS/toc.xhtml (EPUB 3 Navigation Document)
    const tocItems = chapters
      .map(
        (ch, idx) =>
          `      <li><a href="chapter-${idx + 1}.xhtml">Capítulo ${ch.position || idx + 1}: ${this.escapeXml(ch.title)}</a></li>`,
      )
      .join('\n');

    const tocXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
<head>
  <meta charset="UTF-8" />
  <title>Sumário — ${title}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Sumário</h1>
    <ol>
      <li><a href="cover.xhtml">Capa</a></li>
${tocItems}
    </ol>
  </nav>
</body>
</html>`;
    zip.file('OEBPS/toc.xhtml', tocXhtml);

    // 6. Chapter XHTML files
    const manifestItems: string[] = [
      '    <item id="css" href="styles.css" media-type="text/css"/>',
      '    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>',
      '    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    ];
    const spineItems: string[] = [
      '    <itemref idref="cover"/>',
      '    <itemref idref="toc"/>',
    ];

    chapters.forEach((ch, idx) => {
      const chapNum = idx + 1;
      const chapId = `chapter-${chapNum}`;
      const chapFile = `${chapId}.xhtml`;
      const chapTitle = this.escapeXml(ch.title || `Capítulo ${chapNum}`);

      const sectionsHtml =
        ch.sections && ch.sections.length > 0
          ? ch.sections
              .map((sec: any) => {
                const secTitle = sec.title ? `<h2>${this.escapeXml(sec.title)}</h2>` : '';
                const paragraphs = (sec.content || '')
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((p: string) => `<p>${this.escapeXml(p)}</p>`)
                  .join('\n');
                return `${secTitle}\n${paragraphs}`;
              })
              .join('\n\n')
          : `<p>${this.escapeXml(ch.summary || 'Conteúdo em elaboração.')}</p>`;

      const chapterXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${language}">
<head>
  <meta charset="UTF-8" />
  <title>${chapTitle}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
  <section epub:type="chapter">
    <h1>Capítulo ${ch.position || chapNum}: ${chapTitle}</h1>
    ${sectionsHtml}
  </section>
</body>
</html>`;

      zip.file(`OEBPS/${chapFile}`, chapterXhtml);
      manifestItems.push(
        `    <item id="${chapId}" href="${chapFile}" media-type="application/xhtml+xml"/>`,
      );
      spineItems.push(`    <itemref idref="${chapId}"/>`);
    });

    // 7. OEBPS/content.opf (EPUB 3.0 Package Document)
    const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId" xml:lang="${language}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">${bookUid}</dc:identifier>
    <dc:title>${title}</dc:title>
    <dc:creator>${author}</dc:creator>
    <dc:language>${language}</dc:language>
    <dc:publisher>NEXORA AI Publishing Studio</dc:publisher>
    <meta property="dcterms:modified">${modifiedDate}</meta>
  </metadata>
  <manifest>
${manifestItems.join('\n')}
  </manifest>
  <spine>
${spineItems.join('\n')}
  </spine>
</package>`;
    zip.file('OEBPS/content.opf', contentOpf);

    return zip.generateAsync({
      type: 'nodebuffer',
      mimeType: 'application/epub+zip',
      compression: 'DEFLATE',
    });
  }
}
