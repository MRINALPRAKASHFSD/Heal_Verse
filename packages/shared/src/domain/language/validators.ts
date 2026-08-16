import { parseOrThrow, validateValue } from '../../utils';
import { detectedLanguageSchema, translationDirectionSchema } from './schemas';

export const validateDetectedLanguage = (value: unknown) => validateValue(detectedLanguageSchema, value);
export const validateTranslationDirection = (value: unknown) => validateValue(translationDirectionSchema, value);

export const parseDetectedLanguage = (value: unknown) => parseOrThrow(detectedLanguageSchema, value);