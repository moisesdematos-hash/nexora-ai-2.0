import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { DocsEngineService } from './services/docs-engine.service';

@Module({
  controllers: [DocsController],
  providers: [DocsService, DocsEngineService],
  exports: [DocsService, DocsEngineService],
})
export class DocsModule {}
