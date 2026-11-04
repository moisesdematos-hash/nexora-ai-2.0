import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('projects')
@UseGuards(SupabaseAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateProjectDto) {
    const userId = req.user.id;
    return this.projectsService.create(userId, dto);
  }

  @Get()
  findAll(
    @Query('organizationId') organizationId: string,
    @Query('search') search?: string,
  ) {
    return this.projectsService.findAll(organizationId, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
