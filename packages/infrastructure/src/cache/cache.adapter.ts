import type { Cache as ApplicationCache, Logger } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';

export class CacheAdapter extends BaseAdapter implements ApplicationCache {
  private readonly store = new Map<string, { value: unknown; expiresAt?: number }>();

  constructor(logger?: Logger) {
    super('CacheAdapter', logger);
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}