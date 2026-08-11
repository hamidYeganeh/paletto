import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentProvider, PaymentStatus } from '@workspace/shared';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId!: Types.ObjectId;

  @Prop({ type: String, enum: PaymentProvider, default: PaymentProvider.MOCK })
  provider!: PaymentProvider;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Prop({ required: true })
  amount!: number;

  @Prop({ default: 'IRR' })
  currency!: string;

  createdAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
