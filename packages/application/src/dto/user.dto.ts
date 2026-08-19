import { z } from 'zod';
import { preferencesSchema, userSchema } from '@healverse/shared';
import { uuidSchema } from '@healverse/shared';

export const updateUserPreferencesRequestSchema = z.object({
  userId: uuidSchema,
  preferences: preferencesSchema,
});

export const updateUserPreferencesResponseSchema = z.object({
  user: userSchema,
});

export type UpdateUserPreferencesRequestDto = z.infer<typeof updateUserPreferencesRequestSchema>;
export type UpdateUserPreferencesResponseDto = z.infer<typeof updateUserPreferencesResponseSchema>;