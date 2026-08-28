import { ConsoleLogger } from '@healverse/infrastructure';
import { createInfrastructureContainer, type InfrastructureContainer } from '@healverse/infrastructure';
import { createChatApiServices, type ChatApiServices } from './services';

export interface ApiRuntime {
  readonly container: InfrastructureContainer;
  readonly services: ChatApiServices;
  readonly logger: ConsoleLogger;
}

let cachedRuntime: ApiRuntime | null = null;

export function createApiRuntime(): ApiRuntime {
  const logger = new ConsoleLogger();
  const container = createInfrastructureContainer();

  return {
    container,
    logger,
    services: createChatApiServices({
      conversationRepository: container.conversationRepository,
      messageRepository: container.messageRepository,
      settingsRepository: container.settingsRepository,
      userRepository: container.userRepository,
      medicalRepository: container.medicalRepository,
      memoryRepository: container.memoryRepository,
      logger,
    }),
  };
}

export function getDefaultApiRuntime(): ApiRuntime {
  if (!cachedRuntime) {
    cachedRuntime = createApiRuntime();
  }

  return cachedRuntime;
}