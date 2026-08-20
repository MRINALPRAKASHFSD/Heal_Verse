import type {
  AIService,
  AnalyticsService,
  ConversationService,
  LanguageService,
  MedicalService,
  MemoryService,
  NotificationService,
  SafetyService,
  TranslationService,
  VoiceService,
} from '../services';

export interface ApplicationServices {
  readonly conversationService: ConversationService;
  readonly memoryService: MemoryService;
  readonly medicalService: MedicalService;
  readonly translationService: TranslationService;
  readonly safetyService: SafetyService;
  readonly languageService: LanguageService;
  readonly voiceService: VoiceService;
  readonly analyticsService: AnalyticsService;
  readonly notificationService: NotificationService;
  readonly aiService: AIService;
}

export interface ApplicationFactory {
  createServices(): ApplicationServices;
}