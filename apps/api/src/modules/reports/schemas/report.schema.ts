import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportReason, ReportStatus } from '@workspace/shared';

export type ReportTargetType = 'artwork' | 'user' | 'comment' | 'review';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  reporterId!: Types.ObjectId;

  @Prop({ required: true })
  targetType!: ReportTargetType;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  targetId!: Types.ObjectId;

  @Prop({ type: String, enum: ReportReason, required: true })
  reason!: ReportReason;

  @Prop()
  description?: string;

  @Prop({ type: String, enum: ReportStatus, default: ReportStatus.OPEN, index: true })
  status!: ReportStatus;

  createdAt?: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
