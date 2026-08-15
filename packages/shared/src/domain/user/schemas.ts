import { z } from 'zod';
import { NotificationChannel, NotificationPriority } from '../../enums/notification.enums';
import { Theme } from '../../enums/theme.enums';
import { supportedLanguageSchema, nonEmptyStringSchema, uuidSchema } from '../../schemas/common.schemas';

const textScaleSchema = z.enum(['small', 'medium', 'large']);

export const languagePreferenceSchema = z.object({
  primary: supportedLanguageSchema,
  fallback: z.array(supportedLanguageSchema),
});

export const accessibilitySettingsSchema = z.object({
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
  textScale: textScaleSchema,
  screenReaderOptimized: z.boolean(),
});

export const notificationSettingsSchema = z.object({
  enabled: z.boolean(),
  channels: z.array(z.nativeEnum(NotificationChannel)),
  priority: z.nativeEnum(NotificationPriority),
});

export const preferencesSchema = z.object({
  theme: z.nativeEnum(Theme),
  language: languagePreferenceSchema,
  accessibility: accessibilitySettingsSchema,
  notifications: notificationSettingsSchema,
});

export const userSchema = z.object({
  id: uuidSchema,
  displayName: nonEmptyStringSchema,
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  preferences: preferencesSchema,
});

export type LanguagePreferenceSchema = z.infer<typeof languagePreferenceSchema>;
export type AccessibilitySettingsSchema = z.infer<typeof accessibilitySettingsSchema>;
export type NotificationSettingsSchema = z.infer<typeof notificationSettingsSchema>;
export type PreferencesSchema = z.infer<typeof preferencesSchema>;
export type UserSchema = z.infer<typeof userSchema>;