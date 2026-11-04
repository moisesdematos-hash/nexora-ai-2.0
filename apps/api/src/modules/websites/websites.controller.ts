import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { WebsitesService } from './websites.service';
import {
  CreateWebsiteDto,
  UpdateWebsiteDto,
  AiWebsiteCommandDto,
  PublishWebsiteDto,
} from './dto/websites.dto';

@Controller('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Get('metadata')
  getMetadata(): any {
    return this.websitesService.getMetadata();
  }

  @Get()
  listWebsites(): Promise<any[]> {
    return this.websitesService.listWebsites();
  }

  @Post()
  createWebsite(@Body() dto: CreateWebsiteDto): Promise<any> {
    return this.websitesService.createWebsite(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<any> {
    return this.websitesService.getWebsiteById(id);
  }

  @Patch(':id')
  updateWebsite(
    @Param('id') id: string,
    @Body() dto: UpdateWebsiteDto,
  ): Promise<any> {
    return this.websitesService.updateWebsite(id, dto);
  }

  @Post(':id/ai-command')
  executeAiCommand(
    @Param('id') id: string,
    @Body() dto: AiWebsiteCommandDto,
  ): Promise<any> {
    return this.websitesService.executeAiCommand(id, dto);
  }

  @Post(':id/publish')
  publishWebsite(
    @Param('id') id: string,
    @Body() dto: PublishWebsiteDto,
  ): Promise<any> {
    return this.websitesService.publishWebsite(id, dto);
  }

  @Get(':id/export/html')
  async exportHtml(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { html, filename } = await this.websitesService.exportToHtml(id);
    const buffer = Buffer.from(html, 'utf-8');
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/zip')
  async exportZip(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.websitesService.exportToZip(id);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
