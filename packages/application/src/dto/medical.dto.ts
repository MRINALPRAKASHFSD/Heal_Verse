import { z } from 'zod';
import {
  messageSchema,
  medicalProfileSchema,
  emergencyLevelSchema,
  riskLevelSchema,
  diseaseCategorySchema,
  nonEmptyStringSchema,
  uuidSchema,
} from '@healverse/shared';

export const detectEmergencyRequestSchema = z.object({
  text: nonEmptyStringSchema,
  conversationId: uuidSchema.optional(),
});

export const detectEmergencyResponseSchema = z.object({
  isEmergency: z.boolean(),
  severity: emergencyLevelSchema,
  keywords: z.array(nonEmptyStringSchema),
});

export const generateMedicalResponseRequestSchema = z.object({
  conversationId: uuidSchema,
  userId: uuidSchema,
  profile: medicalProfileSchema.optional(),
});

export const generateMedicalResponseResponseSchema = z.object({
  responseText: nonEmptyStringSchema,
  followUpSuggested: z.boolean(),
});

export const generateFollowUpQuestionsRequestSchema = z.object({
  conversationId: uuidSchema,
  context: nonEmptyStringSchema,
});

export const generateFollowUpQuestionsResponseSchema = z.object({
  questions: z.array(nonEmptyStringSchema),
});

export const analyzeSymptomsRequestSchema = z.object({
  profile: medicalProfileSchema,
  symptoms: z.array(nonEmptyStringSchema),
});

export const analyzeSymptomsResponseSchema = z.object({
  summary: nonEmptyStringSchema,
});

export const summarizeConversationRequestSchema = z.object({
  conversationId: uuidSchema,
  messages: z.array(messageSchema),
});

export const summarizeConversationResponseSchema = z.object({
  summary: nonEmptyStringSchema,
});

export const medicalCategoryDtoSchema = z.object({
  diseaseCategory: diseaseCategorySchema,
  riskLevel: riskLevelSchema,
});

export type DetectEmergencyRequestDto = z.infer<typeof detectEmergencyRequestSchema>;
export type DetectEmergencyResponseDto = z.infer<typeof detectEmergencyResponseSchema>;
export type GenerateMedicalResponseRequestDto = z.infer<typeof generateMedicalResponseRequestSchema>;
export type GenerateMedicalResponseResponseDto = z.infer<typeof generateMedicalResponseResponseSchema>;
export type GenerateFollowUpQuestionsRequestDto = z.infer<typeof generateFollowUpQuestionsRequestSchema>;
export type GenerateFollowUpQuestionsResponseDto = z.infer<typeof generateFollowUpQuestionsResponseSchema>;
export type AnalyzeSymptomsRequestDto = z.infer<typeof analyzeSymptomsRequestSchema>;
export type AnalyzeSymptomsResponseDto = z.infer<typeof analyzeSymptomsResponseSchema>;
export type SummarizeConversationRequestDto = z.infer<typeof summarizeConversationRequestSchema>;
export type SummarizeConversationResponseDto = z.infer<typeof summarizeConversationResponseSchema>;
export type MedicalCategoryDto = z.infer<typeof medicalCategoryDtoSchema>;