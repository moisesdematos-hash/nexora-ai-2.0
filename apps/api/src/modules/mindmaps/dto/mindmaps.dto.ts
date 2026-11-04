import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export type MindMapDiagramType =
  | 'MIND_MAP'
  | 'FLOWCHART'
  | 'ORG_CHART'
  | 'ARCHITECTURE'
  | 'CONCEPT_MAP';

export type MindMapThemeId =
  | 'NEON_TECH'
  | 'CORPORATE_BLUE'
  | 'EMERALD_GROWTH'
  | 'WARM_CREATIVE'
  | 'MINIMAL_MONO';

export class CreateMindMapDto {
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
  diagramType?: MindMapDiagramType;

  @IsOptional()
  @IsString()
  theme?: MindMapThemeId;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(4)
  depth?: number;
}

export class UpdateMindMapDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class ExpandMindMapNodeDto {
  @IsString()
  @IsNotEmpty()
  nodeId!: string;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  branchCount?: number;
}

export class AiMindMapCommandDto {
  @IsString()
  @IsNotEmpty()
  command!: string;
}
