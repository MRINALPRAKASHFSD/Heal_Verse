import type { Logger } from '@healverse/application';
import type { InfrastructureConfig, ProviderConfig } from '../config';
import { EmbeddingProviderBase } from './openai-embedding.provider';

export class GeminiEmbeddingProvider extends EmbeddingProviderBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('GeminiEmbeddingProvider', provider, config, logger);
  }
}