import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
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
  @UseGuards(SupabaseAuthGuard)
  getOrganizationSummary(
    @Param('organizationId') organizationId: string,
  ): Promise<any> {
    return this.billingService.getOrganizationBillingSummary(organizationId);
  }

  @Post('checkout')
  @UseGuards(SupabaseAuthGuard)
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<any> {
    return this.billingService.createCheckoutSession(dto);
  }

  @Post('credit-packs/purchase')
  @UseGuards(SupabaseAuthGuard)
  purchaseCreditPack(@Body() dto: PurchaseCreditPackDto): Promise<any> {
    return this.billingService.purchaseCreditPack(dto);
  }

  @Post('credits/consume')
  @UseGuards(SupabaseAuthGuard)
  consumeCredits(@Body() dto: ConsumeCreditsDto): Promise<any> {
    return this.billingService.consumeCredits(dto);
  }

  @Post('webhooks/stripe')
  handleStripeWebhook(
    @Body() dto: StripeWebhookEventDto,
    @Headers('stripe-signature') signature?: string,
  ): Promise<any> {
    return this.billingService.processStripeWebhook(dto, signature);
  }
}
