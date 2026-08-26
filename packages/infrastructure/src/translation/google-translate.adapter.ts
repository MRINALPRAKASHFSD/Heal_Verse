import type { Logger, Translator as ApplicationTranslator, TranslatorInput, TranslatorOutput } from '@healverse/application';
import { BaseAdapter } from '../adapters/base.adapter';
import type { InfrastructureConfig, ProviderConfig } from '../config';

export abstract class TranslatorAdapterBase extends BaseAdapter implements ApplicationTranslator {
  protected constructor(
    adapterName: string,
    protected readonly provider: ProviderConfig,
    protected readonly config: InfrastructureConfig,
    logger?: Logger,
  ) {
    super(adapterName, logger);
  }

  translate(_input: TranslatorInput): Promise<TranslatorOutput> {
    void this.provider;
    void this.config;
    return Promise.reject(this.unavailable('translate'));
  }
}

export class GoogleTranslateAdapter extends TranslatorAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('GoogleTranslateAdapter', provider, config, logger);
  }
}