import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ProjectType } from '@nexora/shared';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(ProjectType)
  type!: ProjectType;

  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsOptional()
  folderId?: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  folderId?: string;
}
