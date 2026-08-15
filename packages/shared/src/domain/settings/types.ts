import { Theme } from '../../enums/theme.enums';
import { SupportedLanguage } from '../../enums/language.enums';

export interface ChatSettings {
  readonly defaultTheme: Theme;
  readonly defaultLanguage: SupportedLanguage;
  readonly compactLayout: boolean;
  readonly saveHistory: boolean;
  readonly allowFileAttachments: boolean;
}

export interface PrivacySettings {
  readonly shareUsageData: boolean;
  readonly personalizeResponses: boolean;
  readonly allowActivityTracking: boolean;
}

export interface SecuritySettings {
  readonly biometricUnlock: boolean;
  readonly reauthenticateForSensitiveActions: boolean;
  readonly sessionTimeoutMinutes: number;
}

export interface AppearanceSettings {
  readonly theme: Theme;
  readonly density: 'comfortable' | 'compact';
  readonly reducedMotion: boolean;
  readonly highContrast: boolean;
}

export interface Settings {
  readonly chat: ChatSettings;
  readonly privacy: PrivacySettings;
  readonly security: SecuritySettings;
  readonly appearance: AppearanceSettings;
}