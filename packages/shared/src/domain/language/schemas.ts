import { z } from 'zod';
import { Locale, SupportedLanguage } from '../../enums/language.enums';
import { isoDateStringSchema, percentageSchema, uuidSchema, supportedLanguageSchema, localeSchema } from '../../schemas/common.schemas';

export { supportedLanguageSchema, localeSchema };

export const detectedLanguageSchema = z.object({
  id: uuidSchema,
  language: supportedLanguageSchema,
  locale: localeSchema,
  confidence: percentageSchema,
  detectedAt: isoDateStringSchema,
});

export const translationDirectionSchema = z.object({
  from: supportedLanguageSchema,
  to: supportedLanguageSchema,
});

export type DetectedLanguageSchema = z.infer<typeof detectedLanguageSchema>;
export type TranslationDirectionSchema = z.infer<typeof translationDirectionSchema>;