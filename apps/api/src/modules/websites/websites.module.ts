import { Module } from '@nestjs/common';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { WebsitesEngineService } from './services/websites-engine.service';

@Module({
  controllers: [WebsitesController],
  providers: [WebsitesService, WebsitesEngineService],
  exports: [WebsitesService, WebsitesEngineService],
})
export class WebsitesModule {}
