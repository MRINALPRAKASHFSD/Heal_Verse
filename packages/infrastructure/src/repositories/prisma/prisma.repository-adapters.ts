import type { ConversationRepository, MedicalRepository, MemoryRepository, MessageRepository, SettingsRepository, UserRepository } from '@healverse/application';
import type { Conversation, MedicalProfile, MemoryItem, Message, Settings, User, UUID, Logger } from '@healverse/application';
import type {
  Attachment,
  AttachmentType,
  BodySystem,
  ChatPreferences,
  ConversationSummary,
  DiseaseCategory,
  EmergencyLevel,
  HealthMetric,
  ISODateString,
  MedicalDisclaimer,
  MessageRole,
  MessageStatus,
  MemoryScope,
  MemoryType,
  VitalSigns,
} from '@healverse/shared';
import { ConversationType } from '@healverse/shared';
import { BaseAdapter } from '../../adapters/base.adapter';
import type { InfrastructureConfig } from '../../config';
import type {
  PrismaAttachmentRecord,
  PrismaConversationRecord,
  PrismaDatabaseClient,
  PrismaMemoryRecord,
  PrismaMessageRecord,
  PrismaMedicalProfileRecord,
  PrismaUserRecord,
  PrismaUserSettingsRecord,
} from '@healverse/database';

export interface PrismaRepositoryAdapterDependencies {
  readonly config: InfrastructureConfig;
  readonly logger?: Logger;
  readonly db: PrismaDatabaseClient;
}

abstract class PrismaRepositoryAdapterBase extends BaseAdapter {
  protected constructor(adapterName: string, protected readonly dependencies: PrismaRepositoryAdapterDependencies) {
    super(adapterName, dependencies.logger);
  }
}

function toIso(date: Date | null | undefined): ISODateString | undefined {
  return date ? (date.toISOString() as ISODateString) : undefined;
}

function mapConversationTypeToPrisma(type: ConversationType): string {
  switch (type) {
    case 'follow-up':
    case ConversationType.FollowUp:
      return 'follow_up';
    case 'medication-review':
    case ConversationType.MedicationReview:
      return 'medication_review';
    case 'symptom-check':
    case ConversationType.SymptomCheck:
      return 'symptom_check';
    case 'care-plan':
    case ConversationType.CarePlan:
      return 'care_plan';
    default:
      return 'general';
  }
}

function mapConversationTypeFromPrisma(type: string): ConversationType {
  switch (type) {
    case 'follow_up':
      return ConversationType.FollowUp;
    case 'medication_review':
      return ConversationType.MedicationReview;
    case 'symptom_check':
      return ConversationType.SymptomCheck;
    case 'care_plan':
      return ConversationType.CarePlan;
    default:
      return ConversationType.General;
  }
}

function mapMemoryTypeToPrisma(type: MemoryType): string {
  return type === 'safety-note' ? 'safety_note' : type;
}

function mapMemoryTypeFromPrisma(type: string): MemoryType {
  return type === 'safety_note' ? 'safety-note' : (type as MemoryType);
}

function mapConversation(record: PrismaConversationRecord): Conversation {
  return {
    id: record.id as Conversation['id'],
    title: record.title,
    type: mapConversationTypeFromPrisma(record.type),
    summary: (record.summary as ConversationSummary | null) ?? null,
    messageIds: Array.isArray(record.messageIds) ? (record.messageIds as string[]).map((value) => value as UUID) : [],
    participantIds: Array.isArray(record.participantIds) ? (record.participantIds as string[]).map((value) => value as UUID) : [],
    preferences: record.preferences as unknown as ChatPreferences,
    createdAt: record.createdAt.toISOString() as ISODateString,
    updatedAt: record.updatedAt.toISOString() as ISODateString,
    archivedAt: toIso(record.archivedAt),
    pinnedAt: toIso(record.pinnedAt),
  };
}

function mapUser(record: PrismaUserRecord): User {
  return {
    id: record.id as User['id'],
    displayName: record.displayName,
    email: record.email ?? undefined,
    avatarUrl: record.avatarUrl ?? undefined,
    preferences: record.preferences as unknown as User['preferences'],
  };
}

function mapAttachment(record: PrismaAttachmentRecord): Attachment {
  return {
    id: record.id as Attachment['id'],
    type: record.type as AttachmentType,
    name: record.name,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
    createdAt: record.createdAt.toISOString() as ISODateString,
  };
}

function mapMessage(record: PrismaMessageRecord, attachments: Attachment[]): Message {
  return {
    id: record.id as Message['id'],
    conversationId: record.conversationId as Message['conversationId'],
    role: record.role as MessageRole,
    status: record.status as MessageStatus,
    content: record.content,
    attachments,
    createdAt: record.createdAt.toISOString() as ISODateString,
    updatedAt: record.updatedAt.toISOString() as ISODateString,
    editedAt: toIso(record.editedAt),
  };
}

function mapMedicalProfile(record: PrismaMedicalProfileRecord): MedicalProfile {
  return {
    id: record.id as MedicalProfile['id'],
    userId: record.userId as MedicalProfile['userId'],
    emergencyLevel: record.emergencyLevel as EmergencyLevel,
    bodySystems: record.bodySystems as BodySystem[],
    diseaseCategories: record.diseaseCategories as DiseaseCategory[],
    symptoms: record.symptoms as unknown as MedicalProfile['symptoms'],
    medicines: record.medicines as unknown as MedicalProfile['medicines'],
    allergies: record.allergies as unknown as MedicalProfile['allergies'],
    vitalSigns: record.vitalSigns as VitalSigns,
    healthMetrics: record.healthMetrics as unknown as HealthMetric[],
    disclaimers: record.disclaimers as unknown as MedicalDisclaimer[],
    updatedAt: record.updatedAt.toISOString() as ISODateString,
  };
}

function mapMemory(record: PrismaMemoryRecord): MemoryItem {
  return {
    id: record.id as MemoryItem['id'],
    scope: record.scope as MemoryScope,
    type: mapMemoryTypeFromPrisma(record.type),
    content: record.content,
    sourceId: record.sourceId ? (record.sourceId as MemoryItem['sourceId']) : undefined,
    createdAt: record.createdAt.toISOString() as ISODateString,
    updatedAt: record.updatedAt.toISOString() as ISODateString,
  };
}

function mapSettings(record: PrismaUserSettingsRecord): Settings {
  return {
    chat: record.chat as unknown as Settings['chat'],
    privacy: record.privacy as unknown as Settings['privacy'],
    security: record.security as unknown as Settings['security'],
    appearance: record.appearance as unknown as Settings['appearance'],
  };
}

async function hydrateMessages(db: PrismaDatabaseClient, conversationId: UUID): Promise<Message[]> {
  const messages = await db.message.findMany({ where: { conversationId, deletedAt: null }, orderBy: { createdAt: 'asc' } });
  const attachments = await db.attachment.findMany({ where: { conversationId, deletedAt: null } });
  const attachmentsByMessageId = new Map<string, Attachment[]>();

  for (const attachmentRecord of attachments) {
    if (!attachmentRecord.messageId) {
      continue;
    }

    const existing = attachmentsByMessageId.get(attachmentRecord.messageId) ?? [];
    existing.push(mapAttachment(attachmentRecord));
    attachmentsByMessageId.set(attachmentRecord.messageId, existing);
  }

  return messages.map((message) => mapMessage(message, attachmentsByMessageId.get(message.id) ?? []));
}

export class PrismaConversationRepository extends PrismaRepositoryAdapterBase implements ConversationRepository {
  constructor(dependencies: PrismaRepositoryAdapterDependencies) {
    super('PrismaConversationRepository', dependencies);
  }

  async create(conversation: Conversation): Promise<Conversation> {
    const record = await this.dependencies.db.conversation.create({
      data: {
        userId: conversation.participantIds[0] ?? conversation.id,
        title: conversation.title,
        type: mapConversationTypeToPrisma(conversation.type),
        summary: conversation.summary ?? null,
        messageIds: conversation.messageIds,
        participantIds: conversation.participantIds,
        preferences: conversation.preferences,
        metadata: null,
        archivedAt: conversation.archivedAt ? new Date(conversation.archivedAt) : null,
        pinnedAt: conversation.pinnedAt ? new Date(conversation.pinnedAt) : null,
        deletedAt: null,
      },
    });

    return mapConversation(record);
  }

  async update(conversation: Conversation): Promise<Conversation> {
    const record = await this.dependencies.db.conversation.update({
      where: { id: conversation.id },
      data: {
        title: conversation.title,
        type: mapConversationTypeToPrisma(conversation.type),
        summary: conversation.summary ?? null,
        messageIds: conversation.messageIds,
        participantIds: conversation.participantIds,
        preferences: conversation.preferences,
        archivedAt: conversation.archivedAt ? new Date(conversation.archivedAt) : null,
        pinnedAt: conversation.pinnedAt ? new Date(conversation.pinnedAt) : null,
        deletedAt: null,
      },
    });

    return mapConversation(record);
  }

  async delete(conversationId: UUID): Promise<void> {
    const deletedAt = new Date();

    await this.dependencies.db.$transaction([
      this.dependencies.db.attachment.updateMany({ where: { conversationId }, data: { deletedAt } }),
      this.dependencies.db.message.updateMany({ where: { conversationId }, data: { deletedAt } }),
      this.dependencies.db.conversation.update({ where: { id: conversationId }, data: { deletedAt } }),
    ]);
  }

  async findById(conversationId: UUID): Promise<Conversation | null> {
    const record = await this.dependencies.db.conversation.findUnique({ where: { id: conversationId } });
    return record && !record.deletedAt ? mapConversation(record) : null;
  }

  async findManyByUserId(userId: UUID): Promise<Conversation[]> {
    const records = await this.dependencies.db.conversation.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return records.map(mapConversation);
  }
}

export class PrismaUserRepository extends PrismaRepositoryAdapterBase implements UserRepository {
  constructor(dependencies: PrismaRepositoryAdapterDependencies) {
    super('PrismaUserRepository', dependencies);
  }

  async findById(userId: UUID): Promise<User | null> {
    const record = await this.dependencies.db.user.findUnique({ where: { id: userId } });
    return record && !record.deletedAt ? mapUser(record) : null;
  }

  async update(user: User): Promise<User> {
    const record = await this.dependencies.db.user.update({
      where: { id: user.id },
      data: {
        displayName: user.displayName,
        email: user.email ?? null,
        avatarUrl: user.avatarUrl ?? null,
        preferences: user.preferences,
        deletedAt: null,
      },
    });

    return mapUser(record);
  }
}

export class PrismaMedicalRepository extends PrismaRepositoryAdapterBase implements MedicalRepository {
  constructor(dependencies: PrismaRepositoryAdapterDependencies) {
    super('PrismaMedicalRepository', dependencies);
  }

  async findProfileByUserId(userId: UUID): Promise<MedicalProfile | null> {
    const record = await this.dependencies.db.medicalProfile.findUnique({ where: { userId } });
    return record && !record.deletedAt ? mapMedicalProfile(record) : null;
  }

  async saveProfile(profile: MedicalProfile): Promise<MedicalProfile> {
    const record = await this.dependencies.db.medicalProfile.upsert({
      where: { userId: profile.userId ?? profile.id },
      create: {
        userId: profile.userId ?? profile.id,
        emergencyLevel: profile.emergencyLevel,
        bodySystems: profile.bodySystems,
        diseaseCategories: profile.diseaseCategories,
        symptoms: profile.symptoms,
        medicines: profile.medicines,
        allergies: profile.allergies,
        vitalSigns: profile.vitalSigns,
        healthMetrics: profile.healthMetrics,
        disclaimers: profile.disclaimers,
        metadata: null,
        deletedAt: null,
      },
      update: {
        emergencyLevel: profile.emergencyLevel,
        bodySystems: profile.bodySystems,
        diseaseCategories: profile.diseaseCategories,
        symptoms: profile.symptoms,
        medicines: profile.medicines,
        allergies: profile.allergies,
        vitalSigns: profile.vitalSigns,
        healthMetrics: profile.healthMetrics,
        disclaimers: profile.disclaimers,
        metadata: null,
        deletedAt: null,
      },
    });

    return mapMedicalProfile(record);
  }
}

export class PrismaMemoryRepository extends PrismaRepositoryAdapterBase implements MemoryRepository {
  constructor(dependencies: PrismaRepositoryAdapterDependencies) {
    super('PrismaMemoryRepository', dependencies);
  }

  async save(memory: MemoryItem): Promise<MemoryItem> {
    const record = await this.dependencies.db.memory.upsert({
      where: { id: memory.id },
      create: {
        id: memory.id,
        userId: null,
        conversationId: null,
        scope: memory.scope,
        type: mapMemoryTypeToPrisma(memory.type),
        content: memory.content,
        sourceId: memory.sourceId ?? null,
        metadata: null,
        deletedAt: null,
      },
      update: {
        scope: memory.scope,
        type: mapMemoryTypeToPrisma(memory.type),
        content: memory.content,
        sourceId: memory.sourceId ?? null,
        metadata: null,
        deletedAt: null,
      },
    });

    return mapMemory(record);
  }

  async findById(memoryId: UUID): Promise<MemoryItem | null> {
    const record = await this.dependencies.db.memory.findUnique({ where: { id: memoryId } });
    return record && !record.deletedAt ? mapMemory(record) : null;
  }

  async findByConversationId(conversationId: UUID): Promise<MemoryItem[]> {
    const records = await this.dependencies.db.memory.findMany({ where: { conversationId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return records.map(mapMemory);
  }

  async findByUserId(userId: UUID): Promise<MemoryItem[]> {
    const records = await this.dependencies.db.memory.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return records.map(mapMemory);
  }
}

export class PrismaSettingsRepository extends PrismaRepositoryAdapterBase implements SettingsRepository {
  constructor(dependencies: PrismaRepositoryAdapterDependencies) {
    super('PrismaSettingsRepository', dependencies);
  }

  async findByUserId(userId: UUID): Promise<Settings | null> {
    const record = await this.dependencies.db.userSettings.findUnique({ where: { userId } });
    return record && !record.deletedAt ? mapSettings(record) : null;
  }

  async save(userId: UUID, settings: Settings): Promise<Settings> {
    const record = await this.dependencies.db.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        chat: settings.chat,
        privacy: settings.privacy,
        security: settings.security,
        appearance: settings.appearance,
        metadata: null,
        deletedAt: null,
      },
      update: {
        chat: settings.chat,
        privacy: settings.privacy,
        security: settings.security,
        appearance: settings.appearance,
        metadata: null,
        deletedAt: null,
      },
    });

    return mapSettings(record);
  }
}

export class PrismaMessageRepository extends PrismaRepositoryAdapterBase implements MessageRepository {
  constructor(dependencies: PrismaRepositoryAdapterDependencies) {
    super('PrismaMessageRepository', dependencies);
  }

  async create(message: Message): Promise<Message> {
    const record = await this.dependencies.db.message.create({
      data: {
        id: message.id,
        conversationId: message.conversationId,
        role: message.role,
        status: message.status,
        content: message.content,
        metadata: null,
        editedAt: message.editedAt ? new Date(message.editedAt) : null,
        deletedAt: null,
      },
    });

    const conversation = await this.dependencies.db.conversation.findUnique({ where: { id: message.conversationId } });
    if (conversation && !conversation.deletedAt) {
      const messageIds = Array.isArray(conversation.messageIds) ? (conversation.messageIds as string[]) : [];
      await this.dependencies.db.conversation.update({
        where: { id: conversation.id },
        data: { messageIds: [...messageIds, record.id] },
      });
    }

    return mapMessage(record, []);
  }

  async findByConversationId(conversationId: UUID): Promise<Message[]> {
    return hydrateMessages(this.dependencies.db, conversationId);
  }
}