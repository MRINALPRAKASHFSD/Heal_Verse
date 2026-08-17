import { z } from 'zod';
import { DiseaseCategory, EmergencyLevel, RiskLevel, BodySystem } from '../../enums/medical.enums';
import { isoDateStringSchema, nonEmptyStringSchema, positiveIntegerSchema, uuidSchema } from '../../schemas/common.schemas';

export const emergencyLevelSchema = z.nativeEnum(EmergencyLevel);
export const riskLevelSchema = z.nativeEnum(RiskLevel);
export const diseaseCategorySchema = z.nativeEnum(DiseaseCategory);
export const bodySystemSchema = z.nativeEnum(BodySystem);

export const symptomSchema = z.object({
  id: uuidSchema,
  name: nonEmptyStringSchema,
  severity: riskLevelSchema,
  onsetAt: isoDateStringSchema.optional(),
  notes: nonEmptyStringSchema.optional(),
});

export const medicineSchema = z.object({
  id: uuidSchema,
  name: nonEmptyStringSchema,
  dosage: nonEmptyStringSchema.optional(),
  frequency: nonEmptyStringSchema.optional(),
  route: nonEmptyStringSchema.optional(),
  prescribedAt: isoDateStringSchema.optional(),
});

export const allergySchema = z.object({
  id: uuidSchema,
  allergen: nonEmptyStringSchema,
  reaction: nonEmptyStringSchema.optional(),
  severity: riskLevelSchema,
  recordedAt: isoDateStringSchema,
});

export const vitalSignsSchema = z.object({
  heartRateBpm: positiveIntegerSchema.optional(),
  respiratoryRate: positiveIntegerSchema.optional(),
  systolicBloodPressureMmHg: positiveIntegerSchema.optional(),
  diastolicBloodPressureMmHg: positiveIntegerSchema.optional(),
  bodyTemperatureCelsius: z.number().positive().optional(),
  oxygenSaturationPercent: z.number().min(0).max(100).optional(),
});

export const healthMetricSchema = z.object({
  id: uuidSchema,
  name: nonEmptyStringSchema,
  value: z.number(),
  unit: nonEmptyStringSchema.optional(),
  measuredAt: isoDateStringSchema,
});

export const medicalDisclaimerSchema = z.object({
  id: uuidSchema,
  text: nonEmptyStringSchema,
  jurisdiction: nonEmptyStringSchema.optional(),
  lastReviewedAt: isoDateStringSchema,
});

export const medicalProfileSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema.optional(),
  emergencyLevel: emergencyLevelSchema,
  bodySystems: z.array(bodySystemSchema),
  diseaseCategories: z.array(diseaseCategorySchema),
  symptoms: z.array(symptomSchema),
  medicines: z.array(medicineSchema),
  allergies: z.array(allergySchema),
  vitalSigns: vitalSignsSchema,
  healthMetrics: z.array(healthMetricSchema),
  disclaimers: z.array(medicalDisclaimerSchema),
  updatedAt: isoDateStringSchema,
});

export type SymptomSchema = z.infer<typeof symptomSchema>;
export type MedicineSchema = z.infer<typeof medicineSchema>;
export type AllergySchema = z.infer<typeof allergySchema>;
export type VitalSignsSchema = z.infer<typeof vitalSignsSchema>;
export type HealthMetricSchema = z.infer<typeof healthMetricSchema>;
export type MedicalDisclaimerSchema = z.infer<typeof medicalDisclaimerSchema>;
export type MedicalProfileSchema = z.infer<typeof medicalProfileSchema>;