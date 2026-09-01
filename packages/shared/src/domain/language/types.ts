import type { ISODateString, UUID } from '../../types';
import { Locale, SupportedLanguage } from '../../enums/language.enums';

export { SupportedLanguage, Locale };

export interface DetectedLanguage {
  readonly id: UUID;
  readonly language: SupportedLanguage;
  readonly locale: Locale;
  readonly confidence: number;
  readonly detectedAt: ISODateString;
}

export interface TranslationDirection {
  readonly from: SupportedLanguage;
  readonly to: SupportedLanguage;
}