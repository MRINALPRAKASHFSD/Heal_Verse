import { ConversationType, MessageRole, MessageStatus } from '../enums/chat.enums';
import { DiseaseCategory, EmergencyLevel, RiskLevel } from '../enums/medical.enums';
import { NotificationChannel, NotificationPriority } from '../enums/notification.enums';
import { SupportedLanguage } from '../enums/language.enums';
import { Theme } from '../enums/theme.enums';

export const SUPPORTED_LANGUAGE_OPTIONS = [
  SupportedLanguage.EnglishUS,
  SupportedLanguage.EnglishGB,
  SupportedLanguage.SpanishES,
  SupportedLanguage.FrenchFR,
  SupportedLanguage.GermanDE,
  SupportedLanguage.ItalianIT,
  SupportedLanguage.PortugueseBR,
  SupportedLanguage.HindiIN,
  SupportedLanguage.JapaneseJP,
  SupportedLanguage.KoreanKR,
  SupportedLanguage.ChineseCN,
  SupportedLanguage.ArabicSA,
] as const;

export const SUPPORTED_LANGUAGE_LABELS = {
  [SupportedLanguage.EnglishUS]: 'English (US)',
  [SupportedLanguage.EnglishGB]: 'English (UK)',
  [SupportedLanguage.SpanishES]: 'Spanish',
  [SupportedLanguage.FrenchFR]: 'French',
  [SupportedLanguage.GermanDE]: 'German',
  [SupportedLanguage.ItalianIT]: 'Italian',
  [SupportedLanguage.PortugueseBR]: 'Portuguese (Brazil)',
  [SupportedLanguage.HindiIN]: 'Hindi',
  [SupportedLanguage.JapaneseJP]: 'Japanese',
  [SupportedLanguage.KoreanKR]: 'Korean',
  [SupportedLanguage.ChineseCN]: 'Chinese (Simplified)',
  [SupportedLanguage.ArabicSA]: 'Arabic',
} as const;

export const EMERGENCY_KEYWORDS = ['chest pain', 'severe shortness of breath', 'loss of consciousness', 'stroke'] as const;

export const DEFAULT_SETTINGS = {
  theme: Theme.System,
  language: SupportedLanguage.EnglishUS,
  conversationType: ConversationType.General,
  messageStatus: MessageStatus.Sent,
  emergencyLevel: EmergencyLevel.Low,
  riskLevel: RiskLevel.Minimal,
  notificationChannel: NotificationChannel.InApp,
  notificationPriority: NotificationPriority.Normal,
} as const;

export const MESSAGE_LIMITS = {
  maxLength: 8000,
  maxAttachmentsPerMessage: 5,
  maxConversationTitleLength: 120,
  maxSummaryLength: 240,
} as const;

export const FILE_LIMITS = {
  maxFileSizeBytes: 20 * 1024 * 1024,
  maxImageSizeBytes: 10 * 1024 * 1024,
  allowedAttachmentTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'text/plain'] as const,
} as const;

export const SUPPORTED_AI_PROVIDERS = ['openai', 'anthropic', 'gemini', 'antigravity', 'ollama'] as const;

export const MEDICAL_CATEGORIES = [
  DiseaseCategory.Infectious,
  DiseaseCategory.Cardiovascular,
  DiseaseCategory.Respiratory,
  DiseaseCategory.Endocrine,
  DiseaseCategory.Neurological,
  DiseaseCategory.Musculoskeletal,
  DiseaseCategory.Gastrointestinal,
  DiseaseCategory.Dermatological,
  DiseaseCategory.MentalHealth,
  DiseaseCategory.Other,
] as const;

export const THEME_CONSTANTS = {
  light: Theme.Light,
  dark: Theme.Dark,
  system: Theme.System,
} as const;

export const MEDICAL_DISCLAIMER_TEXT =
  'HealVerse is not a substitute for professional medical advice, diagnosis, or treatment.';
