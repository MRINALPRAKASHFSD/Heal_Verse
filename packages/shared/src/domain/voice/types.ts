import type { ISODateString, UUID } from '../../types';
import { SupportedLanguage } from '../../enums/language.enums';
import { AudioDeviceKind, TranscriptionState } from '../../enums/voice.enums';

export type { TranscriptionState };

export interface SpeechSettings {
  readonly enabled: boolean;
  readonly language: SupportedLanguage;
  readonly inputDeviceId?: string;
  readonly outputDeviceId?: string;
  readonly transcriptionState: TranscriptionState;
}

export interface VoiceModel {
  readonly id: UUID;
  readonly name: string;
  readonly locale: SupportedLanguage;
  readonly supportedLanguages: SupportedLanguage[];
  readonly isDefault: boolean;
}

export interface AudioDevice {
  readonly id: string;
  readonly label: string;
  readonly kind: AudioDeviceKind;
  readonly sampleRateHz?: number;
}