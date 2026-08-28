import { randomUUID } from 'node:crypto';
import type { ConversationService, AIService, MemoryService, MedicalService, TranslationService, SafetyService, LanguageService, VoiceService, AnalyticsService, NotificationService, CreateConversationInput, RenameConversationInput, SendMessageInput, SendMessageResult, ReceiveMessageInput, ReceiveMessageResult, GenerateConversationTitleInput, GenerateConversationTitleResult, RetrieveConversationInput } from '@healverse/application';
import type { Conversation, Message, Settings, UUID, Logger, ConversationSummary } from '@healverse/application';
import type { ConversationRepository, MessageRepository, SettingsRepository, UserRepository, MedicalRepository, MemoryRepository } from '@healverse/application';
import type { ChatPreferences, SupportedLanguage, Theme } from '@healverse/shared';
import { BadRequestError, NotFoundError } from './errors';

export interface ApiServicesDependencies {
  readonly conversationRepository: ConversationRepository;
  readonly messageRepository: MessageRepository;
  readonly settingsRepository: SettingsRepository;
  readonly userRepository: UserRepository;
  readonly medicalRepository: MedicalRepository;
  readonly memoryRepository: MemoryRepository;
  readonly logger: Logger;
}

export interface ConversationPageResult {
  readonly items: ConversationSummary[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface MessagePageResult {
  readonly items: Message[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface ChatApiServices {
  readonly conversationService: ConversationService;
  readonly aiService: AIService;
  readonly searchConversations: (input: { userId: UUID; query?: string; archived?: boolean; page: number; pageSize: number }) => Promise<ConversationPageResult>;
  readonly listConversationMessages: (input: { conversationId: UUID; page: number; pageSize: number }) => Promise<MessagePageResult>;
}

function createDefaultSettings(): Settings {
  return {
    chat: {
      defaultTheme: 'system' as Theme,
      defaultLanguage: 'en-US' as SupportedLanguage,
      compactLayout: false,
      saveHistory: true,
      allowFileAttachments: true,
    },
    privacy: {
      shareUsageData: false,
      personalizeResponses: false,
      allowActivityTracking: false,
    },
    security: {
      biometricUnlock: false,
      reauthenticateForSensitiveActions: true,
      sessionTimeoutMinutes: 30,
    },
    appearance: {
      theme: 'system' as Theme,
      density: 'comfortable',
      reducedMotion: false,
      highContrast: false,
    },
  };
}

function createDefaultChatPreferences(settings?: Settings | null): ChatPreferences {
  const resolvedSettings = settings ?? createDefaultSettings();

  return {
    theme: resolvedSettings.appearance.theme,
    language: resolvedSettings.chat.defaultLanguage,
    sendWithEnter: !resolvedSettings.chat.compactLayout,
    compactMode: resolvedSettings.chat.compactLayout,
    allowAttachments: resolvedSettings.chat.allowFileAttachments,
  };
}

function truncatePreview(text: string, maxLength = 120): string {
  const normalized = text.trim();
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function buildSummary(conversation: Conversation, messages: Message[]): ConversationSummary {
  const lastMessage = messages.at(-1);

  return {
    id: conversation.id,
    conversationId: conversation.id,
    title: conversation.title,
    type: conversation.type,
    lastMessagePreview: truncatePreview(lastMessage?.content ?? conversation.title),
    messageCount: Math.max(messages.length, conversation.messageIds.length, 0),
    updatedAt: lastMessage?.updatedAt ?? conversation.updatedAt,
  };
}

function createConversationStub(input: CreateConversationInput, settings?: Settings | null): Conversation {
  const now = new Date().toISOString();

  return {
    id: randomUUID() as UUID,
    title: input.title?.trim() || 'Untitled conversation',
    type: 'general',
    summary: null,
    messageIds: [],
    participantIds: [input.userId],
    preferences: createDefaultChatPreferences(settings),
    createdAt: now,
    updatedAt: now,
  };
}

function createMessageStub(conversationId: UUID, content: string, role: Message['role']): Message {
  const now = new Date().toISOString();

  return {
    id: randomUUID() as UUID,
    conversationId,
    role,
    status: 'sent',
    content,
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
}

class ConversationServiceImpl implements ConversationService {
  constructor(private readonly dependencies: ApiServicesDependencies) {}

  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    const settings = await this.dependencies.settingsRepository.findByUserId(input.userId);
    const conversation = createConversationStub(input, settings);
    return this.dependencies.conversationRepository.create(conversation);
  }

  async deleteConversation(conversationId: UUID): Promise<void> {
    const conversation = await this.dependencies.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found', { conversationId });
    }

    await this.dependencies.conversationRepository.delete(conversationId);
  }

  async renameConversation(input: RenameConversationInput): Promise<Conversation> {
    const conversation = await this.dependencies.conversationRepository.findById(input.conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found', { conversationId: input.conversationId });
    }

    return this.dependencies.conversationRepository.update({
      ...conversation,
      title: input.title.trim(),
    });
  }

  async archiveConversation(conversationId: UUID): Promise<Conversation> {
    const conversation = await this.dependencies.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found', { conversationId });
    }

    return this.dependencies.conversationRepository.update({
      ...conversation,
      archivedAt: new Date().toISOString(),
    });
  }

  async saveConversation(conversation: Conversation): Promise<Conversation> {
    const existing = await this.dependencies.conversationRepository.findById(conversation.id);
    return existing ? this.dependencies.conversationRepository.update(conversation) : this.dependencies.conversationRepository.create(conversation);
  }

  async retrieveConversation(conversationId: UUID): Promise<Conversation | null> {
    return this.dependencies.conversationRepository.findById(conversationId);
  }
}

class AiServiceImpl implements AIService {
  constructor(private readonly dependencies: ApiServicesDependencies) {}

  async generateConversationTitle(input: GenerateConversationTitleInput): Promise<GenerateConversationTitleResult> {
    const firstUserMessage = input.messages.find((message) => message.role === 'user')?.content ?? input.messages.at(0)?.content ?? 'New conversation';
    return { title: truncatePreview(firstUserMessage, 48) };
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const createdMessage = await this.dependencies.messageRepository.create(input.message);
    return { message: createdMessage };
  }

  async receiveMessage(input: ReceiveMessageInput): Promise<ReceiveMessageResult> {
    const response = createMessageStub(input.conversationId, `Mock assistant response: ${truncatePreview(input.message.content, 100)}`, 'assistant');
    return { message: response };
  }
}

export function createChatApiServices(dependencies: ApiServicesDependencies): ChatApiServices {
  const conversationService = new ConversationServiceImpl(dependencies);
  const aiService = new AiServiceImpl(dependencies);

  return {
    conversationService,
    aiService,
    async searchConversations(input) {
      const conversations = await dependencies.conversationRepository.findManyByUserId(input.userId);
      const filtered = await Promise.all(
        conversations
          .filter((conversation) => (input.archived === undefined ? true : Boolean(conversation.archivedAt) === input.archived))
          .map(async (conversation) => {
            const messages = await dependencies.messageRepository.findByConversationId(conversation.id);
            const summary = buildSummary(conversation, messages);
            return {
              conversation,
              messages,
              summary,
            };
          }),
      );

      const query = input.query?.trim().toLowerCase();
      const matched = query
        ? filtered.filter(({ conversation, summary, messages }) => {
            const haystack = [conversation.title, summary.lastMessagePreview, ...messages.map((message) => message.content)]
              .join(' ')
              .toLowerCase();
            return haystack.includes(query);
          })
        : filtered;

      const sorted = matched.sort((left, right) => right.summary.updatedAt.localeCompare(left.summary.updatedAt));
      const total = sorted.length;
      const startIndex = (input.page - 1) * input.pageSize;
      const items = sorted.slice(startIndex, startIndex + input.pageSize).map(({ summary }) => summary);

      return { items, total, page: input.page, pageSize: input.pageSize };
    },
    async listConversationMessages(input) {
      const messages = await dependencies.messageRepository.findByConversationId(input.conversationId);
      const total = messages.length;
      const startIndex = (input.page - 1) * input.pageSize;
      const items = messages.slice(startIndex, startIndex + input.pageSize);
      return { items, total, page: input.page, pageSize: input.pageSize };
    },
  };
}