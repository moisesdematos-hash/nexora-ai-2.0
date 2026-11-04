import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  WebsitesEngineService,
  WebsiteDataSchema,
} from './services/websites-engine.service';
import {
  CreateWebsiteDto,
  UpdateWebsiteDto,
  AiWebsiteCommandDto,
  PublishWebsiteDto,
} from './dto/websites.dto';

@Injectable()
export class WebsitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: WebsitesEngineService,
  ) {}

  getMetadata(): any {
    return {
      archetypes: this.engine.getArchetypes(),
      themes: this.engine.getThemes(),
    };
  }

  async listWebsites(): Promise<any[]> {
    return this.prisma.client.website.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { project: true },
    });
  }

  async createWebsite(dto: CreateWebsiteDto): Promise<any> {
    const data = this.engine.generateWebsite(dto);

    const existing = await this.prisma.client.website.findUnique({
      where: { projectId: dto.projectId },
    });

    if (existing) {
      return this.prisma.client.website.update({
        where: { id: existing.id },
        data: {
          title: dto.title,
          data: data as any,
        },
        include: { project: true },
      });
    }

    return this.prisma.client.website.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        data: data as any,
      },
      include: { project: true },
    });
  }

  async getWebsiteById(id: string): Promise<any> {
    let site = await this.prisma.client.website.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!site) {
      site = await this.prisma.client.website.findUnique({
        where: { projectId: id },
        include: { project: true },
      });
    }

    if (!site) {
      throw new NotFoundException('Website não encontrado');
    }

    const htmlPreview = this.engine.exportToHtml(
      site.title,
      (site.data || {}) as unknown as WebsiteDataSchema,
    );

    return {
      ...site,
      htmlPreview,
    };
  }

  async updateWebsite(id: string, dto: UpdateWebsiteDto): Promise<any> {
    const site = await this.getWebsiteById(id);

    const updated = await this.prisma.client.website.update({
      where: { id: site.id },
      data: {
        title: dto.title ?? site.title,
        publishedUrl: dto.publishedUrl ?? site.publishedUrl,
        data: (dto.data ?? site.data) as any,
      },
    });

    return this.getWebsiteById(updated.id);
  }

  async executeAiCommand(id: string, dto: AiWebsiteCommandDto): Promise<any> {
    const site = await this.getWebsiteById(id);
    const currentData = (site.data || {}) as unknown as WebsiteDataSchema;

    const { updatedData, actionSummary } = this.engine.executeAiCommand(
      currentData,
      dto.command,
    );

    await this.prisma.client.website.update({
      where: { id: site.id },
      data: { data: updatedData as any },
    });

    const refreshed = await this.getWebsiteById(site.id);
    return {
      website: refreshed,
      actionSummary,
    };
  }

  async publishWebsite(id: string, dto: PublishWebsiteDto): Promise<any> {
    const site = await this.getWebsiteById(id);
    const currentData = (site.data || {}) as unknown as WebsiteDataSchema;
    const slug =
      dto.customSlug ||
      currentData.seo?.slug ||
      site.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const publishedUrl = `https://sites.nexora.ai/${slug}`;

    const updated = await this.prisma.client.website.update({
      where: { id: site.id },
      data: { publishedUrl },
      include: { project: true },
    });

    return {
      website: updated,
      publishedUrl,
    };
  }

  async exportToHtml(id: string): Promise<{ html: string; filename: string }> {
    const site = await this.getWebsiteById(id);
    const data = (site.data || {}) as unknown as WebsiteDataSchema;
    const html = this.engine.exportToHtml(site.title, data);
    const safeName =
      site.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_website';
    return { html, filename: `${safeName}.html` };
  }

  async exportToZip(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const site = await this.getWebsiteById(id);
    const data = (site.data || {}) as unknown as WebsiteDataSchema;
    const buffer = await this.engine.exportToZip(site.title, data);
    const safeName =
      site.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_website';
    return { buffer, filename: `${safeName}_bundle.zip` };
  }
}
