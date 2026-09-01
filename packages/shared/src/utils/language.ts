import { SUPPORTED_LANGUAGE_LABELS } from '../constants';
import { Locale, SupportedLanguage } from '../enums/language.enums';

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return Object.values(SupportedLanguage).includes(value as SupportedLanguage);
}

export function getLanguageLabel(language: SupportedLanguage): string {
  return SUPPORTED_LANGUAGE_LABELS[language];
}

export function normalizeLanguage(value: string | null | undefined): SupportedLanguage | null {
  if (!value) {
    return null;
  }

  return isSupportedLanguage(value) ? value : null;
}

export function toLocale(language: SupportedLanguage): Locale {
  return (language as unknown) as Locale;
}