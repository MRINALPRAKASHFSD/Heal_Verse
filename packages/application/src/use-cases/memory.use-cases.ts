import type { Command, Query } from '../interfaces';
import type { RetrieveMemoryRequestDto, RetrieveMemoryResponseDto, SaveMemoryRequestDto, SaveMemoryResponseDto } from '../dto';

export interface SaveMemoryUseCase extends Command<SaveMemoryRequestDto, SaveMemoryResponseDto> {}
export interface RetrieveMemoryUseCase extends Query<RetrieveMemoryRequestDto, RetrieveMemoryResponseDto> {}