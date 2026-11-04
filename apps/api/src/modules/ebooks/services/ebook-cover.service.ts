import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateCoverDto } from '../dto/ebook.dto';

export interface CoverPresetTheme {
  id: string;
  name: string;
  bgStart: string;
  bgEnd: string;
  accent: string;
  textColor: string;
  badgeBg: string;
}

const COVER_PRESETS: Record<string, CoverPresetTheme> = {
  CORPORATE_EXECUTIVE: {
    id: 'CORPORATE_EXECUTIVE',
    name: 'Executivo Corporativo',
    bgStart: '#0F172A',
    bgEnd: '#1E3A8A',
    accent: '#38BDF8',
    textColor: '#F8FAFC',
    badgeBg: '#1D4ED8',
  },
  MINIMALIST_MODERN: {
    id: 'MINIMALIST_MODERN',
    name: 'Minimalista Editorial',
    bgStart: '#FAFAFA',
    bgEnd: '#E2E8F0',
    accent: '#7C3AED',
    textColor: '#0F172A',
    badgeBg: '#EDE9FE',
  },
  ACADEMIC_CLASSIC: {
    id: 'ACADEMIC_CLASSIC',
    name: 'Académico Clássico',
    bgStart: '#1E1B4B',
    bgEnd: '#312E81',
    accent: '#F59E0B',
    textColor: '#FFFFFF',
    badgeBg: '#4338CA',
  },
  TECH_FUTURISTIC: {
    id: 'TECH_FUTURISTIC',
    name: 'Tecnológico & IA',
    bgStart: '#090D16',
    bgEnd: '#2E1065',
    accent: '#A855F7',
    textColor: '#F3E8FF',
    badgeBg: '#4C1D95',
  },
  CREATIVE_VIBRANT: {
    id: 'CREATIVE_VIBRANT',
    name: 'Criativo Vibrante',
    bgStart: '#4C1D95',
    bgEnd: '#BE185D',
    accent: '#FBBF24',
    textColor: '#FFFFFF',
    badgeBg: '#831843',
  },
  LUXURY_EDITORIAL: {
    id: 'LUXURY_EDITORIAL',
    name: 'Premium Gold',
    bgStart: '#18181B',
    bgEnd: '#27272A',
    accent: '#D4AF37',
    textColor: '#FAFAFA',
    badgeBg: '#3F3F46',
  },
};

@Injectable()
export class EbookCoverService {
  constructor(private readonly prisma: PrismaService) {}

  getPresets(): CoverPresetTheme[] {
    return Object.values(COVER_PRESETS);
  }

  private escapeXml(str: string): string {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private wrapLines(text: string, maxCharsPerLine: number, maxLines: number): string[] {
    const words = (text || '').split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
        if (lines.length >= maxLines - 1) break;
      }
    }
    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }
    return lines;
  }

  /**
   * Generates a high-resolution editorial SVG cover (encoded as DataURL)
   * and saves it to the Book record and BookAsset table.
   */
  async generateCover(bookId: string, dto: GenerateCoverDto): Promise<any> {
    const book = await this.prisma.client.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    const styleKey = dto.style || 'CORPORATE_EXECUTIVE';
    const preset = COVER_PRESETS[styleKey] || COVER_PRESETS.CORPORATE_EXECUTIVE!;
    const bgStart = dto.primaryColor || preset.bgStart;
    const bgEnd = preset.bgEnd;
    const accent = dto.accentColor || preset.accent;
    const textColor = preset.textColor;

    const config: any = book.config || {};
    const authorName = config.author || 'NEXORA Editorial Studio';
    const badge = dto.badgeText || 'EDIÇÃO ESPECIAL NEXORA AI';
    const subtitleText = dto.customSubtitle || book.subtitle || '';

    const titleLines = this.wrapLines(book.title, 22, 4);
    const subtitleLines = this.wrapLines(subtitleText, 34, 3);

    const titleTspans = titleLines
      .map(
        (line, i) =>
          `<tspan x="80" dy="${i === 0 ? 0 : 62}">${this.escapeXml(line)}</tspan>`,
      )
      .join('');

    const subtitleY = 440 + titleLines.length * 62;
    const subtitleTspans = subtitleLines
      .map(
        (line, i) =>
          `<tspan x="80" dy="${i === 0 ? 0 : 34}">${this.escapeXml(line)}</tspan>`,
      )
      .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStart}" />
      <stop offset="100%" stop-color="${bgEnd}" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.2" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="1200" fill="url(#bgGrad)" />

  <!-- Editorial Geometric Artwork -->
  <circle cx="720" cy="180" r="280" fill="${accent}" opacity="0.08" />
  <circle cx="80" cy="1050" r="340" fill="${accent}" opacity="0.06" />
  <rect x="60" y="60" width="680" height="1080" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.3" rx="8" />

  <!-- Top Accent Line & Badge -->
  <rect x="80" y="130" width="90" height="6" fill="${accent}" rx="3" />
  <text x="80" y="175" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="${accent}" letter-spacing="3">
    ${this.escapeXml(badge.toUpperCase())}
  </text>

  <!-- Book Title -->
  <text x="80" y="380" font-family="Helvetica, Arial, sans-serif" font-size="52" font-weight="bold" fill="${textColor}">
    ${titleTspans}
  </text>

  <!-- Divider -->
  <rect x="80" y="${subtitleY - 45}" width="180" height="4" fill="url(#accentGrad)" rx="2" />

  <!-- Book Subtitle -->
  <text x="80" y="${subtitleY}" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${textColor}" opacity="0.82">
    ${subtitleTspans}
  </text>

  <!-- Author Footer -->
  <text x="80" y="1035" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="bold" fill="${accent}" letter-spacing="2">
    AUTOR / ORGANIZAÇÃO
  </text>
  <text x="80" y="1070" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="${textColor}">
    ${this.escapeXml(authorName)}
  </text>
</svg>`;

    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf-8').toString('base64')}`;

    const updatedConfig = {
      ...config,
      coverStyle: styleKey,
      primaryColor: bgStart,
      accentColor: accent,
      badgeText: badge,
    };

    const updatedBook = await this.prisma.client.book.update({
      where: { id: bookId },
      data: {
        coverUrl: dataUrl,
        config: updatedConfig,
      },
    });

    if ((this.prisma.client as any).bookAsset) {
      try {
        await (this.prisma.client as any).bookAsset.create({
          data: {
            bookId,
            type: 'IMAGE',
            name: `Capa Editorial (${preset.name})`,
            url: dataUrl,
            mimeType: 'image/svg+xml',
            size: svg.length,
            metadata: { style: styleKey, presetName: preset.name },
          },
        });
      } catch {
        // Non-blocking
      }
    }

    return {
      bookId,
      coverUrl: dataUrl,
      style: styleKey,
      presetName: preset.name,
      config: updatedConfig,
      book: updatedBook,
    };
  }
}
