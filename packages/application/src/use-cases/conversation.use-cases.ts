import type { Command, Query } from '../interfaces';
import type {
  ArchiveConversationRequestDto,
  ArchiveConversationResponseDto,
  CreateConversationRequestDto,
  CreateConversationResponseDto,
  DeleteConversationRequestDto,
  GenerateConversationTitleRequestDto,
  GenerateConversationTitleResponseDto,
  RenameConversationRequestDto,
  RetrieveConversationRequestDto,
  RetrieveConversationResponseDto,
  SaveConversationRequestDto,
  SendMessageRequestDto,
  SendMessageResponseDto,
  ReceiveMessageRequestDto,
  ReceiveMessageResponseDto,
  ConversationSummaryDto,
} from '../dto';

export interface CreateConversationUseCase extends Command<CreateConversationRequestDto, CreateConversationResponseDto> {}
export interface DeleteConversationUseCase extends Command<DeleteConversationRequestDto, void> {}
export interface RenameConversationUseCase extends Command<RenameConversationRequestDto, CreateConversationResponseDto> {}
export interface ArchiveConversationUseCase extends Command<ArchiveConversationRequestDto, ArchiveConversationResponseDto> {}
export interface SendMessageUseCase extends Command<SendMessageRequestDto, SendMessageResponseDto> {}
export interface ReceiveMessageUseCase extends Command<ReceiveMessageRequestDto, ReceiveMessageResponseDto> {}
export interface GenerateConversationTitleUseCase extends Command<GenerateConversationTitleRequestDto, GenerateConversationTitleResponseDto> {}
export interface SaveConversationUseCase extends Command<SaveConversationRequestDto, CreateConversationResponseDto> {}
export interface RetrieveConversationUseCase extends Query<RetrieveConversationRequestDto, RetrieveConversationResponseDto> {}
export interface SummarizeConversationUseCase extends Query<{ conversationId: string }, ConversationSummaryDto | null> {}