import type { InfrastructureConfig } from '../config';
import type { InfrastructureContainer } from '../dependency-injection/container';

export interface InfrastructureFactory {
  createContainer(config?: Partial<InfrastructureConfig>): InfrastructureContainer;
}