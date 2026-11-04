import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EbookPlannerService, PlannedBookOutline } from './services/ebook-planner.service';
import { EbookWriterService } from './services/ebook-writer.service';
import { EbookPdfService } from './services/ebook-pdf.service';
import { EbookQueueService, BookQueueJobState } from './services/ebook-queue.service';
import { EbookReviewService, EditorialReviewReport } from './services/ebook-review.service';
import { EbookCoverService } from './services/ebook-cover.service';
import { EbookEpubService } from './services/ebook-epub.service';
import { EbookDocxService } from './services/ebook-docx.service';
import {
  GenerateOutlineDto,
  CreateBookDto,
  UpdateChapterDto,
  GenerateCoverDto,
  UpdateDesignConfigDto,
} from './dto/ebook.dto';

@Injectable()
export class EbooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly planner: EbookPlannerService,
    private readonly writer: EbookWriterService,
    private readonly pdfService: EbookPdfService,
    private readonly queueService: EbookQueueService,
    private readonly reviewService: EbookReviewService,
    private readonly coverService: EbookCoverService,
    private readonly epubService: EbookEpubService,
    private readonly docxService: EbookDocxService,
  ) {}

  async planOutline(dto: GenerateOutlineDto): Promise<PlannedBookOutline> {
    return this.planner.generateOutline(dto);
  }

  async createBook(dto: CreateBookDto): Promise<any> {
    const planned =
      dto.outline ||
      (await this.planner.generateOutline({
        topic: dto.title,
        targetPages: dto.targetPages,
        language: dto.language,
      }));

    // Create the Book record
    const book = await this.prisma.client.book.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        subtitle: dto.subtitle || planned.subtitle,
        description: planned.synopsis,
        language: dto.language || 'pt',
        targetWordCount: planned.totalWordCount,
        status: 'OUTLINING',
        config: {
          targetPages: dto.targetPages,
          targetAudience: planned.targetAudience,
          objective: planned.objective,
          tone: planned.tone,
          depth: planned.depth,
          editorialStyle: planned.editorialStyle || 'Executivo Contemporâneo',
          pageFormat: 'A4',
          author: dto.author || 'NEXORA Studio AI',
          includeExamples: true,
          includeExercises: false,
          includeReferences: false,
          ...(dto.config || {}),
        },
      },
    });

    // Save the Outline
    await this.prisma.client.bookOutline.create({
      data: {
        bookId: book.id,
        content: planned,
        approved: true,
      },
    });

    // Save initial Book Memory entries
    await this.prisma.client.bookMemory.createMany({
      data: [
        {
          bookId: book.id,
          key: 'Objetivo Geral',
          value: planned.synopsis || `Livro completo sobre ${dto.title}`,
        },
        {
          bookId: book.id,
          key: 'Público-Alvo',
          value: planned.targetAudience || 'Geral',
        },
        {
          bookId: book.id,
          key: 'Tom de Escrita',
          value: planned.tone || 'Profissional',
        },
      ],
    });

    // Create Parts if defined in outline
    const partMap = new Map<number, string>();
    if (Array.isArray(planned.parts) && (this.prisma.client as any).bookPart) {
      for (const p of planned.parts) {
        try {
          const createdPart = await (this.prisma.client as any).bookPart.create({
            data: {
              bookId: book.id,
              position: p.position,
              title: p.title,
            },
          });
          partMap.set(p.position, createdPart.id);
        } catch {
          // Non-blocking
        }
      }
    }

    // Create Chapters
    for (const ch of planned.chapters) {
      await this.prisma.client.bookChapter.create({
        data: {
          bookId: book.id,
          partId: ch.partPosition ? partMap.get(ch.partPosition) || null : null,
          position: ch.position,
          title: ch.title,
          summary: ch.summary,
          status: 'PENDING',
          wordCount: 0,
        },
      });
    }

    return this.getBookById(book.id);
  }

  async getBookById(id: string): Promise<any> {
    const book = await this.prisma.client.book.findUnique({
      where: { id },
      include: {
        outline: true,
        parts: { orderBy: { position: 'asc' } },
        chapters: {
          orderBy: { position: 'asc' },
          include: { sections: { orderBy: { position: 'asc' } } },
        },
        memories: { orderBy: { createdAt: 'asc' } },
        versions: { orderBy: { version: 'desc' }, take: 10 },
        assets: { orderBy: { createdAt: 'desc' } },
        project: true,
      },
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    return book;
  }

  async getBookByProjectId(projectId: string): Promise<any> {
    const book = await this.prisma.client.book.findFirst({
      where: { projectId },
      include: {
        outline: true,
        parts: { orderBy: { position: 'asc' } },
        chapters: {
          orderBy: { position: 'asc' },
          include: { sections: { orderBy: { position: 'asc' } } },
        },
        memories: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!book) {
      throw new NotFoundException('Nenhum e-book associado a este projeto');
    }

    return book;
  }

  async generateChapter(bookId: string, chapterId: string): Promise<any> {
    return this.writer.generateChapterContent(bookId, chapterId);
  }

  async updateChapter(chapterId: string, dto: UpdateChapterDto): Promise<any> {
    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.summary !== undefined) updateData.summary = dto.summary;

    if (dto.content !== undefined) {
      const wordCount = dto.content.split(/\s+/).filter(Boolean).length;
      updateData.wordCount = wordCount;

      const existingSection = await this.prisma.client.bookSection.findFirst({
        where: { chapterId },
        orderBy: { position: 'asc' },
      });

      if (existingSection) {
        await this.prisma.client.bookSection.update({
          where: { id: existingSection.id },
          data: { content: dto.content, wordCount },
        });
      } else {
        await this.prisma.client.bookSection.create({
          data: {
            chapterId,
            position: 1,
            title: 'Conteúdo Principal',
            content: dto.content,
            status: 'APPROVED',
            wordCount,
          },
        });
      }
    }

    return this.prisma.client.bookChapter.update({
      where: { id: chapterId },
      data: updateData,
      include: { sections: { orderBy: { position: 'asc' } } },
    });
  }

  // ==========================================
  // PHASE 3: QUEUE, CHECKPOINTS, REVIEW, COVER, EXPORTS
  // ==========================================

  async getQueueStatus(bookId: string): Promise<BookQueueJobState> {
    return this.queueService.getJobStatus(bookId);
  }

  async startBatchGeneration(bookId: string): Promise<BookQueueJobState> {
    return this.queueService.startOrResumeBatchGeneration(bookId);
  }

  async pauseBatchGeneration(bookId: string): Promise<BookQueueJobState> {
    return this.queueService.pauseGeneration(bookId);
  }

  async reviewBook(bookId: string): Promise<EditorialReviewReport> {
    return this.reviewService.reviewBook(bookId);
  }

  getCoverPresets(): any[] {
    return this.coverService.getPresets();
  }

  async generateCover(bookId: string, dto: GenerateCoverDto): Promise<any> {
    return this.coverService.generateCover(bookId, dto);
  }

  async updateDesignConfig(bookId: string, dto: UpdateDesignConfigDto): Promise<any> {
    const book = await this.getBookById(bookId);
    const currentConfig: any = book.config || {};
    const updatedConfig = {
      ...currentConfig,
      ...dto,
    };

    return this.prisma.client.book.update({
      where: { id: bookId },
      data: { config: updatedConfig },
    });
  }

  async exportToPdf(bookId: string): Promise<{ buffer: Buffer; filename: string }> {
    const book = await this.getBookById(bookId);
    const buffer = await this.pdfService.generatePdf(book);
    const safeName = (book.title || 'ebook-nexora')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return { buffer, filename: `${safeName}.pdf` };
  }

  async exportToEpub(bookId: string): Promise<{ buffer: Buffer; filename: string }> {
    const book = await this.getBookById(bookId);
    const buffer = await this.epubService.generateEpub(book);
    const safeName = (book.title || 'ebook-nexora')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return { buffer, filename: `${safeName}.epub` };
  }

  async exportToDocx(bookId: string): Promise<{ buffer: Buffer; filename: string }> {
    const book = await this.getBookById(bookId);
    const buffer = await this.docxService.generateDocx(book);
    const safeName = (book.title || 'ebook-nexora')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return { buffer, filename: `${safeName}.docx` };
  }
}
