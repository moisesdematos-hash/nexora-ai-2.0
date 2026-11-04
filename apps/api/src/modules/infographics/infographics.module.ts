import { Module } from '@nestjs/common';
import { InfographicsController } from './infographics.controller';
import { InfographicsService } from './infographics.service';
import { InfographicsEngineService } from './services/infographics-engine.service';

@Module({
  controllers: [InfographicsController],
  providers: [InfographicsService, InfographicsEngineService],
  exports: [InfographicsService, InfographicsEngineService],
})
export class InfographicsModule {}
