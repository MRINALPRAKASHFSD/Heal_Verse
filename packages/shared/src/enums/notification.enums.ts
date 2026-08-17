export enum NotificationChannel {
  InApp = 'in-app',
  Email = 'email',
  Push = 'push',
  Sms = 'sms',
}

export enum NotificationStatus {
  Pending = 'pending',
  Sent = 'sent',
  Delivered = 'delivered',
  Read = 'read',
  Archived = 'archived',
}

export enum NotificationPriority {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Urgent = 'urgent',
}