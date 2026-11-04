import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DocsEngineService,
  DocumentContentSchema,
} from './services/docs-engine.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  AiDocumentCommandDto,
} from './dto/docs.dto';

@Injectable()
export class DocsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: DocsEngineService,
  ) {}

  getTemplates(): any[] {
    return this.engine.getTemplates();
  }

  async listDocuments(): Promise<any[]> {
    return this.prisma.client.document.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { project: true },
    });
  }

  async createDocument(dto: CreateDocumentDto): Promise<any> {
    const { content, wordCount } = this.engine.generateStructuredDocument(dto);

    const existing = await this.prisma.client.document.findUnique({
      where: { projectId: dto.projectId },
    });

    if (existing) {
      return this.prisma.client.document.update({
        where: { id: existing.id },
        data: {
          title: dto.title,
          content: content as any,
          wordCount,
        },
        include: { project: true },
      });
    }

    return this.prisma.client.document.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        content: content as any,
        wordCount,
      },
      include: { project: true },
    });
  }

  async getDocumentById(id: string): Promise<any> {
    let doc = await this.prisma.client.document.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!doc) {
      doc = await this.prisma.client.document.findUnique({
        where: { projectId: id },
        include: { project: true },
      });
    }

    if (!doc) {
      throw new NotFoundException('Documento não encontrado');
    }

    return doc;
  }

  async updateDocument(id: string, dto: UpdateDocumentDto): Promise<any> {
    const doc = await this.getDocumentById(id);

    const nextTitle = dto.title ?? doc.title;
    const nextContent = (dto.content ?? doc.content) as DocumentContentSchema;
    const wordCount = this.engine.calculateWordCount(nextContent);

    if (dto.createSnapshot && doc.projectId) {
      const latestVersion = await this.prisma.client.projectVersion.findFirst({
        where: { projectId: doc.projectId },
        orderBy: { version: 'desc' },
      });
      await this.prisma.client.projectVersion.create({
        data: {
          projectId: doc.projectId,
          version: (latestVersion?.version || 0) + 1,
          title: dto.snapshotReason || 'Checkpoint automático NEXORA DOCS',
          snapshot: {
            title: doc.title,
            content: doc.content,
            wordCount: doc.wordCount,
          } as any,
        },
      });
    }

    return this.prisma.client.document.update({
      where: { id: doc.id },
      data: {
        title: nextTitle,
        content: nextContent as any,
        wordCount,
      },
      include: { project: true },
    });
  }

  async executeAiCommand(id: string, dto: AiDocumentCommandDto): Promise<any> {
    const doc = await this.getDocumentById(id);
    const currentContent = (doc.content || {}) as unknown as DocumentContentSchema;

    const { updatedContent, actionSummary } = this.engine.executeAiCommand(
      doc.title,
      currentContent,
      dto.command,
      dto.targetSectionId,
    );

    const wordCount = this.engine.calculateWordCount(updatedContent);

    // Save reversible snapshot
    if (doc.projectId) {
      const latestVersion = await this.prisma.client.projectVersion.findFirst({
        where: { projectId: doc.projectId },
        orderBy: { version: 'desc' },
      });
      await this.prisma.client.projectVersion.create({
        data: {
          projectId: doc.projectId,
          version: (latestVersion?.version || 0) + 1,
          title: `Antes de comando IA: "${dto.command}"`,
          snapshot: {
            title: doc.title,
            content: doc.content,
            wordCount: doc.wordCount,
          } as any,
        },
      });
    }

    const updated = await this.prisma.client.document.update({
      where: { id: doc.id },
      data: {
        content: updatedContent as any,
        wordCount,
      },
      include: { project: true },
    });

    return {
      document: updated,
      actionSummary,
    };
  }

  async exportToPdf(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const doc = await this.getDocumentById(id);
    const content = (doc.content || {}) as unknown as DocumentContentSchema;
    const buffer = await this.engine.exportToPdf(doc.title, content);
    const safeName = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_doc';
    return { buffer, filename: `${safeName}.pdf` };
  }

  async exportToDocx(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const doc = await this.getDocumentById(id);
    const content = (doc.content || {}) as unknown as DocumentContentSchema;
    const buffer = await this.engine.exportToDocx(doc.title, content);
    const safeName = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_doc';
    return { buffer, filename: `${safeName}.docx` };
  }

  async exportToMarkdown(id: string): Promise<{ markdown: string; filename: string }> {
    const doc = await this.getDocumentById(id);
    const content = (doc.content || {}) as unknown as DocumentContentSchema;
    const markdown = this.engine.exportToMarkdown(doc.title, content);
    const safeName = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_doc';
    return { markdown, filename: `${safeName}.md` };
  }
}
