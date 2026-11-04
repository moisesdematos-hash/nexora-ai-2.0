import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  Min,
  IsObject,
} from 'class-validator';

export type PlanTierType = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type BillingCycleType = 'MONTHLY' | 'YEARLY';
export type CreditPackId =
  | 'PACK_500'
  | 'PACK_2000'
  | 'PACK_5000'
  | 'PACK_15000';

export type AiOperationKey =
  | 'PRESENTATION_GENERATE'
  | 'EBOOK_10_PAGES'
  | 'EBOOK_50_PAGES'
  | 'EBOOK_100_PAGES'
  | 'EBOOK_200_PAGES'
  | 'EBOOK_500_PAGES'
  | 'DOCUMENT_GENERATE'
  | 'MINDMAP_GENERATE'
  | 'INFOGRAPHIC_GENERATE'
  | 'WEBSITE_GENERATE'
  | 'AI_REWRITE_COMMAND'
  | 'AI_IMAGE_GENERATE';

export class CreateCheckoutSessionDto {
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  planTier!: PlanTierType;

  @IsOptional()
  @IsString()
  billingCycle?: BillingCycleType;
}

export class PurchaseCreditPackDto {
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  packId!: CreditPackId;
}

export class ConsumeCreditsDto {
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  operation!: AiOperationKey;

  @IsOptional()
  @IsInt()
  @Min(1)
  customAmount?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class StripeWebhookEventDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
