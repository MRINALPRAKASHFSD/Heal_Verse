export enum ConversationType {
  General = 'general',
  FollowUp = 'follow-up',
  MedicationReview = 'medication-review',
  SymptomCheck = 'symptom-check',
  CarePlan = 'care-plan',
}

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
  Tool = 'tool',
}

export enum MessageStatus {
  Draft = 'draft',
  Sending = 'sending',
  Streaming = 'streaming',
  Sent = 'sent',
  Delivered = 'delivered',
  Read = 'read',
  Failed = 'failed',
}

export enum AttachmentType {
  Document = 'document',
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
  Other = 'other',
}