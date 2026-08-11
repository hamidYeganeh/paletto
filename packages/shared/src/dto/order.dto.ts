import { OrderStatus, PaymentProvider, PaymentStatus } from '../enums';

export interface OrderItemDto {
  artworkId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderDto {
  id: string;
  buyerId: string;
  items: OrderItemDto[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  shippingAddress?: ShippingAddressDto;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddressDto {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  country: string;
}

export interface CreateOrderDto {
  items: { artworkId: string; quantity: number }[];
  shippingAddress: ShippingAddressDto;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface CreatePaymentDto {
  orderId: string;
}
