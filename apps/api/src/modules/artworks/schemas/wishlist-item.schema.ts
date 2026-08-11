import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WishlistItemDocument = WishlistItem & Document;

@Schema({ timestamps: true })
export class WishlistItem {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Artwork', required: true, index: true })
  artworkId!: Types.ObjectId;

  createdAt?: Date;
}

export const WishlistItemSchema = SchemaFactory.createForClass(WishlistItem);
WishlistItemSchema.index({ userId: 1, artworkId: 1 }, { unique: true });
