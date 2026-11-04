import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DesignEngineService } from './services/design-engine.service';
import {
  PresentationEngineService,
  PlannedPresentationOutline,
} from './services/presentation-engine.service';
import { PresentationExportService } from './services/presentation-export.service';
import {
  PlanPresentationDto,
  CreatePresentationDto,
  UpdateSlideDto,
  ReorderSlidesDto,
  AiPresentationCommandDto,
  ApplyPresentationThemeDto,
} from './dto/presentation.dto';

@Injectable()
export class PresentationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly designEngine: DesignEngineService,
    private readonly engine: PresentationEngineService,
    private readonly exportService: PresentationExportService,
  ) {}

  getLayouts(): any[] {
    return this.designEngine.getLayouts();
  }

  getThemes(): any[] {
    return this.designEngine.getThemes();
  }

  async planPresentation(dto: PlanPresentationDto): Promise<PlannedPresentationOutline> {
    return this.engine.planPresentation(dto);
  }

  async createPresentation(dto: CreatePresentationDto): Promise<any> {
    const planned =
      dto.outline ||
      (await this.engine.planPresentation({
        prompt: dto.title,
        themeId: dto.themeId,
        slideCount: dto.config?.slideCount || 10,
      }));

    const themeId = (dto.themeId || planned.themeId || 'TECH').toUpperCase();

    const presentation = await this.prisma.client.presentation.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description || planned.subtitle,
        status: 'READY',
        theme: themeId,
        slideCount: planned.slides?.length || 10,
        config: {
          objective: planned.objective,
          targetAudience: planned.targetAudience,
          language: planned.language || 'pt',
          tone: planned.tone,
          sourceType: planned.sourceType || 'PROMPT',
          ...(dto.config || {}),
        },
      },
    });

    for (const s of planned.slides || []) {
      const richContent = this.engine.generateSlideContentForLayout(
        s.layout,
        s.title,
        dto.title,
        s.position,
      );

      await this.prisma.client.slide.create({
        data: {
          presentationId: presentation.id,
          position: s.position,
          title: s.title,
          content: richContent,
          speakerNotes: s.speakerNotes || '',
        },
      });
    }

    return this.getPresentationById(presentation.id);
  }

  async getPresentationById(id: string): Promise<any> {
    const presentation = await this.prisma.client.presentation.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: { position: 'asc' },
          include: { elements: { orderBy: { zIndex: 'asc' } } },
        },
        project: true,
      },
    });

    if (!presentation) {
      throw new NotFoundException('Apresentação não encontrada');
    }

    const designValidation = this.designEngine.validatePresentationDesign(presentation);
    const themeSpec = this.designEngine.getThemeById(presentation.theme || 'TECH');

    return {
      ...presentation,
      themeSpec,
      designValidation,
    };
  }

  async updateSlide(slideId: string, dto: UpdateSlideDto): Promise<any> {
    const existing = await this.prisma.client.slide.findUnique({
      where: { id: slideId },
      include: { presentation: true },
    });

    if (!existing) {
      throw new NotFoundException('Slide não encontrado');
    }

    let updatedContent: any = existing.content || {};
    if (dto.content) {
      updatedContent = { ...updatedContent, ...dto.content };
    }
    if (dto.layout && dto.layout !== updatedContent.layout) {
      const generatedForNewLayout = this.engine.generateSlideContentForLayout(
        dto.layout,
        dto.title || existing.title || 'Slide',
        existing.presentation.title,
        existing.position,
      );
      updatedContent = {
        ...generatedForNewLayout,
        ...updatedContent,
        layout: dto.layout.toUpperCase(),
        badge: `SLIDE ${String(existing.position).padStart(2, '0')} • ${dto.layout.toUpperCase().replace(/_/g, ' ')}`,
      };
    }

    return this.prisma.client.slide.update({
      where: { id: slideId },
      data: {
        title: dto.title !== undefined ? dto.title : existing.title,
        content: updatedContent,
        speakerNotes: dto.speakerNotes !== undefined ? dto.speakerNotes : existing.speakerNotes,
      },
    });
  }

  async duplicateSlide(presentationId: string, slideId: string): Promise<any> {
    const pres = await this.getPresentationById(presentationId);
    const target = pres.slides.find((s: any) => s.id === slideId);
    if (!target) {
      throw new NotFoundException('Slide a duplicar não encontrado');
    }

    const newPos = pres.slides.length + 1;
    await this.prisma.client.slide.create({
      data: {
        presentationId,
        position: newPos,
        title: `${target.title} (Cópia)`,
        content: target.content || {},
        speakerNotes: target.speakerNotes || '',
      },
    });

    await this.prisma.client.presentation.update({
      where: { id: presentationId },
      data: { slideCount: newPos },
    });

    return this.getPresentationById(presentationId);
  }

  async deleteSlide(presentationId: string, slideId: string): Promise<any> {
    await this.prisma.client.slide.delete({
      where: { id: slideId },
    });

    const remaining = await this.prisma.client.slide.findMany({
      where: { presentationId },
      orderBy: { position: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      await this.prisma.client.slide.update({
        where: { id: remaining[i]!.id },
        data: { position: i + 1 },
      });
    }

    await this.prisma.client.presentation.update({
      where: { id: presentationId },
      data: { slideCount: remaining.length },
    });

    return this.getPresentationById(presentationId);
  }

  async reorderSlides(presentationId: string, dto: ReorderSlidesDto): Promise<any> {
    for (let idx = 0; idx < dto.slideIds.length; idx++) {
      const sId = dto.slideIds[idx]!;
      await this.prisma.client.slide.update({
        where: { id: sId },
        data: { position: idx + 1 },
      });
    }

    return this.getPresentationById(presentationId);
  }

  async applyTheme(presentationId: string, dto: ApplyPresentationThemeDto): Promise<any> {
    const pres = await this.getPresentationById(presentationId);
    const currentConfig: any = pres.config || {};

    await this.prisma.client.presentation.update({
      where: { id: presentationId },
      data: {
        theme: dto.themeId.toUpperCase(),
        config: {
          ...currentConfig,
          customColors: dto.customColors || currentConfig.customColors,
        },
      },
    });

    return this.getPresentationById(presentationId);
  }

  async executeAiCommand(presentationId: string, dto: AiPresentationCommandDto): Promise<any> {
    const pres = await this.getPresentationById(presentationId);

    // Save reversible version snapshot in ProjectVersion if available
    if ((this.prisma.client as any).projectVersion && pres.projectId) {
      try {
        const count = await (this.prisma.client as any).projectVersion.count({
          where: { projectId: pres.projectId },
        });
        await (this.prisma.client as any).projectVersion.create({
          data: {
            projectId: pres.projectId,
            version: count + 1,
            title: `Antes de comando IA: "${dto.command.slice(0, 40)}"`,
            snapshot: {
              theme: pres.theme,
              slides: pres.slides,
            },
          },
        });
      } catch {
        // Non-blocking
      }
    }

    const result = this.engine.applyAiTransformation(dto.command, pres, dto.slideId);

    for (const s of result.updatedSlides) {
      await this.prisma.client.slide.update({
        where: { id: s.id },
        data: {
          title: s.title,
          content: s.content,
          speakerNotes: s.speakerNotes,
        },
      });
    }

    for (const newSlide of result.newSlidesToCreate) {
      await this.prisma.client.slide.create({
        data: {
          presentationId,
          position: newSlide.position,
          title: newSlide.title,
          content: newSlide.content,
          speakerNotes: newSlide.speakerNotes,
        },
      });
    }

    const totalSlides = result.updatedSlides.length + result.newSlidesToCreate.length;
    await this.prisma.client.presentation.update({
      where: { id: presentationId },
      data: { slideCount: totalSlides },
    });

    const refreshed = await this.getPresentationById(presentationId);
    return {
      actionApplied: result.actionApplied,
      presentation: refreshed,
    };
  }

  async exportToPdf(presentationId: string): Promise<{ buffer: Buffer; filename: string }> {
    const pres = await this.getPresentationById(presentationId);
    const buffer = await this.exportService.generatePdf(pres);
    const safeName = (pres.title || 'nexora-presentation')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return { buffer, filename: `${safeName}.pdf` };
  }

  async exportToPptx(presentationId: string): Promise<{ buffer: Buffer; filename: string }> {
    const pres = await this.getPresentationById(presentationId);
    const buffer = await this.exportService.generatePptx(pres);
    const safeName = (pres.title || 'nexora-presentation')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return { buffer, filename: `${safeName}.pptx` };
  }
}
