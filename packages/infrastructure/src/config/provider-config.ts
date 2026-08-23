export type ProviderName =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'antigravity'
  | 'ollama'
  | 'google-translate'
  | 'libre-translate'
  | 'deepl'
  | 'whisper'
  | 'qdrant'
  | 'pinecone'
  | 'chroma'
  | 'openai-embedding'
  | 'gemini-embedding'
  | 'local-embedding';

export interface ProviderConfig {
  readonly name: ProviderName;
  readonly baseUrl?: string;
  readonly apiKey?: string;
  readonly model?: string;
  readonly region?: string;
}

export interface InfrastructureConfig {
  readonly aiProviders: ReadonlyArray<ProviderConfig>;
  readonly translationProviders: ReadonlyArray<ProviderConfig>;
  readonly speechProviders: ReadonlyArray<ProviderConfig>;
  readonly vectorProviders: ReadonlyArray<ProviderConfig>;
  readonly embeddingProviders: ReadonlyArray<ProviderConfig>;
  readonly authProvider?: ProviderConfig;
  readonly databaseProvider?: ProviderConfig;
  readonly cacheProvider?: ProviderConfig;
}

export const defaultInfrastructureConfig: InfrastructureConfig = {
  aiProviders: [],
  translationProviders: [],
  speechProviders: [],
  vectorProviders: [],
  embeddingProviders: [],
};