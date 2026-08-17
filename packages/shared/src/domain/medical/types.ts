import type { ISODateString, UUID } from '../../types';
import { DiseaseCategory, EmergencyLevel, RiskLevel, BodySystem } from '../../enums/medical.enums';

export type { DiseaseCategory, EmergencyLevel, RiskLevel, BodySystem };

export interface Symptom {
  readonly id: UUID;
  readonly name: string;
  readonly severity: RiskLevel;
  readonly onsetAt?: ISODateString;
  readonly notes?: string;
}

export interface Medicine {
  readonly id: UUID;
  readonly name: string;
  readonly dosage?: string;
  readonly frequency?: string;
  readonly route?: string;
  readonly prescribedAt?: ISODateString;
}

export interface Allergy {
  readonly id: UUID;
  readonly allergen: string;
  readonly reaction?: string;
  readonly severity: RiskLevel;
  readonly recordedAt: ISODateString;
}

export interface VitalSigns {
  readonly heartRateBpm?: number;
  readonly respiratoryRate?: number;
  readonly systolicBloodPressureMmHg?: number;
  readonly diastolicBloodPressureMmHg?: number;
  readonly bodyTemperatureCelsius?: number;
  readonly oxygenSaturationPercent?: number;
}

export interface HealthMetric {
  readonly id: UUID;
  readonly name: string;
  readonly value: number;
  readonly unit?: string;
  readonly measuredAt: ISODateString;
}

export interface MedicalDisclaimer {
  readonly id: UUID;
  readonly text: string;
  readonly jurisdiction?: string;
  readonly lastReviewedAt: ISODateString;
}

export interface MedicalProfile {
  readonly id: UUID;
  readonly userId?: UUID;
  readonly emergencyLevel: EmergencyLevel;
  readonly bodySystems: BodySystem[];
  readonly diseaseCategories: DiseaseCategory[];
  readonly symptoms: Symptom[];
  readonly medicines: Medicine[];
  readonly allergies: Allergy[];
  readonly vitalSigns: VitalSigns;
  readonly healthMetrics: HealthMetric[];
  readonly disclaimers: MedicalDisclaimer[];
  readonly updatedAt: ISODateString;
}