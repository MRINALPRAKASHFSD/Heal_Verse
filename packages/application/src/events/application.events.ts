import type { ISODateString, UUID } from '@healverse/shared';
import type { ConversationType, MessageRole, SupportedLanguage } from '@healverse/shared';

export interface BaseApplicationEvent {
  readonly id: UUID;
  readonly type: string;
  readonly occurredAt: ISODateString;
  readonly correlationId?: UUID;
}

export interface ConversationCreated extends BaseApplicationEvent {
  readonly type: 'ConversationCreated';
  readonly conversationId: UUID;
  readonly title: string;
  readonly conversationType: ConversationType;
}

export interface ConversationDeleted extends BaseApplicationEvent {
  readonly type: 'ConversationDeleted';
  readonly conversationId: UUID;
}

export interface MessageSent extends BaseApplicationEvent {
  readonly type: 'MessageSent';
  readonly conversationId: UUID;
  readonly messageId: UUID;
  readonly role: MessageRole;
}

export interface MessageReceived extends BaseApplicationEvent {
  readonly type: 'MessageReceived';
  readonly conversationId: UUID;
  readonly messageId: UUID;
  readonly role: MessageRole;
}

export interface MemorySaved extends BaseApplicationEvent {
  readonly type: 'MemorySaved';
  readonly memoryId: UUID;
  readonly scope: 'conversation' | 'user' | 'workspace';
}

export interface EmergencyDetected extends BaseApplicationEvent {
  readonly type: 'EmergencyDetected';
  readonly conversationId?: UUID;
  readonly severity: 'low' | 'moderate' | 'high' | 'critical';
  readonly keywords: string[];
}

export interface LanguageDetected extends BaseApplicationEvent {
  readonly type: 'LanguageDetected';
  readonly language: SupportedLanguage;
}

export interface TranslationCompleted extends BaseApplicationEvent {
  readonly type: 'TranslationCompleted';
  readonly sourceLanguage: SupportedLanguage;
  readonly targetLanguage: SupportedLanguage;
  readonly sourceMessageId?: UUID;
}

export type ApplicationEvent =
  | ConversationCreated
  | ConversationDeleted
  | MessageSent
  | MessageReceived
  | MemorySaved
  | EmergencyDetected
  | LanguageDetected
  | TranslationCompleted;