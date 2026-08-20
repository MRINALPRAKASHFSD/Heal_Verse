import type { UUID } from '@healverse/shared';
import type { Conversation, Message, MedicalProfile, MemoryItem, SupportedLanguage, Settings, User, TranslationDirection } from '@healverse/shared';

export interface ConversationService {
  createConversation(input: CreateConversationInput): Promise<Conversation>;
  deleteConversation(conversationId: UUID): Promise<void>;
  renameConversation(input: RenameConversationInput): Promise<Conversation>;
  archiveConversation(conversationId: UUID): Promise<Conversation>;
  saveConversation(conversation: Conversation): Promise<Conversation>;
  retrieveConversation(conversationId: UUID): Promise<Conversation | null>;
}

export interface MemoryService {
  saveMemory(input: SaveMemoryInput): Promise<MemoryItem>;
  retrieveMemory(memoryId: UUID): Promise<MemoryItem | null>;
}

export interface MedicalService {
  detectEmergency(input: DetectEmergencyInput): Promise<DetectEmergencyResult>;
  generateMedicalResponse(input: GenerateMedicalResponseInput): Promise<GenerateMedicalResponseResult>;
  generateFollowUpQuestions(input: GenerateFollowUpQuestionsInput): Promise<GenerateFollowUpQuestionsResult>;
  analyzeSymptoms(input: AnalyzeSymptomsInput): Promise<AnalyzeSymptomsResult>;
  summarizeConversation(input: SummarizeConversationInput): Promise<SummarizeConversationResult>;
}

export interface TranslationService {
  translateMessage(input: TranslateMessageInput): Promise<TranslateMessageResult>;
  detectLanguage(input: DetectLanguageInput): Promise<DetectLanguageResult>;
}

export interface SafetyService {
  detectEmergency(input: DetectEmergencyInput): Promise<DetectEmergencyResult>;
}

export interface LanguageService {
  detectLanguage(input: DetectLanguageInput): Promise<DetectLanguageResult>;
  translate(input: TranslateMessageInput): Promise<TranslateMessageResult>;
}

export interface VoiceService {
  transcribe(input: VoiceTranscriptionInput): Promise<VoiceTranscriptionResult>;
  synthesize(input: VoiceSynthesisInput): Promise<VoiceSynthesisResult>;
}

export interface AnalyticsService {
  track(event: AnalyticsEventInput): Promise<void>;
}

export interface NotificationService {
  notify(input: NotificationInput): Promise<void>;
}

export interface AIService {
  generateConversationTitle(input: GenerateConversationTitleInput): Promise<GenerateConversationTitleResult>;
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
  receiveMessage(input: ReceiveMessageInput): Promise<ReceiveMessageResult>;
}

export interface CreateConversationInput {
  readonly userId: UUID;
  readonly title?: string;
}

export interface RenameConversationInput {
  readonly conversationId: UUID;
  readonly title: string;
}

export interface SaveMemoryInput {
  readonly memory: MemoryItem;
}

export interface DetectEmergencyInput {
  readonly text: string;
  readonly conversationId?: UUID;
}

export interface DetectEmergencyResult {
  readonly isEmergency: boolean;
  readonly severity: 'low' | 'moderate' | 'high' | 'critical';
  readonly keywords: string[];
}

export interface GenerateMedicalResponseInput {
  readonly conversationId: UUID;
  readonly userId: UUID;
  readonly profile?: MedicalProfile;
  readonly message: Message;
}

export interface GenerateMedicalResponseResult {
  readonly responseText: string;
  readonly followUpSuggested: boolean;
}

export interface GenerateFollowUpQuestionsInput {
  readonly conversationId: UUID;
  readonly context: string;
}

export interface GenerateFollowUpQuestionsResult {
  readonly questions: string[];
}

export interface AnalyzeSymptomsInput {
  readonly profile: MedicalProfile;
  readonly symptoms: string[];
}

export interface AnalyzeSymptomsResult {
  readonly summary: string;
}

export interface SummarizeConversationInput {
  readonly conversationId: UUID;
  readonly messages: Message[];
}

export interface SummarizeConversationResult {
  readonly summary: string;
}

export interface UpdateUserPreferencesInput {
  readonly userId: UUID;
  readonly preferences: User['preferences'];
}

export interface DetectLanguageInput {
  readonly text: string;
}

export interface DetectLanguageResult {
  readonly language: SupportedLanguage;
  readonly confidence: number;
}

export interface TranslateMessageInput {
  readonly text: string;
  readonly direction: TranslationDirection;
}

export interface TranslateMessageResult {
  readonly translatedText: string;
  readonly direction: TranslationDirection;
}

export interface VoiceTranscriptionInput {
  readonly audio: ArrayBuffer;
}

export interface VoiceTranscriptionResult {
  readonly text: string;
}

export interface VoiceSynthesisInput {
  readonly text: string;
}

export interface VoiceSynthesisResult {
  readonly audio: ArrayBuffer;
}

export interface AnalyticsEventInput {
  readonly name: string;
  readonly properties?: Record<string, unknown>;
}

export interface NotificationInput {
  readonly userId: UUID;
  readonly title: string;
  readonly body: string;
}

export interface GenerateConversationTitleInput {
  readonly conversationId: UUID;
  readonly messages: Message[];
}

export interface GenerateConversationTitleResult {
  readonly title: string;
}

export interface SendMessageInput {
  readonly conversationId: UUID;
  readonly message: Message;
}

export interface SendMessageResult {
  readonly message: Message;
}

export interface ReceiveMessageInput {
  readonly conversationId: UUID;
  readonly message: Message;
}

export interface ReceiveMessageResult {
  readonly message: Message;
}

export interface UpdateUserPreferencesResult {
  readonly user: User;
}

export interface RetrieveConversationInput {
  readonly conversationId: UUID;
}

export interface RetrieveMemoryInput {
  readonly memoryId: UUID;
}