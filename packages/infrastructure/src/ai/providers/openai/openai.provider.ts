import type { AIProvider as ApplicationAIProvider, AIEmbeddingInput, AIEmbeddingResult, AITextGenerationInput, AITextGenerationResult } from '@healverse/application';
import type { Logger } from '@healverse/application';
import type { ProviderConfig } from '../../../config';
import { BaseAdapter } from '../../../adapters/base.adapter';

export class OpenAIProvider extends BaseAdapter implements ApplicationAIProvider {
  readonly name = 'openai';

  constructor(
    private readonly config: ProviderConfig,
    logger?: Logger,
  ) {
    super('OpenAIProvider', logger);
  }

  generateText(_input: AITextGenerationInput): Promise<AITextGenerationResult> {
    void this.config;
    return Promise.reject(this.unavailable('generateText'));
  }

  generateEmbeddings(_input: AIEmbeddingInput): Promise<AIEmbeddingResult> {
    void this.config;
    return Promise.reject(this.unavailable('generateEmbeddings'));
  }
}