import type { Logger } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig } from '../config';

export interface BetterAuthAdapterDependencies {
  readonly config: InfrastructureConfig;
  readonly logger?: Logger;
}

export interface BetterAuthSession {
  readonly userId: string;
  readonly sessionId: string;
  readonly expiresAt: string;
}

export class BetterAuthAdapter extends BaseAdapter {
  constructor(private readonly dependencies: BetterAuthAdapterDependencies) {
    super('BetterAuthAdapter', dependencies.logger);
  }

  getSession(): Promise<BetterAuthSession | null> {
    void this.dependencies.config;
    return Promise.reject(this.unavailable('getSession'));
  }

  signOut(): Promise<void> {
    void this.dependencies.config;
    return Promise.reject(this.unavailable('signOut'));
  }
}