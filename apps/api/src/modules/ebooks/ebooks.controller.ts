import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { EbooksService } from './ebooks.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import {
  GenerateOutlineDto,
  CreateBookDto,
  UpdateChapterDto,
  GenerateCoverDto,
  UpdateDesignConfigDto,
} from './dto/ebook.dto';

@Controller('ebooks')
@UseGuards(SupabaseAuthGuard)
export class EbooksController {
  constructor(private readonly ebooksService: EbooksService) {}

  @Post('plan')
  planOutline(@Body() dto: GenerateOutlineDto): Promise<any> {
    return this.ebooksService.planOutline(dto);
  }

  @Post()
  createBook(@Body() dto: CreateBookDto): Promise<any> {
    return this.ebooksService.createBook(dto);
  }

  @Get('cover-presets')
  getCoverPresets(): any[] {
    return this.ebooksService.getCoverPresets();
  }

  @Get('project/:projectId')
  getByProjectId(@Param('projectId') projectId: string): Promise<any> {
    return this.ebooksService.getBookByProjectId(projectId);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<any> {
    return this.ebooksService.getBookById(id);
  }

  @Post(':id/chapters/:chapterId/generate')
  generateChapter(
    @Param('id') id: string,
    @Param('chapterId') chapterId: string,
  ): Promise<any> {
    return this.ebooksService.generateChapter(id, chapterId);
  }

  @Patch(':id/chapters/:chapterId')
  updateChapter(
    @Param('chapterId') chapterId: string,
    @Body() dto: UpdateChapterDto,
  ): Promise<any> {
    return this.ebooksService.updateChapter(chapterId, dto);
  }

  // ==========================================
  // PHASE 3: QUEUE, CHECKPOINTS, REVIEW, COVER, EXPORTS
  // ==========================================

  @Get(':id/queue/status')
  getQueueStatus(@Param('id') id: string): Promise<any> {
    return this.ebooksService.getQueueStatus(id);
  }

  @Post(':id/queue/start')
  startBatchGeneration(@Param('id') id: string): Promise<any> {
    return this.ebooksService.startBatchGeneration(id);
  }

  @Post(':id/queue/pause')
  pauseBatchGeneration(@Param('id') id: string): Promise<any> {
    return this.ebooksService.pauseBatchGeneration(id);
  }

  @Post(':id/review')
  reviewBook(@Param('id') id: string): Promise<any> {
    return this.ebooksService.reviewBook(id);
  }

  @Post(':id/cover')
  generateCover(
    @Param('id') id: string,
    @Body() dto: GenerateCoverDto,
  ): Promise<any> {
    return this.ebooksService.generateCover(id, dto);
  }

  @Patch(':id/design')
  updateDesign(
    @Param('id') id: string,
    @Body() dto: UpdateDesignConfigDto,
  ): Promise<any> {
    return this.ebooksService.updateDesignConfig(id, dto);
  }

  @Get(':id/export/pdf')
  async exportPdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.ebooksService.exportToPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/epub')
  async exportEpub(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.ebooksService.exportToEpub(id);
    res.set({
      'Content-Type': 'application/epub+zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/docx')
  async exportDocx(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.ebooksService.exportToDocx(id);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
