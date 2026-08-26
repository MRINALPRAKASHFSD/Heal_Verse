import type { Logger, SpeechSynthesisProvider as ApplicationSpeechSynthesisProvider, SpeechSynthesisInput, SpeechSynthesisOutput } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig, ProviderConfig } from '../config';

export abstract class SpeechSynthesisAdapterBase extends BaseAdapter implements ApplicationSpeechSynthesisProvider {
  protected constructor(
    adapterName: string,
    protected readonly provider: ProviderConfig,
    protected readonly config: InfrastructureConfig,
    logger?: Logger,
  ) {
    super(adapterName, logger);
  }

  synthesize(_input: SpeechSynthesisInput): Promise<SpeechSynthesisOutput> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('synthesize'));
  }
}

export class TextToSpeechAdapter extends SpeechSynthesisAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('TextToSpeechAdapter', provider, config, logger);
  }
}