import type { Logger } from '@healverse/application';
import { AdapterNotConfiguredError } from './adapter-errors';

export abstract class BaseAdapter {
  protected constructor(
    protected readonly adapterName: string,
    protected readonly logger?: Logger,
  ) {}

  protected unavailable(operation: string): never {
    this.logger?.warn(`${this.adapterName} unavailable for ${operation}`);
    throw new AdapterNotConfiguredError(this.adapterName, operation);
  }
}