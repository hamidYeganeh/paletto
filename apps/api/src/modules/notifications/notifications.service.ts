import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationDto, NotificationType } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    body?: string,
    metadata?: Record<string, unknown>,
  ): Promise<NotificationDocument> {
    const created = new this.notificationModel({
      userId: new Types.ObjectId(userId),
      type,
      title,
      body,
      metadata,
    });
    return created.save();
  }

  async findForUser(userId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { userId: new Types.ObjectId(userId) };
    const [items, total, unreadCount] = await Promise.all([
      this.notificationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.notificationModel.countDocuments(filter).exec(),
      this.notificationModel.countDocuments({ ...filter, isRead: false }).exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l, unreadCount };
  }

  async markRead(id: string, userId: string): Promise<void> {
    await this.notificationModel
      .updateOne({ _id: id, userId: new Types.ObjectId(userId) }, { isRead: true })
      .exec();
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ userId: new Types.ObjectId(userId) }, { isRead: true }).exec();
  }

  toDto(notification: NotificationDocument): NotificationDto {
    return {
      id: notification._id.toString(),
      userId: notification.userId.toString(),
      type: notification.type,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      metadata: notification.metadata,
      createdAt: (notification.createdAt ?? new Date()).toISOString(),
    };
  }
}
