import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsObject,
  IsBoolean,
} from 'class-validator';

export type DocumentTemplateType =
  | 'EXECUTIVE_REPORT'
  | 'COMMERCIAL_PROPOSAL'
  | 'TECHNICAL_MANUAL'
  | 'SOP_PLAYBOOK'
  | 'PROJECT_CHARTER';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  template?: DocumentTemplateType;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  organizationName?: string;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  createSnapshot?: boolean;

  @IsOptional()
  @IsString()
  snapshotReason?: string;
}

export class AiDocumentCommandDto {
  @IsString()
  @IsNotEmpty()
  command!: string;

  @IsOptional()
  @IsString()
  targetSectionId?: string;
}
