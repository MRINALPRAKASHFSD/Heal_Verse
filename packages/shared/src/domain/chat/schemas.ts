import { z } from 'zod';
import { ConversationType, MessageRole, MessageStatus, AttachmentType } from '../../enums/chat.enums';
import { supportedLanguageSchema, themeSchema, isoDateStringSchema, nonEmptyStringSchema, positiveIntegerSchema, nonNegativeIntegerSchema, uuidSchema } from '../../schemas/common.schemas';

export const conversationTypeSchema = z.nativeEnum(ConversationType);
export const messageRoleSchema = z.nativeEnum(MessageRole);
export const messageStatusSchema = z.nativeEnum(MessageStatus);
export const attachmentTypeSchema = z.nativeEnum(AttachmentType);

export const attachmentSchema = z.object({
  id: uuidSchema,
  type: attachmentTypeSchema,
  name: nonEmptyStringSchema,
  mimeType: nonEmptyStringSchema,
  sizeBytes: positiveIntegerSchema,
  createdAt: isoDateStringSchema,
});

export const messageSchema = z.object({
  id: uuidSchema,
  conversationId: uuidSchema,
  role: messageRoleSchema,
  status: messageStatusSchema,
  content: nonEmptyStringSchema,
  attachments: z.array(attachmentSchema),
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
  editedAt: isoDateStringSchema.optional(),
});

export const chatPreferencesSchema = z.object({
  theme: themeSchema,
  language: supportedLanguageSchema,
  sendWithEnter: z.boolean(),
  compactMode: z.boolean(),
  allowAttachments: z.boolean(),
});

export const conversationSummarySchema = z.object({
  id: uuidSchema,
  conversationId: uuidSchema,
  title: nonEmptyStringSchema,
  type: conversationTypeSchema,
  lastMessagePreview: nonEmptyStringSchema,
  messageCount: nonNegativeIntegerSchema,
  updatedAt: isoDateStringSchema,
});

export const conversationSchema = z.object({
  id: uuidSchema,
  title: nonEmptyStringSchema,
  type: conversationTypeSchema,
  summary: conversationSummarySchema.nullable(),
  messageIds: z.array(uuidSchema),
  participantIds: z.array(uuidSchema),
  preferences: chatPreferencesSchema,
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
  archivedAt: isoDateStringSchema.optional(),
  pinnedAt: isoDateStringSchema.optional(),
});

export type ConversationSchema = z.infer<typeof conversationSchema>;
export type ConversationSummarySchema = z.infer<typeof conversationSummarySchema>;
export type MessageSchema = z.infer<typeof messageSchema>;
export type AttachmentSchema = z.infer<typeof attachmentSchema>;
export type ChatPreferencesSchema = z.infer<typeof chatPreferencesSchema>;