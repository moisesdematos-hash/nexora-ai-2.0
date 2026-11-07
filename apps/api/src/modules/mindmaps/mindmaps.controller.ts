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
import { MindMapsService } from './mindmaps.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import {
  CreateMindMapDto,
  UpdateMindMapDto,
  ExpandMindMapNodeDto,
  AiMindMapCommandDto,
} from './dto/mindmaps.dto';

@Controller('mindmaps')
@UseGuards(SupabaseAuthGuard)
export class MindMapsController {
  constructor(private readonly mindMapsService: MindMapsService) {}

  @Get('metadata')
  getMetadata(): any {
    return this.mindMapsService.getMetadata();
  }

  @Get()
  listMindMaps(): Promise<any[]> {
    return this.mindMapsService.listMindMaps();
  }

  @Post()
  createMindMap(@Body() dto: CreateMindMapDto): Promise<any> {
    return this.mindMapsService.createMindMap(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<any> {
    return this.mindMapsService.getMindMapById(id);
  }

  @Patch(':id')
  updateMindMap(
    @Param('id') id: string,
    @Body() dto: UpdateMindMapDto,
  ): Promise<any> {
    return this.mindMapsService.updateMindMap(id, dto);
  }

  @Post(':id/expand-node')
  expandNode(
    @Param('id') id: string,
    @Body() dto: ExpandMindMapNodeDto,
  ): Promise<any> {
    return this.mindMapsService.expandNode(id, dto);
  }

  @Post(':id/ai-command')
  executeAiCommand(
    @Param('id') id: string,
    @Body() dto: AiMindMapCommandDto,
  ): Promise<any> {
    return this.mindMapsService.executeAiCommand(id, dto);
  }

  @Get(':id/export/svg')
  async exportSvg(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { svg, filename } = await this.mindMapsService.exportToSvg(id);
    const buffer = Buffer.from(svg, 'utf-8');
    res.set({
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/md')
  async exportMarkdown(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const { markdown, filename } =
      await this.mindMapsService.exportToMarkdown(id);
    const buffer = Buffer.from(markdown, 'utf-8');
    res.set({
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
