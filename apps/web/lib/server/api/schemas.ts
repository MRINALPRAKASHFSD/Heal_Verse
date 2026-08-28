import { z } from 'zod';
import {
  conversationSchema,
  conversationSummarySchema,
  messageSchema,
  nonEmptyStringSchema,
  uuidSchema,
  themeSchema,
  supportedLanguageSchema,
} from '@healverse/shared';
import { createConversationRequestSchema, retrieveConversationRequestSchema, renameConversationRequestSchema, archiveConversationRequestSchema } from '@healverse/application';

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
  userId: uuidSchema,
  q: z.string().trim().optional(),
  archived: booleanSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const conversationCreateBodySchema = createConversationRequestSchema;

export const conversationItemParamsSchema = retrieveConversationRequestSchema;

export const conversationUpdateBodySchema = z
  .object({
    title: nonEmptyStringSchema.optional(),
    archived: booleanSchema.optional(),
  })
  .refine((value) => value.title !== undefined || value.archived !== undefined, {
    message: 'Provide a title or archived flag',
  });

export const conversationMessagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const conversationMessageCreateBodySchema = z.object({
  content: nonEmptyStringSchema,
});

export const conversationPageResponseSchema = z.object({
  items: z.array(conversationSummarySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const messagePageResponseSchema = z.object({
  items: z.array(messageSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const conversationMessageResponseSchema = z.object({
  message: messageSchema,
  assistantMessage: messageSchema,
});

export const conversationResponseSchema = z.object({
  conversation: conversationSchema,
});

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
  requestId: z.string(),
});

export const apiContextSchema = z.object({
  requestId: z.string(),
  path: z.string(),
  method: z.string(),
});

export const requestIdHeaderSchema = z.string().min(1);

export const chatPreferencesRequestSchema = z.object({
  theme: themeSchema,
  language: supportedLanguageSchema,
  sendWithEnter: z.boolean(),
  compactMode: z.boolean(),
  allowAttachments: z.boolean(),
});