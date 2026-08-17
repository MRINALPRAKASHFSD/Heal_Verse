import { z } from 'zod';
import { NotificationChannel, NotificationPriority, NotificationStatus } from '../../enums/notification.enums';
import { isoDateStringSchema, nonEmptyStringSchema, uuidSchema } from '../../schemas/common.schemas';

export const notificationChannelSchema = z.nativeEnum(NotificationChannel);
export const notificationPrioritySchema = z.nativeEnum(NotificationPriority);
export const notificationStatusSchema = z.nativeEnum(NotificationStatus);

export const notificationSchema = z.object({
  id: uuidSchema,
  title: nonEmptyStringSchema,
  body: nonEmptyStringSchema,
  channel: notificationChannelSchema,
  priority: notificationPrioritySchema,
  status: notificationStatusSchema,
  createdAt: isoDateStringSchema,
  readAt: isoDateStringSchema.optional(),
});

export const notificationPreferenceSchema = z.object({
  enabled: z.boolean(),
  channels: z.array(notificationChannelSchema),
  priority: notificationPrioritySchema,
});

export type NotificationSchema = z.infer<typeof notificationSchema>;
export type NotificationPreferenceSchema = z.infer<typeof notificationPreferenceSchema>;