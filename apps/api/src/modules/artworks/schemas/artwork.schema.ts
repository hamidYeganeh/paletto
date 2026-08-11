import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ArtworkMedium, ArtworkStatus } from '@workspace/shared';

export type ArtworkDocument = Artwork & Document;

@Schema({ timestamps: true })
export class Artwork {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  artistId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ type: String, enum: ArtworkMedium, required: true })
  medium!: ArtworkMedium;

  @Prop({ required: true })
  price!: number;

  @Prop({ default: 'IRR' })
  currency!: string;

  @Prop({ type: String, enum: ArtworkStatus, default: ArtworkStatus.DRAFT, index: true })
  status!: ArtworkStatus;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  categoryIds!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Tag', default: [] })
  tagIds!: Types.ObjectId[];

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop()
  depth?: number;

  @Prop()
  year?: number;

  @Prop({ default: false })
  isFramed?: boolean;

  @Prop({ default: 0 })
  likesCount!: number;

  @Prop({ default: 0 })
  viewsCount!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ArtworkSchema = SchemaFactory.createForClass(Artwork);
ArtworkSchema.index({ title: 'text', description: 'text' });
