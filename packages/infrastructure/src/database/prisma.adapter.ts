import type { Logger } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig } from '../config';

export interface PrismaAdapterDependencies {
  readonly config: InfrastructureConfig;
  readonly logger?: Logger;
}

export class PrismaAdapter extends BaseAdapter {
  constructor(private readonly dependencies: PrismaAdapterDependencies) {
    super('PrismaAdapter', dependencies.logger);
  }

  connect(): Promise<void> {
    void this.dependencies.config;
    return Promise.reject(this.unavailable('connect'));
  }

  disconnect(): Promise<void> {
    void this.dependencies.config;
    return Promise.reject(this.unavailable('disconnect'));
  }
}