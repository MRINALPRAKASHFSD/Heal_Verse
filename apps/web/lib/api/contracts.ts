import { z } from 'zod';
import {
  conversationSchema,
  conversationSummarySchema,
  messageSchema,
  nonEmptyStringSchema,
  uuidSchema,
} from '@healverse/shared';

const booleanSchema = z.preprocess((value) => {
  if (value === true || value === 'true' || value === '1') {
    return true;
  }

  if (value === false || value === 'false' || value === '0') {
    return false;
  }

  return value;
}, z.boolean());

export const conversationListQuerySchema = z.object({
  userId: uuidSchema.optional(),
  q: z.string().trim().optional(),
  archived: booleanSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const conversationCreateBodySchema = z.object({
  userId: uuidSchema.optional(),
  title: nonEmptyStringSchema.optional(),
});

export const conversationRenameBodySchema = z.object({
  title: nonEmptyStringSchema,
});

export const conversationDeleteResponseSchema = z.object({
  ok: z.literal(true),
});

export const conversationPageResponseSchema = z.object({
  items: z.array(conversationSummarySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const conversationResponseSchema = z.object({
  conversation: conversationSchema,
});

export const conversationMessagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const messagePageResponseSchema = z.object({
  items: z.array(messageSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const conversationMessageCreateBodySchema = z.object({
  content: nonEmptyStringSchema,
});

export const conversationMessageResponseSchema = z.object({
  message: messageSchema,
  assistantMessage: messageSchema,
});

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
  requestId: z.string(),
});

export type ConversationListQuery = z.infer<typeof conversationListQuerySchema>;
export type ConversationPageResponse = z.infer<typeof conversationPageResponseSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
export type ConversationMessagesQuery = z.infer<typeof conversationMessagesQuerySchema>;
export type MessagePageResponse = z.infer<typeof messagePageResponseSchema>;
export type ConversationMessageResponse = z.infer<typeof conversationMessageResponseSchema>;
