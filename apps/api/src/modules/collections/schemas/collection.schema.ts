import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CollectionVisibility } from '@workspace/shared';

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ type: String, enum: CollectionVisibility, default: CollectionVisibility.PRIVATE })
  visibility!: CollectionVisibility;

  @Prop({ type: [Types.ObjectId], ref: 'Artwork', default: [] })
  artworkIds!: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
