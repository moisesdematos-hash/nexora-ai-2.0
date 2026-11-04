import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import {
  CreateCheckoutSessionDto,
  PurchaseCreditPackDto,
  ConsumeCreditsDto,
  StripeWebhookEventDto,
} from './dto/billing.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('catalog')
  getCatalog(): any {
    return this.billingService.getCatalog();
  }

  @Get('estimate-ebook')
  estimateEbook(@Query('pages') pages?: string): any {
    return this.billingService.estimateEbookCost(Number(pages || 50));
  }

  @Get('organization/:organizationId')
  getOrganizationSummary(
    @Param('organizationId') organizationId: string,
  ): Promise<any> {
    return this.billingService.getOrganizationBillingSummary(organizationId);
  }

  @Post('checkout')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<any> {
    return this.billingService.createCheckoutSession(dto);
  }

  @Post('credit-packs/purchase')
  purchaseCreditPack(@Body() dto: PurchaseCreditPackDto): Promise<any> {
    return this.billingService.purchaseCreditPack(dto);
  }

  @Post('credits/consume')
  consumeCredits(@Body() dto: ConsumeCreditsDto): Promise<any> {
    return this.billingService.consumeCredits(dto);
  }

  @Post('webhooks/stripe')
  handleStripeWebhook(@Body() dto: StripeWebhookEventDto): Promise<any> {
    return this.billingService.processStripeWebhook(dto);
  }
}
