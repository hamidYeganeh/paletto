import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentDto, PaymentProvider, PaymentStatus } from '@workspace/shared';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>) {}

  /**
   * Mock payment gateway: no external calls, resolves instantly as succeeded.
   */
  async createAndProcess(orderId: string, amount: number, currency: string): Promise<PaymentDocument> {
    const payment = new this.paymentModel({
      orderId: new Types.ObjectId(orderId),
      amount,
      currency,
      provider: PaymentProvider.MOCK,
      status: PaymentStatus.PENDING,
    });
    await payment.save();

    payment.status = PaymentStatus.SUCCEEDED;
    await payment.save();

    return payment;
  }

  async findByOrderId(orderId: string): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ orderId: new Types.ObjectId(orderId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  toDto(payment: PaymentDocument): PaymentDto {
    return {
      id: payment._id.toString(),
      orderId: payment.orderId.toString(),
      provider: payment.provider,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      createdAt: (payment.createdAt ?? new Date()).toISOString(),
    };
  }
}
