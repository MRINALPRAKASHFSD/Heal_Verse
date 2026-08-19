import { z } from 'zod';
import { messageSchema, nonEmptyStringSchema, translationDirectionSchema, supportedLanguageSchema, uuidSchema } from '@healverse/shared';

export const sendMessageRequestSchema = z.object({
  conversationId: uuidSchema,
  message: messageSchema,
});

export const sendMessageResponseSchema = z.object({
  message: messageSchema,
});

export const receiveMessageRequestSchema = z.object({
  conversationId: uuidSchema,
  message: messageSchema,
});

export const receiveMessageResponseSchema = z.object({
  message: messageSchema,
});

export const generateConversationTitleRequestSchema = z.object({
  conversationId: uuidSchema,
  messages: z.array(messageSchema),
});

export const generateConversationTitleResponseSchema = z.object({
  title: nonEmptyStringSchema,
});

export const conversationMessageListResponseSchema = z.object({
  items: z.array(messageSchema),
});

export const translateMessageRequestSchema = z.object({
  text: nonEmptyStringSchema,
  direction: translationDirectionSchema,
});

export const translateMessageResponseSchema = z.object({
  translatedText: nonEmptyStringSchema,
  direction: translationDirectionSchema,
});

export const detectLanguageRequestSchema = z.object({
  text: nonEmptyStringSchema,
});

export const detectLanguageResponseSchema = z.object({
  language: supportedLanguageSchema,
  confidence: z.number().min(0).max(100),
});

export type SendMessageRequestDto = z.infer<typeof sendMessageRequestSchema>;
export type SendMessageResponseDto = z.infer<typeof sendMessageResponseSchema>;
export type ReceiveMessageRequestDto = z.infer<typeof receiveMessageRequestSchema>;
export type ReceiveMessageResponseDto = z.infer<typeof receiveMessageResponseSchema>;
export type GenerateConversationTitleRequestDto = z.infer<typeof generateConversationTitleRequestSchema>;
export type GenerateConversationTitleResponseDto = z.infer<typeof generateConversationTitleResponseSchema>;
export type ConversationMessageListResponseDto = z.infer<typeof conversationMessageListResponseSchema>;
export type TranslateMessageRequestDto = z.infer<typeof translateMessageRequestSchema>;
export type TranslateMessageResponseDto = z.infer<typeof translateMessageResponseSchema>;
export type DetectLanguageRequestDto = z.infer<typeof detectLanguageRequestSchema>;
export type DetectLanguageResponseDto = z.infer<typeof detectLanguageResponseSchema>;