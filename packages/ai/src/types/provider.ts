export type AIModelCapability = 'chat' | 'embeddings' | 'tools';

export type AIProviderName = 'openai' | 'anthropic' | 'gemini' | 'antigravity' | 'ollama';

export type AIProviderConfig = {
  name: AIProviderName;
};

export interface AIProvider {
  readonly name: AIProviderName;
  readonly capabilities: AIModelCapability[];
}