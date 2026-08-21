import type { Command } from '../interfaces';
import type { UpdateUserPreferencesRequestDto, UpdateUserPreferencesResponseDto } from '../dto';

export interface UpdateUserPreferencesUseCase extends Command<UpdateUserPreferencesRequestDto, UpdateUserPreferencesResponseDto> {}