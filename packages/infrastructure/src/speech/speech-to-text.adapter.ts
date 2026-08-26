import type { Logger, SpeechRecognitionProvider as ApplicationSpeechRecognitionProvider, SpeechRecognitionInput, SpeechRecognitionOutput } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig, ProviderConfig } from '../config';

export abstract class SpeechRecognitionAdapterBase extends BaseAdapter implements ApplicationSpeechRecognitionProvider {
  protected constructor(
    adapterName: string,
    protected readonly provider: ProviderConfig,
    protected readonly config: InfrastructureConfig,
    logger?: Logger,
  ) {
    super(adapterName, logger);
  }

  transcribe(_input: SpeechRecognitionInput): Promise<SpeechRecognitionOutput> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('transcribe'));
  }
}

export class SpeechToTextAdapter extends SpeechRecognitionAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('SpeechToTextAdapter', provider, config, logger);
  }
}