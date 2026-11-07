import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const g = globalThis as unknown as {
  __nexoraPrisma?: PrismaClient;
};

export const prisma: PrismaClient =
  g.__nexoraPrisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  g.__nexoraPrisma = prisma;
}

export default prisma;
