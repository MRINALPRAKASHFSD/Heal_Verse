import { z } from 'zod';
import { memoryItemSchema, memorySummarySchema, uuidSchema } from '@healverse/shared';

export const saveMemoryRequestSchema = z.object({
  memory: memoryItemSchema,
});

export const saveMemoryResponseSchema = z.object({
  memory: memoryItemSchema,
});

export const retrieveMemoryRequestSchema = z.object({
  memoryId: uuidSchema,
});

export const retrieveMemoryResponseSchema = z.object({
  memory: memoryItemSchema.nullable(),
});

export const memorySummaryResponseSchema = z.object({
  summary: memorySummarySchema,
});

export type SaveMemoryRequestDto = z.infer<typeof saveMemoryRequestSchema>;
export type SaveMemoryResponseDto = z.infer<typeof saveMemoryResponseSchema>;
export type RetrieveMemoryRequestDto = z.infer<typeof retrieveMemoryRequestSchema>;
export type RetrieveMemoryResponseDto = z.infer<typeof retrieveMemoryResponseSchema>;
export type MemorySummaryResponseDto = z.infer<typeof memorySummaryResponseSchema>;