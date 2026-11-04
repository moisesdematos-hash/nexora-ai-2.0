import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class PlanPresentationDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsString()
  @IsOptional()
  sourceType?: 'PROMPT' | 'TEXT' | 'DOCUMENT' | 'URL' | 'CSV_DATA';

  @IsString()
  @IsOptional()
  sourceContent?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @IsOptional()
  @Min(3)
  @Max(60)
  slideCount?: number;

  @IsString()
  @IsOptional()
  tone?: string;

  @IsString()
  @IsOptional()
  depth?: string;

  @IsString()
  @IsOptional()
  themeId?: string;

  @IsBoolean()
  @IsOptional()
  includeCharts?: boolean;

  @IsBoolean()
  @IsOptional()
  includeSpeakerNotes?: boolean;
}

export class CreatePresentationDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  themeId?: string;

  @IsOptional()
  outline?: any;

  @IsOptional()
  config?: any;
}

export class UpdateSlideDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  layout?: string;

  @IsOptional()
  content?: any;

  @IsString()
  @IsOptional()
  speakerNotes?: string;

  @IsNumber()
  @IsOptional()
  position?: number;
}

export class ReorderSlidesDto {
  @IsNotEmpty()
  slideIds!: string[];
}

export class AiPresentationCommandDto {
  @IsString()
  @IsNotEmpty()
  command!: string;

  @IsString()
  @IsOptional()
  slideId?: string;

  @IsString()
  @IsOptional()
  targetLanguage?: string;
}

export class ApplyPresentationThemeDto {
  @IsString()
  @IsNotEmpty()
  themeId!: string;

  @IsOptional()
  customColors?: {
    background?: string;
    surface?: string;
    text?: string;
    primary?: string;
    accent?: string;
  };
}
