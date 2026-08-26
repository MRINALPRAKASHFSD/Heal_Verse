import type {
  AIProvider as ApplicationAIProvider,
  Cache,
  EmbeddingProvider,
  Logger,
  MemoryRepository,
  MedicalRepository,
  ConversationRepository,
  MessageRepository,
  SettingsRepository,
  Translator,
  SpeechRecognitionProvider,
  SpeechSynthesisProvider,
  OCRProvider,
  UserRepository,
} from '@healverse/application';
import { defaultInfrastructureConfig, getInfrastructureEnvironment, type InfrastructureConfig } from '../config';
import { ConsoleLogger } from '../logger';
import { CacheAdapter } from '../cache';
import { OpenAIProvider, AnthropicProvider, GeminiProvider, AntigravityProvider, OllamaProvider } from '../ai/providers';
import { PrismaConversationRepository, PrismaMemoryRepository, PrismaMedicalRepository, PrismaMessageRepository, PrismaSettingsRepository, PrismaUserRepository } from '../repositories/prisma';
import { GoogleTranslateAdapter, LibreTranslateAdapter, DeepLAdapter } from '../translation';
import { OCRAdapter, SpeechToTextAdapter, TextToSpeechAdapter, WhisperAdapter } from '../speech';
import { QdrantAdapter, PineconeAdapter, ChromaAdapter } from '../vector';
import { OpenAIEmbeddingProvider, GeminiEmbeddingProvider, LocalEmbeddingProvider } from '../embeddings';
import { BetterAuthAdapter } from '../auth';
import { PrismaAdapter } from '../database';
import { createPrismaClient } from '@healverse/database';

export interface InfrastructureContainer {
  readonly logger: Logger;
  readonly cache: Cache;
  readonly aiProviders: ReadonlyArray<ApplicationAIProvider>;
  readonly conversationRepository: ConversationRepository;
  readonly memoryRepository: MemoryRepository;
  readonly medicalRepository: MedicalRepository;
  readonly messageRepository: MessageRepository;
  readonly userRepository: UserRepository;
  readonly settingsRepository: SettingsRepository;
  readonly translator: Translator;
  readonly speechRecognitionProvider: SpeechRecognitionProvider;
  readonly speechSynthesisProvider: SpeechSynthesisProvider;
  readonly ocrProvider: OCRProvider;
  readonly embeddingProvider: EmbeddingProvider;
  readonly authAdapter: BetterAuthAdapter;
  readonly databaseAdapter: PrismaAdapter;
  readonly vectorStores: ReadonlyArray<QdrantAdapter | PineconeAdapter | ChromaAdapter>;
}

function createInfrastructureConfig(config?: Partial<InfrastructureConfig>): InfrastructureConfig {
  return {
    ...defaultInfrastructureConfig,
    ...config,
  };
}

export function createInfrastructureContainer(config?: Partial<InfrastructureConfig>): InfrastructureContainer {
  const environment = getInfrastructureEnvironment();
  void environment;

  const infrastructureConfig = createInfrastructureConfig(config);
  const logger = new ConsoleLogger();
  const db = createPrismaClient();

  const openAiProvider = new OpenAIProvider(infrastructureConfig.aiProviders[0] ?? { name: 'openai' }, logger);
  const anthropicProvider = new AnthropicProvider(infrastructureConfig.aiProviders[1] ?? { name: 'anthropic' }, logger);
  const geminiProvider = new GeminiProvider(infrastructureConfig.aiProviders[2] ?? { name: 'gemini' }, logger);
  const antigravityProvider = new AntigravityProvider(infrastructureConfig.aiProviders[3] ?? { name: 'antigravity' }, logger);
  const ollamaProvider = new OllamaProvider(infrastructureConfig.aiProviders[4] ?? { name: 'ollama' }, logger);

  const conversationRepository = new PrismaConversationRepository({ config: infrastructureConfig, logger, db });
  const memoryRepository = new PrismaMemoryRepository({ config: infrastructureConfig, logger, db });
  const medicalRepository = new PrismaMedicalRepository({ config: infrastructureConfig, logger, db });
  const messageRepository = new PrismaMessageRepository({ config: infrastructureConfig, logger, db });
  const userRepository = new PrismaUserRepository({ config: infrastructureConfig, logger, db });
  const settingsRepository = new PrismaSettingsRepository({ config: infrastructureConfig, logger, db });

  const translator = new GoogleTranslateAdapter(infrastructureConfig.translationProviders[0] ?? { name: 'google-translate' }, infrastructureConfig, logger);
  const speechRecognitionProvider = new WhisperAdapter(infrastructureConfig.speechProviders[0] ?? { name: 'whisper' }, infrastructureConfig, logger);
  const speechSynthesisProvider = new TextToSpeechAdapter(infrastructureConfig.speechProviders[1] ?? { name: 'whisper' }, infrastructureConfig, logger);
  const ocrProvider = new OCRAdapter(infrastructureConfig.speechProviders[2] ?? { name: 'whisper' }, infrastructureConfig, logger);

  const embeddingProvider = new OpenAIEmbeddingProvider(infrastructureConfig.embeddingProviders[0] ?? { name: 'openai-embedding' }, infrastructureConfig, logger);

  const authAdapter = new BetterAuthAdapter({ config: infrastructureConfig, logger });
  const databaseAdapter = new PrismaAdapter({ config: infrastructureConfig, logger });

  return {
    logger,
    cache: new CacheAdapter(logger),
    aiProviders: [openAiProvider, anthropicProvider, geminiProvider, antigravityProvider, ollamaProvider],
    conversationRepository,
    memoryRepository,
    medicalRepository,
    messageRepository,
    userRepository,
    settingsRepository,
    translator,
    speechRecognitionProvider,
    speechSynthesisProvider,
    ocrProvider,
    embeddingProvider,
    authAdapter,
    databaseAdapter,
    vectorStores: [
      new QdrantAdapter(infrastructureConfig.vectorProviders[0] ?? { name: 'qdrant' }, infrastructureConfig, logger),
      new PineconeAdapter(infrastructureConfig.vectorProviders[1] ?? { name: 'pinecone' }, infrastructureConfig, logger),
      new ChromaAdapter(infrastructureConfig.vectorProviders[2] ?? { name: 'chroma' }, infrastructureConfig, logger),
    ],
  };
}