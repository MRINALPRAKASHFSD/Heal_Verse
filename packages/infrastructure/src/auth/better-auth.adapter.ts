import { randomUUID } from 'node:crypto';
import type { Logger } from '@healverse/application';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { createPrismaClient } from '@healverse/database';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig } from '../config';

export type BetterAuthInstance = ReturnType<typeof createBetterAuthInstance>;

export interface BetterAuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly image?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface BetterAuthSession {
  readonly id: string;
  readonly sessionId: string;
  readonly userId: string;
  readonly expiresAt: Date | string;
  readonly token: string;
  readonly ipAddress?: string | null;
  readonly userAgent?: string | null;
}

export interface BetterAuthSessionPayload {
  readonly user: BetterAuthUser;
  readonly session: BetterAuthSession;
}

export interface BetterAuthAdapterDependencies {
  readonly config: InfrastructureConfig;
  readonly logger?: Logger;
  readonly db?: unknown;
  readonly authInstance?: BetterAuthInstance;
}

export function createBetterAuthInstance(prismaClient?: unknown, options?: { secret?: string; baseURL?: string }) {
  const client = (prismaClient ?? createPrismaClient()) as never;

  return betterAuth({
    database: prismaAdapter(client, {
      provider: 'postgresql',
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    user: {
      fields: {
        name: 'displayName',
        image: 'avatarUrl',
      },
    },
    advanced: {
      database: {
        generateId: 'uuid',
      },
    },
    secret: options?.secret ?? process.env.BETTER_AUTH_SECRET ?? 'healverse-default-better-auth-secret-key-32-chars-min',
    baseURL: options?.baseURL ?? process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  });
}

export class BetterAuthAdapter extends BaseAdapter {
  private readonly auth: BetterAuthInstance;

  constructor(private readonly dependencies: BetterAuthAdapterDependencies) {
    super('BetterAuthAdapter', dependencies.logger);
    this.auth = dependencies.authInstance ?? createBetterAuthInstance(dependencies.db);
  }

  getAuth(): BetterAuthInstance {
    return this.auth;
  }

  async getSession(headers?: Headers): Promise<BetterAuthSessionPayload | null> {
    try {
      if (!headers) {
        return null;
      }

      const result = await this.auth.api.getSession({ headers });
      if (!result || !result.user || !result.session) {
        return null;
      }

      return {
        user: result.user as unknown as BetterAuthUser,
        session: {
          id: result.session.id,
          sessionId: result.session.id,
          userId: result.session.userId,
          expiresAt: result.session.expiresAt,
          token: result.session.token,
          ipAddress: result.session.ipAddress,
          userAgent: result.session.userAgent,
        },
      };
    } catch (error) {
      this.dependencies.logger?.error('Error resolving session in BetterAuthAdapter', { error });
      return null;
    }
  }

  async signOut(headers?: Headers): Promise<void> {
    if (!headers) {
      return;
    }

    try {
      await this.auth.api.signOut({ headers });
    } catch (error) {
      this.dependencies.logger?.error('Error signing out in BetterAuthAdapter', { error });
      throw error;
    }
  }
}