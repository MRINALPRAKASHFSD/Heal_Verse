export interface EmbeddingProvider {
  embed(input: string | readonly string[]): Promise<number[][]>;
}

export interface VectorStore {
  upsert(id: string, vector: readonly number[], metadata?: Record<string, unknown>): Promise<void>;
  query(vector: readonly number[], topK: number): Promise<VectorStoreQueryResult[]>;
  delete(id: string): Promise<void>;
}

export interface VectorStoreQueryResult {
  readonly id: string;
  readonly score: number;
  readonly metadata?: Record<string, unknown>;
}

export interface Translator {
  translate(input: TranslatorInput): Promise<TranslatorOutput>;
}

export interface TranslatorInput {
  readonly sourceText: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
}

export interface TranslatorOutput {
  readonly translatedText: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
}

export interface SpeechRecognitionProvider {
  transcribe(input: SpeechRecognitionInput): Promise<SpeechRecognitionOutput>;
}

export interface SpeechRecognitionInput {
  readonly audio: ArrayBuffer;
  readonly language?: string;
}

export interface SpeechRecognitionOutput {
  readonly text: string;
  readonly language?: string;
}

export interface SpeechSynthesisProvider {
  synthesize(input: SpeechSynthesisInput): Promise<SpeechSynthesisOutput>;
}

export interface SpeechSynthesisInput {
  readonly text: string;
  readonly voice?: string;
  readonly language?: string;
}

export interface SpeechSynthesisOutput {
  readonly audio: ArrayBuffer;
  readonly contentType: string;
}

export interface OCRProvider {
  extractText(input: OCRInput): Promise<OCROutput>;
}

export interface OCRInput {
  readonly image: ArrayBuffer;
  readonly mimeType: string;
}

export interface OCROutput {
  readonly text: string;
}

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}