import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { PresentationsService } from './presentations.service';
import {
  PlanPresentationDto,
  CreatePresentationDto,
  UpdateSlideDto,
  ReorderSlidesDto,
  AiPresentationCommandDto,
  ApplyPresentationThemeDto,
} from './dto/presentation.dto';

@Controller('presentations')
export class PresentationsController {
  constructor(private readonly presentationsService: PresentationsService) {}

  @Get('layouts')
  getLayouts(): any[] {
    return this.presentationsService.getLayouts();
  }

  @Get('themes')
  getThemes(): any[] {
    return this.presentationsService.getThemes();
  }

  @Post('plan')
  planPresentation(@Body() dto: PlanPresentationDto): Promise<any> {
    return this.presentationsService.planPresentation(dto);
  }

  @Post()
  createPresentation(@Body() dto: CreatePresentationDto): Promise<any> {
    return this.presentationsService.createPresentation(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<any> {
    return this.presentationsService.getPresentationById(id);
  }

  @Patch(':id/slides/:slideId')
  updateSlide(
    @Param('slideId') slideId: string,
    @Body() dto: UpdateSlideDto,
  ): Promise<any> {
    return this.presentationsService.updateSlide(slideId, dto);
  }

  @Post(':id/slides/:slideId/duplicate')
  duplicateSlide(
    @Param('id') id: string,
    @Param('slideId') slideId: string,
  ): Promise<any> {
    return this.presentationsService.duplicateSlide(id, slideId);
  }

  @Delete(':id/slides/:slideId')
  deleteSlide(
    @Param('id') id: string,
    @Param('slideId') slideId: string,
  ): Promise<any> {
    return this.presentationsService.deleteSlide(id, slideId);
  }

  @Patch(':id/reorder')
  reorderSlides(
    @Param('id') id: string,
    @Body() dto: ReorderSlidesDto,
  ): Promise<any> {
    return this.presentationsService.reorderSlides(id, dto);
  }

  @Patch(':id/theme')
  applyTheme(
    @Param('id') id: string,
    @Body() dto: ApplyPresentationThemeDto,
  ): Promise<any> {
    return this.presentationsService.applyTheme(id, dto);
  }

  @Post(':id/ai-command')
  executeAiCommand(
    @Param('id') id: string,
    @Body() dto: AiPresentationCommandDto,
  ): Promise<any> {
    return this.presentationsService.executeAiCommand(id, dto);
  }

  @Get(':id/export/pdf')
  async exportPdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.presentationsService.exportToPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/pptx')
  async exportPptx(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.presentationsService.exportToPptx(id);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
