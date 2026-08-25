import type { EmbeddingProvider as ApplicationEmbeddingProvider, Logger } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig, ProviderConfig } from '../config';

export abstract class EmbeddingProviderBase extends BaseAdapter implements ApplicationEmbeddingProvider {
  protected constructor(
    adapterName: string,
    protected readonly provider: ProviderConfig,
    protected readonly config: InfrastructureConfig,
    logger?: Logger,
  ) {
    super(adapterName, logger);
  }

  embed(_input: string | readonly string[]): Promise<number[][]> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('embed'));
  }
}

export class OpenAIEmbeddingProvider extends EmbeddingProviderBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('OpenAIEmbeddingProvider', provider, config, logger);
  }
}