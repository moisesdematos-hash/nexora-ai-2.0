import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export type InfographicType =
  | 'STATISTICAL'
  | 'TIMELINE'
  | 'PROCESS'
  | 'COMPARISON'
  | 'LISTICLE';

export type InfographicPaletteId =
  | 'CYBER_INDIGO'
  | 'EXECUTIVE_NAVY'
  | 'EMERALD_ECO'
  | 'SUNSET_CORAL'
  | 'ROYAL_GOLD';

export class CreateInfographicDto {
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
  infographicType?: InfographicType;

  @IsOptional()
  @IsString()
  palette?: InfographicPaletteId;

  @IsOptional()
  @IsInt()
  @Min(600)
  @Max(2400)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(800)
  @Max(3600)
  height?: number;
}

export class UpdateInfographicDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  width?: number;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class AiInfographicCommandDto {
  @IsString()
  @IsNotEmpty()
  command!: string;
}
