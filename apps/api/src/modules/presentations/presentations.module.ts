import { Module } from '@nestjs/common';
import { PresentationsController } from './presentations.controller';
import { PresentationsService } from './presentations.service';
import { DesignEngineService } from './services/design-engine.service';
import { PresentationEngineService } from './services/presentation-engine.service';
import { PresentationExportService } from './services/presentation-export.service';

@Module({
  controllers: [PresentationsController],
  providers: [
    PresentationsService,
    DesignEngineService,
    PresentationEngineService,
    PresentationExportService,
  ],
  exports: [PresentationsService, DesignEngineService],
})
export class PresentationsModule {}
