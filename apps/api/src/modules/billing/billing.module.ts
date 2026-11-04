import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { BillingEngineService } from './services/billing-engine.service';

@Module({
  controllers: [BillingController],
  providers: [BillingService, BillingEngineService],
  exports: [BillingService, BillingEngineService],
})
export class BillingModule {}
