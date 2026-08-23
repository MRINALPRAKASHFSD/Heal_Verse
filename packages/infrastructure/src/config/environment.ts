import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ANTIGRAVITY_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),
  GOOGLE_TRANSLATE_API_KEY: z.string().optional(),
  LIBRE_TRANSLATE_BASE_URL: z.string().url().optional(),
  DEEPL_API_KEY: z.string().optional(),
  QDRANT_URL: z.string().url().optional(),
  PINECONE_API_KEY: z.string().optional(),
  CHROMA_URL: z.string().url().optional(),
  CACHE_URL: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
});

export type InfrastructureEnvironment = z.infer<typeof environmentSchema>;

export function getInfrastructureEnvironment(env: NodeJS.ProcessEnv = process.env): InfrastructureEnvironment {
  return environmentSchema.parse(env);
}