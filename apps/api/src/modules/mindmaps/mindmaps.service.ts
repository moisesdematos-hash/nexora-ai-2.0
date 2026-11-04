import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MindMapsEngineService,
  MindMapDataSchema,
} from './services/mindmaps-engine.service';
import {
  CreateMindMapDto,
  UpdateMindMapDto,
  ExpandMindMapNodeDto,
  AiMindMapCommandDto,
} from './dto/mindmaps.dto';

@Injectable()
export class MindMapsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: MindMapsEngineService,
  ) {}

  getMetadata(): any {
    return {
      diagramTypes: this.engine.getDiagramTypes(),
      themes: this.engine.getThemes(),
    };
  }

  async listMindMaps(): Promise<any[]> {
    return this.prisma.client.mindMap.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { project: true },
    });
  }

  async createMindMap(dto: CreateMindMapDto): Promise<any> {
    const data = this.engine.generateMindMap(dto);

    const existing = await this.prisma.client.mindMap.findUnique({
      where: { projectId: dto.projectId },
    });

    if (existing) {
      return this.prisma.client.mindMap.update({
        where: { id: existing.id },
        data: {
          title: dto.title,
          data: data as any,
        },
        include: { project: true },
      });
    }

    return this.prisma.client.mindMap.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        data: data as any,
      },
      include: { project: true },
    });
  }

  async getMindMapById(id: string): Promise<any> {
    let mindMap = await this.prisma.client.mindMap.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!mindMap) {
      mindMap = await this.prisma.client.mindMap.findUnique({
        where: { projectId: id },
        include: { project: true },
      });
    }

    if (!mindMap) {
      throw new NotFoundException('Mapa mental não encontrado');
    }

    return mindMap;
  }

  async updateMindMap(id: string, dto: UpdateMindMapDto): Promise<any> {
    const mindMap = await this.getMindMapById(id);

    return this.prisma.client.mindMap.update({
      where: { id: mindMap.id },
      data: {
        title: dto.title ?? mindMap.title,
        data: (dto.data ?? mindMap.data) as any,
      },
      include: { project: true },
    });
  }

  async expandNode(id: string, dto: ExpandMindMapNodeDto): Promise<any> {
    const mindMap = await this.getMindMapById(id);
    const currentData = (mindMap.data || {}) as unknown as MindMapDataSchema;

    const { updatedData, addedNodes } = this.engine.expandNode(
      currentData,
      dto.nodeId,
      dto.prompt,
      dto.branchCount || 3,
    );

    const updated = await this.prisma.client.mindMap.update({
      where: { id: mindMap.id },
      data: { data: updatedData as any },
      include: { project: true },
    });

    return {
      mindMap: updated,
      addedNodes,
    };
  }

  async executeAiCommand(id: string, dto: AiMindMapCommandDto): Promise<any> {
    const mindMap = await this.getMindMapById(id);
    const currentData = (mindMap.data || {}) as unknown as MindMapDataSchema;

    const { updatedData, actionSummary } = this.engine.executeAiCommand(
      currentData,
      dto.command,
    );

    const updated = await this.prisma.client.mindMap.update({
      where: { id: mindMap.id },
      data: { data: updatedData as any },
      include: { project: true },
    });

    return {
      mindMap: updated,
      actionSummary,
    };
  }

  async exportToSvg(id: string): Promise<{ svg: string; filename: string }> {
    const mindMap = await this.getMindMapById(id);
    const data = (mindMap.data || {}) as unknown as MindMapDataSchema;
    const svg = this.engine.exportToSvg(mindMap.title, data);
    const safeName =
      mindMap.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_mindmap';
    return { svg, filename: `${safeName}.svg` };
  }

  async exportToMarkdown(
    id: string,
  ): Promise<{ markdown: string; filename: string }> {
    const mindMap = await this.getMindMapById(id);
    const data = (mindMap.data || {}) as unknown as MindMapDataSchema;
    const markdown = this.engine.exportToMarkdown(mindMap.title, data);
    const safeName =
      mindMap.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nexora_mindmap';
    return { markdown, filename: `${safeName}.md` };
  }
}
