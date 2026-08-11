import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CommissionStatus } from '@workspace/shared';

export type CommissionDocument = Commission & Document;

@Schema({ timestamps: true })
export class Commission {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  customerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  artistId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop()
  budget?: number;

  @Prop({ type: String, enum: CommissionStatus, default: CommissionStatus.REQUESTED, index: true })
  status!: CommissionStatus;

  @Prop({ type: [String], default: [] })
  referenceImages?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);
