import type { Logger } from '@healverse/application';
import type { InfrastructureConfig, ProviderConfig } from '../config';
import { VectorStoreAdapterBase } from './qdrant.adapter';

export class ChromaAdapter extends VectorStoreAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('ChromaAdapter', provider, config, logger);
  }
}