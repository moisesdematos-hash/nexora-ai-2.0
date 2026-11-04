import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class GenerateOutlineDto {
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @IsNumber()
  @Min(5)
  @Max(1000)
  targetPages!: number;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsString()
  @IsOptional()
  tone?: string;

  @IsString()
  @IsOptional()
  depth?: string;

  @IsString()
  @IsOptional()
  editorialStyle?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @IsOptional()
  @Min(3)
  @Max(80)
  chaptersCount?: number;

  @IsBoolean()
  @IsOptional()
  includeExercises?: boolean;

  @IsBoolean()
  @IsOptional()
  includeExamples?: boolean;

  @IsBoolean()
  @IsOptional()
  includeReferences?: boolean;
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsNumber()
  @Min(5)
  @Max(1000)
  targetPages!: number;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsOptional()
  outline?: any;

  @IsOptional()
  config?: {
    objective?: string;
    depth?: string;
    editorialStyle?: string;
    pageFormat?: 'A4' | '6x9' | '16x23' | 'A5';
    coverStyle?: string;
    primaryColor?: string;
    accentColor?: string;
    imagesDensity?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    includeExercises?: boolean;
    includeExamples?: boolean;
    includeReferences?: boolean;
    reviewLevel?: 'STANDARD' | 'DEEP' | 'ACADEMIC';
    exportFormats?: string[];
    [key: string]: any;
  };
}

export class UpdateChapterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  summary?: string;
}

export class GenerateCoverDto {
  @IsString()
  @IsOptional()
  style?: 'CORPORATE_EXECUTIVE' | 'MINIMALIST_MODERN' | 'ACADEMIC_CLASSIC' | 'TECH_FUTURISTIC' | 'CREATIVE_VIBRANT' | 'LUXURY_EDITORIAL';

  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  badgeText?: string;

  @IsString()
  @IsOptional()
  customSubtitle?: string;
}

export class UpdateDesignConfigDto {
  @IsString()
  @IsOptional()
  pageFormat?: 'A4' | '6x9' | '16x23' | 'A5';

  @IsString()
  @IsOptional()
  editorialStyle?: string;

  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsBoolean()
  @IsOptional()
  includeExercises?: boolean;

  @IsBoolean()
  @IsOptional()
  includeExamples?: boolean;

  @IsBoolean()
  @IsOptional()
  includeReferences?: boolean;
}
