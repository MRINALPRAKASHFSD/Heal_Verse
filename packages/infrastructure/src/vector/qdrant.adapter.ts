import type { Logger, VectorStore as ApplicationVectorStore, VectorStoreQueryResult } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig, ProviderConfig } from '../config';

export abstract class VectorStoreAdapterBase extends BaseAdapter implements ApplicationVectorStore {
  protected constructor(
    adapterName: string,
    protected readonly provider: ProviderConfig,
    protected readonly config: InfrastructureConfig,
    logger?: Logger,
  ) {
    super(adapterName, logger);
  }

  upsert(_id: string, _vector: readonly number[], _metadata?: Record<string, unknown>): Promise<void> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('upsert'));
  }

  query(_vector: readonly number[], _topK: number): Promise<VectorStoreQueryResult[]> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('query'));
  }

  delete(_id: string): Promise<void> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('delete'));
  }
}

export class QdrantAdapter extends VectorStoreAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('QdrantAdapter', provider, config, logger);
  }
}