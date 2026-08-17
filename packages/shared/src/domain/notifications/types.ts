import type { ISODateString, UUID } from '../../types';
import { NotificationChannel, NotificationPriority, NotificationStatus } from '../../enums/notification.enums';

export type { NotificationChannel, NotificationPriority, NotificationStatus };

export interface Notification {
  readonly id: UUID;
  readonly title: string;
  readonly body: string;
  readonly channel: NotificationChannel;
  readonly priority: NotificationPriority;
  readonly status: NotificationStatus;
  readonly createdAt: ISODateString;
  readonly readAt?: ISODateString;
}

export interface NotificationPreference {
  readonly enabled: boolean;
  readonly channels: NotificationChannel[];
  readonly priority: NotificationPriority;
}