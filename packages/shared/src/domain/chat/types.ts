import type { ISODateString, UUID } from '../../types';
import { ConversationType, MessageRole, MessageStatus, AttachmentType } from '../../enums/chat.enums';
import type { SupportedLanguage } from '../../enums/language.enums';
import type { Theme } from '../../enums/theme.enums';

export { ConversationType, MessageRole, MessageStatus };

export interface Attachment {
  readonly id: UUID;
  readonly type: AttachmentType;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly createdAt: ISODateString;
}

export interface Message {
  readonly id: UUID;
  readonly conversationId: UUID;
  readonly role: MessageRole;
  readonly status: MessageStatus;
  readonly content: string;
  readonly attachments: Attachment[];
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly editedAt?: ISODateString;
}

export interface ChatPreferences {
  readonly theme: Theme;
  readonly language: SupportedLanguage;
  readonly sendWithEnter: boolean;
  readonly compactMode: boolean;
  readonly allowAttachments: boolean;
}

export interface ConversationSummary {
  readonly id: UUID;
  readonly conversationId: UUID;
  readonly title: string;
  readonly type: ConversationType;
  readonly lastMessagePreview: string;
  readonly messageCount: number;
  readonly updatedAt: ISODateString;
}

export interface Conversation {
  readonly id: UUID;
  readonly title: string;
  readonly type: ConversationType;
  readonly summary: ConversationSummary | null;
  readonly messageIds: UUID[];
  readonly participantIds: UUID[];
  readonly preferences: ChatPreferences;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly archivedAt?: ISODateString;
  readonly pinnedAt?: ISODateString;
}