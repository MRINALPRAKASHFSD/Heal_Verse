import { parseOrThrow, validateValue } from '../../utils';
import { preferencesSchema, userSchema } from './schemas';

export const validateUser = (value: unknown) => validateValue(userSchema, value);
export const validatePreferences = (value: unknown) => validateValue(preferencesSchema, value);

export const parseUser = (value: unknown) => parseOrThrow(userSchema, value);