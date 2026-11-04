import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('organizations')
@UseGuards(SupabaseAuthGuard)
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get()
  findUserOrgs(@Req() req: any) {
    return this.orgsService.findForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgsService.findOne(id);
  }
}
