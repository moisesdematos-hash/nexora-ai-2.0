import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findForUser(userId: string) {
    const memberships = await this.prisma.client.membership.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    });

    return memberships.map((m: any) => ({
      ...m.organization,
      role: m.role,
    }));
  }

  async findOne(id: string): Promise<any> {
    const org = await this.prisma.client.organization.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }
}
