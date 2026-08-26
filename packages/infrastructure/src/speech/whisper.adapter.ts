import type { Logger } from '@healverse/application';
import type { InfrastructureConfig, ProviderConfig } from '../config';
import { SpeechRecognitionAdapterBase } from './speech-to-text.adapter';

export class WhisperAdapter extends SpeechRecognitionAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('WhisperAdapter', provider, config, logger);
  }
}