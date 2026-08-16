import { z } from 'zod';
import { SupportedLanguage } from '../../enums/language.enums';
import { AudioDeviceKind, TranscriptionState } from '../../enums/voice.enums';
import { supportedLanguageSchema, nonEmptyStringSchema, uuidSchema } from '../../schemas/common.schemas';

export const transcriptionStateSchema = z.nativeEnum(TranscriptionState);
export const audioDeviceKindSchema = z.nativeEnum(AudioDeviceKind);

export const speechSettingsSchema = z.object({
  enabled: z.boolean(),
  language: supportedLanguageSchema,
  inputDeviceId: nonEmptyStringSchema.optional(),
  outputDeviceId: nonEmptyStringSchema.optional(),
  transcriptionState: transcriptionStateSchema,
});

export const voiceModelSchema = z.object({
  id: uuidSchema,
  name: nonEmptyStringSchema,
  locale: z.nativeEnum(SupportedLanguage),
  supportedLanguages: z.array(supportedLanguageSchema),
  isDefault: z.boolean(),
});

export const audioDeviceSchema = z.object({
  id: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  kind: audioDeviceKindSchema,
  sampleRateHz: z.number().int().positive().optional(),
});

export type SpeechSettingsSchema = z.infer<typeof speechSettingsSchema>;
export type VoiceModelSchema = z.infer<typeof voiceModelSchema>;
export type AudioDeviceSchema = z.infer<typeof audioDeviceSchema>;