import type { Logger } from '@healverse/application';
import type { InfrastructureConfig, ProviderConfig } from '../config';
import { TranslatorAdapterBase } from './google-translate.adapter';

export class DeepLAdapter extends TranslatorAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('DeepLAdapter', provider, config, logger);
  }
}