import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, index: true })
  slug!: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
