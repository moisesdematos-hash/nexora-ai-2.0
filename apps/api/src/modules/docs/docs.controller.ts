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
import { DocsService } from './docs.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  AiDocumentCommandDto,
} from './dto/docs.dto';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get('templates')
  getTemplates(): any[] {
    return this.docsService.getTemplates();
  }

  @Get()
  listDocuments(): Promise<any[]> {
    return this.docsService.listDocuments();
  }

  @Post()
  createDocument(@Body() dto: CreateDocumentDto): Promise<any> {
    return this.docsService.createDocument(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<any> {
    return this.docsService.getDocumentById(id);
  }

  @Patch(':id')
  updateDocument(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
  ): Promise<any> {
    return this.docsService.updateDocument(id, dto);
  }

  @Post(':id/ai-command')
  executeAiCommand(
    @Param('id') id: string,
    @Body() dto: AiDocumentCommandDto,
  ): Promise<any> {
    return this.docsService.executeAiCommand(id, dto);
  }

  @Get(':id/export/pdf')
  async exportPdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.docsService.exportToPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get(':id/export/docx')
  async exportDocx(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { buffer, filename } = await this.docsService.exportToDocx(id);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    const { markdown, filename } = await this.docsService.exportToMarkdown(id);
    const buffer = Buffer.from(markdown, 'utf-8');
    res.set({
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
