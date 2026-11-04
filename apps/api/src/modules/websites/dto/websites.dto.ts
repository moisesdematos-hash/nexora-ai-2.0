import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export type WebsiteArchetype =
  | 'SAAS_LANDING'
  | 'EXECUTIVE_PORTFOLIO'
  | 'PRODUCT_LAUNCH'
  | 'AGENCY_CORPORATE'
  | 'EVENT_CONFERENCE';

export type WebsiteThemeId =
  | 'MIDNIGHT_INDIGO'
  | 'CLEAN_MINIMAL'
  | 'EMERALD_FINTECH'
  | 'CYBER_NEON'
  | 'WARM_LUXURY';

export class CreateWebsiteDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsString()
  archetype?: WebsiteArchetype;

  @IsOptional()
  @IsString()
  theme?: WebsiteThemeId;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  primaryCtaText?: string;

  @IsOptional()
  @IsString()
  language?: string;
}

export class UpdateWebsiteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  publishedUrl?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class AiWebsiteCommandDto {
  @IsString()
  @IsNotEmpty()
  command!: string;
}

export class PublishWebsiteDto {
  @IsOptional()
  @IsString()
  customSlug?: string;
}
