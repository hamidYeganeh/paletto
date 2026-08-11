import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReviewStatus } from '@workspace/shared';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  authorId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  targetId!: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @Prop()
  comment?: string;

  @Prop({ type: String, enum: ReviewStatus, default: ReviewStatus.APPROVED, index: true })
  status!: ReviewStatus;

  createdAt?: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
