import type { UUID } from '@healverse/shared';

export interface AIProvider {
  readonly name: string;
  generateText(input: AITextGenerationInput): Promise<AITextGenerationResult>;
  generateEmbeddings?(input: AIEmbeddingInput): Promise<AIEmbeddingResult>;
}

export interface AITextGenerationInput {
  readonly prompt: string;
  readonly systemPrompt?: string;
  readonly conversationId?: UUID;
  readonly maxTokens?: number;
  readonly temperature?: number;
}

export interface AITextGenerationResult {
  readonly text: string;
  readonly model: string;
  readonly provider: string;
}

export interface AIEmbeddingInput {
  readonly input: string | readonly string[];
}

export interface AIEmbeddingResult {
  readonly vectors: readonly number[][];
  readonly model: string;
  readonly provider: string;
}