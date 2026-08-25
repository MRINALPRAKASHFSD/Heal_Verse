import type { Logger } from '@healverse/application';
import type { InfrastructureConfig, ProviderConfig } from '../config';
import { EmbeddingProviderBase } from './openai-embedding.provider';

export class LocalEmbeddingProvider extends EmbeddingProviderBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('LocalEmbeddingProvider', provider, config, logger);
  }
}