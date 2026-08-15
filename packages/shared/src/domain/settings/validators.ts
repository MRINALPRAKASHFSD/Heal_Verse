import { parseOrThrow, validateValue } from '../../utils';
import { settingsSchema } from './schemas';

export const validateSettings = (value: unknown) => validateValue(settingsSchema, value);

export const parseSettings = (value: unknown) => parseOrThrow(settingsSchema, value);