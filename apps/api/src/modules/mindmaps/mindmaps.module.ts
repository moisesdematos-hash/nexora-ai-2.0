import { Module } from '@nestjs/common';
import { MindMapsController } from './mindmaps.controller';
import { MindMapsService } from './mindmaps.service';
import { MindMapsEngineService } from './services/mindmaps-engine.service';

@Module({
  controllers: [MindMapsController],
  providers: [MindMapsService, MindMapsEngineService],
  exports: [MindMapsService, MindMapsEngineService],
})
export class MindMapsModule {}
