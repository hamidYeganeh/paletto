import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '@workspace/shared';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Artwork', required: true })
  artworkId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true, default: 1 })
  quantity!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  addressLine1!: string;

  @Prop()
  addressLine2?: string;

  @Prop({ required: true })
  city!: string;

  @Prop()
  province?: string;

  @Prop()
  postalCode?: string;

  @Prop({ required: true })
  country!: string;
}

export const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  buyerId!: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItem[];

  @Prop({ required: true })
  totalAmount!: number;

  @Prop({ default: 'IRR' })
  currency!: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING, index: true })
  status!: OrderStatus;

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress!: ShippingAddress;

  createdAt?: Date;
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
