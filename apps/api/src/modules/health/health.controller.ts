import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nexora-api',
      version: '2.0.0',
      uptimeSeconds: Math.round(process.uptime()),
      security: {
        helmet: true,
        rateLimiting: '100 req / 60s',
        validationPipeWhitelist: true,
        multiTenantRbac: true,
      },
      studios: [
        'NEXORA_PRESENTATIONS',
        'NEXORA_EBOOK_STUDIO',
        'NEXORA_DOCS',
        'NEXORA_MIND_MAPS',
        'NEXORA_INFOGRAPHICS',
        'NEXORA_WEB',
      ],
      exportFormats: [
        'PDF',
        'DOCX',
        'PPTX',
        'EPUB_3',
        'SVG',
        'MARKDOWN',
        'HTML5',
        'ZIP_BUNDLE',
      ],
      locales: ['pt', 'en', 'es', 'fr'],
    };
  }
}
