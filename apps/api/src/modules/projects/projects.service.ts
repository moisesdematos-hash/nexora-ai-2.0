import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll(organizationId: string, search?: string) {
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

  async findOne(id: string) {
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

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.client.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
