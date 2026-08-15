import { z } from 'zod';
import { Theme } from '../../enums/theme.enums';
import { supportedLanguageSchema, positiveIntegerSchema } from '../../schemas/common.schemas';

const densitySchema = z.enum(['comfortable', 'compact']);

export const chatSettingsSchema = z.object({
  defaultTheme: z.nativeEnum(Theme),
  defaultLanguage: supportedLanguageSchema,
  compactLayout: z.boolean(),
  saveHistory: z.boolean(),
  allowFileAttachments: z.boolean(),
});

export const privacySettingsSchema = z.object({
  shareUsageData: z.boolean(),
  personalizeResponses: z.boolean(),
  allowActivityTracking: z.boolean(),
});

export const securitySettingsSchema = z.object({
  biometricUnlock: z.boolean(),
  reauthenticateForSensitiveActions: z.boolean(),
  sessionTimeoutMinutes: positiveIntegerSchema,
});

export const appearanceSettingsSchema = z.object({
  theme: z.nativeEnum(Theme),
  density: densitySchema,
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
});

export const settingsSchema = z.object({
  chat: chatSettingsSchema,
  privacy: privacySettingsSchema,
  security: securitySettingsSchema,
  appearance: appearanceSettingsSchema,
});

export type ChatSettingsSchema = z.infer<typeof chatSettingsSchema>;
export type PrivacySettingsSchema = z.infer<typeof privacySettingsSchema>;
export type SecuritySettingsSchema = z.infer<typeof securitySettingsSchema>;
export type AppearanceSettingsSchema = z.infer<typeof appearanceSettingsSchema>;
export type SettingsSchema = z.infer<typeof settingsSchema>;