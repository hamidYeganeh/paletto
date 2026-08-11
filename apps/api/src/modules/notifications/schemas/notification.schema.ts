import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType } from '@workspace/shared';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type!: NotificationType;

  @Prop({ required: true })
  title!: string;

  @Prop()
  body?: string;

  @Prop({ default: false, index: true })
  isRead!: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;

  createdAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
