CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "ConversationType" AS ENUM ('general', 'follow_up', 'medication_review', 'symptom_check', 'care_plan');
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant', 'system', 'tool');
CREATE TYPE "MessageStatus" AS ENUM ('draft', 'sending', 'streaming', 'sent', 'delivered', 'read', 'failed');
CREATE TYPE "AttachmentType" AS ENUM ('document', 'image', 'audio', 'video', 'other');
CREATE TYPE "MemoryScope" AS ENUM ('conversation', 'user', 'workspace');
CREATE TYPE "MemoryType" AS ENUM ('fact', 'preference', 'summary', 'safety_note');
CREATE TYPE "EmergencyLevel" AS ENUM ('low', 'moderate', 'high', 'critical');
CREATE TYPE "RiskLevel" AS ENUM ('minimal', 'mild', 'moderate', 'elevated', 'severe');
CREATE TYPE "Theme" AS ENUM ('light', 'dark', 'system');
CREATE TYPE "SupportedLanguage" AS ENUM ('en_US', 'en_GB', 'es_ES', 'fr_FR', 'de_DE', 'it_IT', 'pt_BR', 'hi_IN', 'ja_JP', 'ko_KR', 'zh_CN', 'ar_SA');
CREATE TYPE "DiseaseCategory" AS ENUM ('infectious', 'cardiovascular', 'respiratory', 'endocrine', 'neurological', 'musculoskeletal', 'gastrointestinal', 'dermatological', 'mental_health', 'other');
CREATE TYPE "BodySystem" AS ENUM ('cardiovascular', 'respiratory', 'digestive', 'nervous', 'endocrine', 'musculoskeletal', 'immune', 'integumentary', 'urinary', 'reproductive');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "displayName" VARCHAR(200) NOT NULL,
  "email" VARCHAR(320),
  "avatarUrl" TEXT,
  "preferences" JSONB NOT NULL,
  "metadata" JSONB,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
CREATE INDEX "User_email_deletedAt_idx" ON "User"("email", "deletedAt");

CREATE TABLE "Conversation" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "type" "ConversationType" NOT NULL DEFAULT 'general',
  "summary" JSONB,
  "messageIds" JSONB NOT NULL DEFAULT '[]',
  "participantIds" JSONB NOT NULL DEFAULT '[]',
  "preferences" JSONB NOT NULL,
  "metadata" JSONB,
  "archivedAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  "pinnedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Conversation_userId_deletedAt_idx" ON "Conversation"("userId", "deletedAt");
CREATE INDEX "Conversation_type_deletedAt_idx" ON "Conversation"("type", "deletedAt");
CREATE INDEX "Conversation_archivedAt_idx" ON "Conversation"("archivedAt");

CREATE TABLE "Message" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "conversationId" UUID NOT NULL,
  "role" "MessageRole" NOT NULL,
  "status" "MessageStatus" NOT NULL DEFAULT 'sent',
  "content" TEXT NOT NULL,
  "metadata" JSONB,
  "editedAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Message_conversationId_deletedAt_idx" ON "Message"("conversationId", "deletedAt");
CREATE INDEX "Message_role_deletedAt_idx" ON "Message"("role", "deletedAt");

CREATE TABLE "MedicalProfile" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "emergencyLevel" "EmergencyLevel" NOT NULL,
  "bodySystems" JSONB NOT NULL,
  "diseaseCategories" JSONB NOT NULL,
  "symptoms" JSONB NOT NULL,
  "medicines" JSONB NOT NULL,
  "allergies" JSONB NOT NULL,
  "vitalSigns" JSONB NOT NULL,
  "healthMetrics" JSONB NOT NULL,
  "disclaimers" JSONB NOT NULL,
  "metadata" JSONB,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MedicalProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MedicalProfile_userId_key" ON "MedicalProfile"("userId");
CREATE INDEX "MedicalProfile_deletedAt_idx" ON "MedicalProfile"("deletedAt");

CREATE TABLE "Memory" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID,
  "conversationId" UUID,
  "scope" "MemoryScope" NOT NULL,
  "type" "MemoryType" NOT NULL,
  "content" TEXT NOT NULL,
  "sourceId" UUID,
  "metadata" JSONB,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Memory_userId_deletedAt_idx" ON "Memory"("userId", "deletedAt");
CREATE INDEX "Memory_conversationId_deletedAt_idx" ON "Memory"("conversationId", "deletedAt");
CREATE INDEX "Memory_scope_type_idx" ON "Memory"("scope", "type");

CREATE TABLE "UserSettings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "chat" JSONB NOT NULL,
  "privacy" JSONB NOT NULL,
  "security" JSONB NOT NULL,
  "appearance" JSONB NOT NULL,
  "metadata" JSONB,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
CREATE INDEX "UserSettings_deletedAt_idx" ON "UserSettings"("deletedAt");

CREATE TABLE "Feedback" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID,
  "conversationId" UUID,
  "messageId" UUID,
  "rating" INTEGER,
  "comment" TEXT,
  "metadata" JSONB,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Feedback_userId_deletedAt_idx" ON "Feedback"("userId", "deletedAt");
CREATE INDEX "Feedback_conversationId_deletedAt_idx" ON "Feedback"("conversationId", "deletedAt");
CREATE INDEX "Feedback_messageId_deletedAt_idx" ON "Feedback"("messageId", "deletedAt");

CREATE TABLE "Attachment" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID,
  "conversationId" UUID NOT NULL,
  "messageId" UUID,
  "type" "AttachmentType" NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "mimeType" VARCHAR(255) NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "storageKey" TEXT,
  "url" TEXT,
  "metadata" JSONB,
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Attachment_conversationId_deletedAt_idx" ON "Attachment"("conversationId", "deletedAt");
CREATE INDEX "Attachment_messageId_deletedAt_idx" ON "Attachment"("messageId", "deletedAt");
CREATE INDEX "Attachment_userId_deletedAt_idx" ON "Attachment"("userId", "deletedAt");

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message"
  ADD CONSTRAINT "Message_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MedicalProfile"
  ADD CONSTRAINT "MedicalProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Memory"
  ADD CONSTRAINT "Memory_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Memory_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "UserSettings"
  ADD CONSTRAINT "UserSettings_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Feedback"
  ADD CONSTRAINT "Feedback_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Feedback_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Feedback_messageId_fkey"
  FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Attachment"
  ADD CONSTRAINT "Attachment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Attachment_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "Attachment_messageId_fkey"
  FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;