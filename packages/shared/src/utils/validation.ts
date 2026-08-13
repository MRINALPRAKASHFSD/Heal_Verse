import type { ZodType } from 'zod';
import type { ValidationResult } from '../types';

export function validateValue<T>(schema: ZodType<T>, value: unknown): ValidationResult<T> {
  const result = schema.safeParse(value);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message),
  };
}

export function parseOrThrow<T>(schema: ZodType<T>, value: unknown): T {
  return schema.parse(value);
}

export function isValidationResultSuccess<T>(result: ValidationResult<T>): result is { success: true; data: T } {
  return result.success;
}