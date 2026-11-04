import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { prisma } from '@nexora/db';
import type { PrismaClient } from '@nexora/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public readonly client: PrismaClient = prisma;

  async onModuleInit() {
    try {
      await this.client.$connect();
      this.logger.log('Connected to PostgreSQL database');
    } catch (err: any) {
      this.logger.warn(
        `PostgreSQL connection deferred (${err?.message || 'offline mode'}): API running with resilient studio engines.`,
      );
    }
  }

  async onModuleDestroy() {
    await this.client.$disconnect().catch(() => {});
  }
}
