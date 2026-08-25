import type { Logger } from '@healverse/application';
import type { InfrastructureConfig, ProviderConfig } from '../config';
import { VectorStoreAdapterBase } from './qdrant.adapter';

export class PineconeAdapter extends VectorStoreAdapterBase {
  constructor(provider: ProviderConfig, config: InfrastructureConfig, logger?: Logger) {
    super('PineconeAdapter', provider, config, logger);
  }
}