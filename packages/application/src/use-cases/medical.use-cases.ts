import type { Command, Query } from '../interfaces';
import type {
  AnalyzeSymptomsRequestDto,
  AnalyzeSymptomsResponseDto,
  DetectEmergencyRequestDto,
  DetectEmergencyResponseDto,
  GenerateFollowUpQuestionsRequestDto,
  GenerateFollowUpQuestionsResponseDto,
  GenerateMedicalResponseRequestDto,
  GenerateMedicalResponseResponseDto,
  SummarizeConversationRequestDto,
  SummarizeConversationResponseDto,
} from '../dto';

export interface DetectEmergencyUseCase extends Query<DetectEmergencyRequestDto, DetectEmergencyResponseDto> {}
export interface GenerateMedicalResponseUseCase extends Command<GenerateMedicalResponseRequestDto, GenerateMedicalResponseResponseDto> {}
export interface GenerateFollowUpQuestionsUseCase extends Query<GenerateFollowUpQuestionsRequestDto, GenerateFollowUpQuestionsResponseDto> {}
export interface AnalyzeSymptomsUseCase extends Query<AnalyzeSymptomsRequestDto, AnalyzeSymptomsResponseDto> {}
export interface SummarizeConversationUseCase extends Query<SummarizeConversationRequestDto, SummarizeConversationResponseDto> {}