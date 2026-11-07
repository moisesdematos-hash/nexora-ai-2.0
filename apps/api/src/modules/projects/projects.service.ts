import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyTenantMembership(
    organizationId: string,
    authUser?: { id: string; isLocalDev?: boolean },
  ) {
    if (!authUser || authUser.isLocalDev) return;
    const member = await this.prisma.client.membership.findFirst({
      where: {
        organizationId,
        OR: [{ userId: authUser.id }, { user: { supabaseId: authUser.id } }],
      },
    });
    if (!member) {
      throw new ForbiddenException(
        'Acesso negado: utilizador não pertence a esta organização.',
      );
    }
  }

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.client.project.create({
      data: {
        name: dto.name,
        type: dto.type,
        organizationId: dto.organizationId,
        userId: userId,
        folderId: dto.folderId,
      },
    });
  }

  async findAll(
    organizationId: string,
    search?: string,
    authUser?: { id: string; isLocalDev?: boolean },
  ) {
    if (organizationId) {
      await this.verifyTenantMembership(organizationId, authUser);
    }
    return this.prisma.client.project.findMany({
      where: {
        organizationId,
        deletedAt: null,
        ...(search
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, authUser?: { id: string; isLocalDev?: boolean }) {
    const project = await this.prisma.client.project.findUnique({
      where: { id },
      include: {
        presentation: true,
        book: true,
        document: true,
        mindMap: true,
        infographic: true,
        website: true,
      },
    });

    if (!project || project.deletedAt) {
      throw new NotFoundException('Project not found');
    }

    await this.verifyTenantMembership(project.organizationId, authUser);

    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    authUser?: { id: string; isLocalDev?: boolean },
  ) {
    await this.findOne(id, authUser);
    return this.prisma.client.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, authUser?: { id: string; isLocalDev?: boolean }) {
    await this.findOne(id, authUser);
    return this.prisma.client.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
