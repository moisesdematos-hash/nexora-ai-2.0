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
import { InfographicsService } from './infographics.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import {
  CreateInfographicDto,
  UpdateInfographicDto,
  AiInfographicCommandDto,
} from './dto/infographics.dto';

@Controller('infographics')
@UseGuards(SupabaseAuthGuard)
export class InfographicsController {
  constructor(private readonly infographicsService: InfographicsService) {}

  @Get('metadata')
  getMetadata(): any {
    return this.infographicsService.getMetadata();
  }

  @Get()
  listInfographics(): Promise<any[]> {
    return this.infographicsService.listInfographics();
  }

  @Post()
  createInfographic(@Body() dto: CreateInfographicDto): Promise<any> {
    return this.infographicsService.createInfographic(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<any> {
    return this.infographicsService.getInfographicById(id);
  }

  @Patch(':id')
  updateInfographic(
    @Param('id') id: string,
    @Body() dto: UpdateInfographicDto,
  ): Promise<any> {
    return this.infographicsService.updateInfographic(id, dto);
  }

  @Post(':id/ai-command')
  executeAiCommand(
    @Param('id') id: string,
    @Body() dto: AiInfographicCommandDto,
  ): Promise<any> {
    return this.infographicsService.executeAiCommand(id, dto);
  }

  @Get(':id/export/svg')
  async exportSvg(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { svg, filename } = await this.infographicsService.exportToSvg(id);
    const buffer = Buffer.from(svg, 'utf-8');
    res.set({
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/pdf')
  async exportPdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.infographicsService.exportToPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
