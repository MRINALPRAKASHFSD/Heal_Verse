import type { Command, Query } from '../interfaces';
import type { DetectLanguageRequestDto, DetectLanguageResponseDto, TranslateMessageRequestDto, TranslateMessageResponseDto } from '../dto';

export interface DetectLanguageUseCase extends Query<DetectLanguageRequestDto, DetectLanguageResponseDto> {}
export interface TranslateMessageUseCase extends Command<TranslateMessageRequestDto, TranslateMessageResponseDto> {}