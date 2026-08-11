import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExhibitionStatus } from '@workspace/shared';

export type ExhibitionDocument = Exhibition & Document;

@Schema({ timestamps: true })
export class Exhibition {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop()
  description?: string;

  @Prop()
  coverImageUrl?: string;

  @Prop({ type: String, enum: ExhibitionStatus, default: ExhibitionStatus.DRAFT, index: true })
  status!: ExhibitionStatus;

  @Prop({ type: [Types.ObjectId], ref: 'Artwork', default: [] })
  artworkIds!: Types.ObjectId[];

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExhibitionSchema = SchemaFactory.createForClass(Exhibition);
