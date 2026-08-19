import { z } from 'zod';
import {
  conversationSchema,
  conversationSummarySchema,
  conversationTypeSchema,
  isoDateStringSchema,
  nonEmptyStringSchema,
  uuidSchema,
} from '@healverse/shared';

export const createConversationRequestSchema = z.object({
  userId: uuidSchema,
  title: nonEmptyStringSchema.optional(),
});

export const createConversationResponseSchema = z.object({
  conversation: conversationSchema,
});

export const deleteConversationRequestSchema = z.object({
  conversationId: uuidSchema,
});

export const renameConversationRequestSchema = z.object({
  conversationId: uuidSchema,
  title: nonEmptyStringSchema,
});

export const archiveConversationRequestSchema = z.object({
  conversationId: uuidSchema,
});

export const saveConversationRequestSchema = z.object({
  conversation: conversationSchema,
});

export const retrieveConversationRequestSchema = z.object({
  conversationId: uuidSchema,
});

export const conversationSummaryDtoSchema = z.object({
  id: uuidSchema,
  conversationId: uuidSchema,
  title: nonEmptyStringSchema,
  type: conversationTypeSchema,
  lastMessagePreview: nonEmptyStringSchema,
  messageCount: z.number().int().positive(),
  updatedAt: isoDateStringSchema,
});

export const archiveConversationResponseSchema = z.object({
  conversation: conversationSchema,
});

export const retrieveConversationResponseSchema = z.object({
  conversation: conversationSchema.nullable(),
});

export type CreateConversationRequestDto = z.infer<typeof createConversationRequestSchema>;
export type CreateConversationResponseDto = z.infer<typeof createConversationResponseSchema>;
export type DeleteConversationRequestDto = z.infer<typeof deleteConversationRequestSchema>;
export type RenameConversationRequestDto = z.infer<typeof renameConversationRequestSchema>;
export type ArchiveConversationRequestDto = z.infer<typeof archiveConversationRequestSchema>;
export type SaveConversationRequestDto = z.infer<typeof saveConversationRequestSchema>;
export type RetrieveConversationRequestDto = z.infer<typeof retrieveConversationRequestSchema>;
export type ConversationSummaryDto = z.infer<typeof conversationSummaryDtoSchema>;
export type ArchiveConversationResponseDto = z.infer<typeof archiveConversationResponseSchema>;
export type RetrieveConversationResponseDto = z.infer<typeof retrieveConversationResponseSchema>;