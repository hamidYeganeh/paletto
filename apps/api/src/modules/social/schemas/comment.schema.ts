import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Artwork', required: true, index: true })
  artworkId!: Types.ObjectId;

  @Prop({ required: true })
  content!: string;

  createdAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
