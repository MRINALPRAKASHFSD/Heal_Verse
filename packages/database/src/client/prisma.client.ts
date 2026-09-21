import { PrismaClient } from '@prisma/client';
import type { PrismaDatabaseClient } from './types';

export function createPrismaClient(): PrismaDatabaseClient {
  const baseClient = new PrismaClient();
  const client = baseClient.$extends({
    query: {
      $allModels: {
        async create({ args, query }) {
          if (args.data && typeof args.data === 'object' && !('id' in args.data)) {
            (args.data as Record<string, unknown>).id = globalThis.crypto.randomUUID();
          }
          return query(args);
        },
      },
    },
  });

  return client as unknown as PrismaDatabaseClient;
}