import { z } from 'zod';
import { Locale, SupportedLanguage } from '../enums/language.enums';
import { Theme } from '../enums/theme.enums';

export const uuidSchema = z.string().uuid();
export const isoDateStringSchema = z.string().datetime({ offset: true });
export const nonEmptyStringSchema = z.string().trim().min(1);
export const safeStringSchema = z.string().trim().min(1).max(10_000);
export const percentageSchema = z.number().min(0).max(100);
export const positiveIntegerSchema = z.number().int().positive();
export const nonNegativeIntegerSchema = z.number().int().min(0);
export const supportedLanguageSchema = z.nativeEnum(SupportedLanguage);
export const localeSchema = z.nativeEnum(Locale);
export const themeSchema = z.nativeEnum(Theme);

export const urlSchema = z.string().url();
export const emailSchema = z.string().email();