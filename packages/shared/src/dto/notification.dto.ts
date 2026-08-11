import { NotificationType } from '../enums';

export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
