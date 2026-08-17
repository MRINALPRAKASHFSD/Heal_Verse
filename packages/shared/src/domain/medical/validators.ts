import { parseOrThrow, validateValue } from '../../utils';
import { allergySchema, medicalProfileSchema, medicineSchema, symptomSchema } from './schemas';

export const validateMedicalProfile = (value: unknown) => validateValue(medicalProfileSchema, value);
export const validateSymptom = (value: unknown) => validateValue(symptomSchema, value);
export const validateMedicine = (value: unknown) => validateValue(medicineSchema, value);
export const validateAllergy = (value: unknown) => validateValue(allergySchema, value);

export const parseMedicalProfile = (value: unknown) => parseOrThrow(medicalProfileSchema, value);