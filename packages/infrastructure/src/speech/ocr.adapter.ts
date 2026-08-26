import type { Logger, OCRProvider as ApplicationOCRProvider, OCRInput, OCROutput } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig, ProviderConfig } from '../config';

export class OCRAdapter extends BaseAdapter implements ApplicationOCRProvider {
  constructor(
    private readonly provider: ProviderConfig,
    private readonly config: InfrastructureConfig,
    logger?: Logger,
  ) {
    super('OCRAdapter', logger);
  }

  extractText(_input: OCRInput): Promise<OCROutput> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('extractText'));
  }
}