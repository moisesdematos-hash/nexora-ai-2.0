import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findForUser(userId: string) {
    const memberships = await this.prisma.client.membership.findMany({
      where: {
        OR: [{ userId }, { user: { supabaseId: userId } }],
      },
      include: {
        organization: true,
      },
    });

    return memberships.map((m: any) => ({
      ...m.organization,
      role: m.role,
    }));
  }

  async findOne(
    id: string,
    authUser?: { id: string; isLocalDev?: boolean },
  ): Promise<any> {
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

    if (authUser && !authUser.isLocalDev) {
      const isMember = org.memberships.some(
        (m: any) =>
          m.userId === authUser.id || m.user?.supabaseId === authUser.id,
      );
      if (!isMember) {
        throw new ForbiddenException(
          'Acesso negado: utilizador não pertence a esta organização.',
        );
      }
    }

    return org;
  }
}
