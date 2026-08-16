import { conversationSchema, messageSchema, conversationSummarySchema, chatPreferencesSchema } from './schemas';
import { parseOrThrow, validateValue } from '../../utils';

export const validateConversation = (value: unknown) => validateValue(conversationSchema, value);
export const validateMessage = (value: unknown) => validateValue(messageSchema, value);
export const validateConversationSummary = (value: unknown) => validateValue(conversationSummarySchema, value);
export const validateChatPreferences = (value: unknown) => validateValue(chatPreferencesSchema, value);

export const parseConversation = (value: unknown) => parseOrThrow(conversationSchema, value);
export const parseMessage = (value: unknown) => parseOrThrow(messageSchema, value);