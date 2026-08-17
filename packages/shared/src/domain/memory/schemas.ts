import { z } from 'zod';
import { isoDateStringSchema, nonEmptyStringSchema, positiveIntegerSchema, uuidSchema } from '../../schemas/common.schemas';

export const memoryScopeSchema = z.enum(['conversation', 'user', 'workspace']);
export const memoryTypeSchema = z.enum(['fact', 'preference', 'summary', 'safety-note']);

export const memoryItemSchema = z.object({
  id: uuidSchema,
  scope: memoryScopeSchema,
  type: memoryTypeSchema,
  content: nonEmptyStringSchema,
  sourceId: uuidSchema.optional(),
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
});

export const memorySummarySchema = z.object({
  id: uuidSchema,
  scope: memoryScopeSchema,
  itemCount: positiveIntegerSchema,
  lastUpdatedAt: isoDateStringSchema,
});

export type MemoryItemSchema = z.infer<typeof memoryItemSchema>;
export type MemorySummarySchema = z.infer<typeof memorySummarySchema>;