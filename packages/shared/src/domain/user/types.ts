import type { UUID } from '../../types';
import { SupportedLanguage } from '../../enums/language.enums';
import { Theme } from '../../enums/theme.enums';
import { NotificationChannel, NotificationPriority } from '../../enums/notification.enums';

export { Theme };

export interface LanguagePreference {
  readonly primary: SupportedLanguage;
  readonly fallback: SupportedLanguage[];
}

export interface AccessibilitySettings {
  readonly reducedMotion: boolean;
  readonly highContrast: boolean;
  readonly textScale: 'small' | 'medium' | 'large';
  readonly screenReaderOptimized: boolean;
}

export interface NotificationSettings {
  readonly enabled: boolean;
  readonly channels: NotificationChannel[];
  readonly priority: NotificationPriority;
}

export interface Preferences {
  readonly theme: Theme;
  readonly language: LanguagePreference;
  readonly accessibility: AccessibilitySettings;
  readonly notifications: NotificationSettings;
}

export interface User {
  readonly id: UUID;
  readonly displayName: string;
  readonly email?: string;
  readonly avatarUrl?: string;
  readonly preferences: Preferences;
}