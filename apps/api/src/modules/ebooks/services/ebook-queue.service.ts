import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EbookWriterService } from './ebook-writer.service';

export interface BookQueueJobState {
  jobId: string;
  bookId: string;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  totalChapters: number;
  completedChapters: number;
  currentChapterPosition: number | null;
  currentChapterTitle: string | null;
  progressPercent: number;
  checkpointsSaved: number;
  lastCheckpointAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  error?: string;
}

@Injectable()
export class EbookQueueService {
  private activeJobs = new Map<string, BookQueueJobState>();
  private pauseFlags = new Set<string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly writer: EbookWriterService,
  ) {}

  /**
   * Returns current queue generation status and checkpoint metrics for a book
   */
  async getJobStatus(bookId: string): Promise<BookQueueJobState> {
    const existing = this.activeJobs.get(bookId);
    if (existing && existing.status === 'RUNNING') {
      return existing;
    }

    const book = await this.prisma.client.book.findUnique({
      where: { id: bookId },
      include: {
        chapters: { orderBy: { position: 'asc' } },
        versions: { orderBy: { version: 'desc' }, take: 5 },
      },
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    const total = book.chapters.length || 1;
    const completed = book.chapters.filter((c) => c.status === 'READY').length;
    const progressPercent = Math.round((completed / total) * 100);
    const checkpointsCount = book.versions?.length || 0;
    const lastVersion = book.versions?.[0];

    const state: BookQueueJobState = {
      jobId: existing?.jobId || `job_${bookId}`,
      bookId,
      status:
        existing?.status ||
        (completed === total && total > 0 ? 'COMPLETED' : completed > 0 ? 'PAUSED' : 'IDLE'),
      totalChapters: total,
      completedChapters: completed,
      currentChapterPosition: existing?.currentChapterPosition || null,
      currentChapterTitle: existing?.currentChapterTitle || null,
      progressPercent,
      checkpointsSaved: checkpointsCount,
      lastCheckpointAt: lastVersion?.createdAt
        ? new Date(lastVersion.createdAt).toISOString()
        : existing?.lastCheckpointAt || null,
      startedAt: existing?.startedAt || null,
      completedAt: existing?.completedAt || null,
      error: existing?.error,
    };

    return state;
  }

  /**
   * Starts or resumes incremental batch generation of all pending chapters
   * with checkpoint persistence after each chapter.
   */
  async startOrResumeBatchGeneration(
    bookId: string,
    options?: { synchronousForTest?: boolean },
  ): Promise<BookQueueJobState> {
    const book = await this.prisma.client.book.findUnique({
      where: { id: bookId },
      include: {
        chapters: { orderBy: { position: 'asc' } },
      },
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    this.pauseFlags.delete(bookId);

    const total = book.chapters.length;
    const completed = book.chapters.filter((c) => c.status === 'READY').length;
    const pendingChapters = book.chapters.filter((c) => c.status !== 'READY');

    const jobState: BookQueueJobState = {
      jobId: `job_${bookId}_${Date.now()}`,
      bookId,
      status: pendingChapters.length === 0 ? 'COMPLETED' : 'RUNNING',
      totalChapters: total,
      completedChapters: completed,
      currentChapterPosition: pendingChapters[0]?.position || null,
      currentChapterTitle: pendingChapters[0]?.title || null,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 100,
      checkpointsSaved: completed,
      lastCheckpointAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      completedAt: pendingChapters.length === 0 ? new Date().toISOString() : null,
    };

    this.activeJobs.set(bookId, jobState);

    const runWorker = async () => {
      try {
        for (const ch of pendingChapters) {
          if (this.pauseFlags.has(bookId)) {
            jobState.status = 'PAUSED';
            jobState.currentChapterPosition = ch.position;
            jobState.currentChapterTitle = `Pausado antes de: ${ch.title}`;
            return;
          }

          jobState.currentChapterPosition = ch.position;
          jobState.currentChapterTitle = ch.title;

          await this.writer.generateChapterContent(bookId, ch.id);

          jobState.completedChapters += 1;
          jobState.checkpointsSaved += 1;
          jobState.lastCheckpointAt = new Date().toISOString();
          jobState.progressPercent = Math.round(
            (jobState.completedChapters / Math.max(1, jobState.totalChapters)) * 100,
          );
        }

        jobState.status = 'COMPLETED';
        jobState.currentChapterPosition = null;
        jobState.currentChapterTitle = null;
        jobState.completedAt = new Date().toISOString();

        await this.prisma.client.book.update({
          where: { id: bookId },
          data: { status: 'READY' },
        });
      } catch (err: any) {
        jobState.status = 'FAILED';
        jobState.error = err?.message || 'Erro durante geração em fila';
      }
    };

    if (options?.synchronousForTest) {
      await runWorker();
    } else {
      // Run asynchronously in background worker loop
      setImmediate(() => {
        runWorker().catch(() => {});
      });
    }

    return jobState;
  }

  /**
   * Pauses an active batch generation job at the next chapter boundary checkpoint
   */
  async pauseGeneration(bookId: string): Promise<BookQueueJobState> {
    this.pauseFlags.add(bookId);
    const current = this.activeJobs.get(bookId);
    if (current) {
      current.status = 'PAUSED';
    }
    return this.getJobStatus(bookId);
  }
}
