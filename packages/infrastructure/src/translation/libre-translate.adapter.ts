import type { Logger } from '@healverse/application';
import type { InfrastructureConfig, ProviderConfig } from '../config';
import { TranslatorAdapterBase } from './google-translate.adapter';

export class LibreTranslateAdapter extends TranslatorAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('LibreTranslateAdapter', provider, config, logger);
  }
}