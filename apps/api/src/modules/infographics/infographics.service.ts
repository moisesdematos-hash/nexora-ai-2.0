import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  InfographicsEngineService,
  InfographicDataSchema,
} from './services/infographics-engine.service';
import {
  CreateInfographicDto,
  UpdateInfographicDto,
  AiInfographicCommandDto,
} from './dto/infographics.dto';

@Injectable()
export class InfographicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: InfographicsEngineService,
  ) {}

  getMetadata(): any {
    return {
      archetypes: this.engine.getArchetypes(),
      palettes: this.engine.getPalettes(),
    };
  }

  async listInfographics(): Promise<any[]> {
    return this.prisma.client.infographic.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { project: true },
    });
  }

  async createInfographic(dto: CreateInfographicDto): Promise<any> {
    const data = this.engine.generateInfographic(dto);
    const width = dto.width || 800;
    const height = dto.height || 1200;

    const existing = await this.prisma.client.infographic.findUnique({
      where: { projectId: dto.projectId },
    });

    if (existing) {
      return this.prisma.client.infographic.update({
        where: { id: existing.id },
        data: {
          title: dto.title,
          width,
          height,
          data: data as any,
        },
        include: { project: true },
      });
    }

    return this.prisma.client.infographic.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        width,
        height,
        data: data as any,
      },
      include: { project: true },
    });
  }

  async getInfographicById(id: string): Promise<any> {
    let info = await this.prisma.client.infographic.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!info) {
      info = await this.prisma.client.infographic.findUnique({
        where: { projectId: id },
        include: { project: true },
      });
    }

    if (!info) {
      throw new NotFoundException('Infográfico não encontrado');
    }

    const svgPreview = this.engine.exportToSvg(
      info.title,
      info.width,
      info.height,
      (info.data || {}) as unknown as InfographicDataSchema,
    );

    return {
      ...info,
      svgPreview,
    };
  }

  async updateInfographic(id: string, dto: UpdateInfographicDto): Promise<any> {
    const info = await this.getInfographicById(id);

    const updated = await this.prisma.client.infographic.update({
      where: { id: info.id },
      data: {
        title: dto.title ?? info.title,
        width: dto.width ?? info.width,
        height: dto.height ?? info.height,
        data: (dto.data ?? info.data) as any,
      },
      include: { project: true },
    });

    return this.getInfographicById(updated.id);
  }

  async executeAiCommand(
    id: string,
    dto: AiInfographicCommandDto,
  ): Promise<any> {
    const info = await this.getInfographicById(id);
    const currentData = (info.data || {}) as unknown as InfographicDataSchema;

    const { updatedData, actionSummary } = this.engine.executeAiCommand(
      currentData,
      dto.command,
    );

    await this.prisma.client.infographic.update({
      where: { id: info.id },
      data: { data: updatedData as any },
    });

    const refreshed = await this.getInfographicById(info.id);
    return {
      infographic: refreshed,
      actionSummary,
    };
  }

  async exportToSvg(id: string): Promise<{ svg: string; filename: string }> {
    const info = await this.getInfographicById(id);
    const data = (info.data || {}) as unknown as InfographicDataSchema;
    const svg = this.engine.exportToSvg(
      info.title,
      info.width,
      info.height,
      data,
    );
    const safeName =
      info.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_infographic';
    return { svg, filename: `${safeName}.svg` };
  }

  async exportToPdf(id: string): Promise<{ buffer: Buffer; filename: string }> {
    const info = await this.getInfographicById(id);
    const data = (info.data || {}) as unknown as InfographicDataSchema;
    const buffer = await this.engine.exportToPdf(info.title, data);
    const safeName =
      info.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_infographic';
    return { buffer, filename: `${safeName}.pdf` };
  }
}
