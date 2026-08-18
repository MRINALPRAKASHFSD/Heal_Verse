import { PrismaClient } from '@prisma/client';
import type { PrismaDatabaseClient } from './types';

export function createPrismaClient(): PrismaDatabaseClient {
  return new PrismaClient() as unknown as PrismaDatabaseClient;
}