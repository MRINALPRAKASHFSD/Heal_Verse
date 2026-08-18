export type PrismaJsonValue =
  | string
  | number
  | boolean
  | null
  | PrismaJsonValue[]
  | { [key: string]: PrismaJsonValue };

export interface PrismaUserRecord {
  id: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  preferences: PrismaJsonValue;
  metadata: PrismaJsonValue | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaConversationRecord {
  id: string;
  userId: string;
  title: string;
  type: string;
  summary: PrismaJsonValue | null;
  messageIds: PrismaJsonValue;
  participantIds: PrismaJsonValue;
  preferences: PrismaJsonValue;
  metadata: PrismaJsonValue | null;
  archivedAt: Date | null;
  deletedAt: Date | null;
  pinnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaMessageRecord {
  id: string;
  conversationId: string;
  role: string;
  status: string;
  content: string;
  metadata: PrismaJsonValue | null;
  editedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaMedicalProfileRecord {
  id: string;
  userId: string;
  emergencyLevel: string;
  bodySystems: PrismaJsonValue;
  diseaseCategories: PrismaJsonValue;
  symptoms: PrismaJsonValue;
  medicines: PrismaJsonValue;
  allergies: PrismaJsonValue;
  vitalSigns: PrismaJsonValue;
  healthMetrics: PrismaJsonValue;
  disclaimers: PrismaJsonValue;
  metadata: PrismaJsonValue | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaMemoryRecord {
  id: string;
  userId: string | null;
  conversationId: string | null;
  scope: string;
  type: string;
  content: string;
  sourceId: string | null;
  metadata: PrismaJsonValue | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaUserSettingsRecord {
  id: string;
  userId: string;
  chat: PrismaJsonValue;
  privacy: PrismaJsonValue;
  security: PrismaJsonValue;
  appearance: PrismaJsonValue;
  metadata: PrismaJsonValue | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaFeedbackRecord {
  id: string;
  userId: string | null;
  conversationId: string | null;
  messageId: string | null;
  rating: number | null;
  comment: string | null;
  metadata: PrismaJsonValue | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaAttachmentRecord {
  id: string;
  userId: string | null;
  conversationId: string;
  messageId: string | null;
  type: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string | null;
  url: string | null;
  metadata: PrismaJsonValue | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaDelegate<TRecord extends { id: string }> {
  create(args: { data: Record<string, unknown> }): Promise<TRecord>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<TRecord>;
  updateMany(args: { where?: Record<string, unknown>; data: Record<string, unknown> }): Promise<{ count: number }>;
  upsert(args: { where: Record<string, string>; create: Record<string, unknown>; update: Record<string, unknown> }): Promise<TRecord>;
  findUnique(args: { where: Record<string, string> }): Promise<TRecord | null>;
  findMany(args?: { where?: Record<string, unknown>; orderBy?: Record<string, 'asc' | 'desc'> }): Promise<TRecord[]>;
  delete(args: { where: { id: string } }): Promise<TRecord>;
}

export interface PrismaDatabaseClient {
  user: PrismaDelegate<PrismaUserRecord>;
  conversation: PrismaDelegate<PrismaConversationRecord>;
  message: PrismaDelegate<PrismaMessageRecord>;
  medicalProfile: PrismaDelegate<PrismaMedicalProfileRecord>;
  memory: PrismaDelegate<PrismaMemoryRecord>;
  userSettings: PrismaDelegate<PrismaUserSettingsRecord>;
  feedback: PrismaDelegate<PrismaFeedbackRecord>;
  attachment: PrismaDelegate<PrismaAttachmentRecord>;
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $transaction<T>(operations: Promise<T>[]): Promise<T[]>;
}