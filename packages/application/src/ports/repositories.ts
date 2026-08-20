import type { Conversation, Message, MedicalProfile, MemoryItem, Settings, User, UUID } from '@healverse/shared';

export interface ConversationRepository {
  create(conversation: Conversation): Promise<Conversation>;
  update(conversation: Conversation): Promise<Conversation>;
  delete(conversationId: UUID): Promise<void>;
  findById(conversationId: UUID): Promise<Conversation | null>;
  findManyByUserId(userId: UUID): Promise<Conversation[]>;
}

export interface UserRepository {
  findById(userId: UUID): Promise<User | null>;
  update(user: User): Promise<User>;
}

export interface MedicalRepository {
  findProfileByUserId(userId: UUID): Promise<MedicalProfile | null>;
  saveProfile(profile: MedicalProfile): Promise<MedicalProfile>;
}

export interface MemoryRepository {
  save(memory: MemoryItem): Promise<MemoryItem>;
  findById(memoryId: UUID): Promise<MemoryItem | null>;
  findByConversationId(conversationId: UUID): Promise<MemoryItem[]>;
  findByUserId(userId: UUID): Promise<MemoryItem[]>;
}

export interface SettingsRepository {
  findByUserId(userId: UUID): Promise<Settings | null>;
  save(userId: UUID, settings: Settings): Promise<Settings>;
}

export interface MessageRepository {
  create(message: Message): Promise<Message>;
  findByConversationId(conversationId: UUID): Promise<Message[]>;
}