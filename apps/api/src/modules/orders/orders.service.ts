import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ArtworkStatus, OrderDto, OrderStatus, PaymentStatus } from '@workspace/shared';
import { parsePagination } from '../../common/utils/pagination.util';
import { ArtworksService } from '../artworks/artworks.service';
import { Order, OrderDocument, OrderItem } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentsService } from './payments.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly artworksService: ArtworksService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(buyerId: string, dto: CreateOrderDto): Promise<OrderDocument> {
    const items: OrderItem[] = [];
    let totalAmount = 0;

    for (const inputItem of dto.items) {
      const artwork = await this.artworksService.findByIdOrThrow(inputItem.artworkId);
      if (artwork.artistId.toString() === buyerId) {
        throw new BadRequestException('Cannot purchase your own artwork');
      }
      if (artwork.status !== ArtworkStatus.PUBLISHED) {
        throw new BadRequestException(`Artwork "${artwork.title}" is not available for purchase`);
      }
      const item: OrderItem = {
        artworkId: artwork._id,
        title: artwork.title,
        price: artwork.price,
        quantity: inputItem.quantity,
      };
      items.push(item);
      totalAmount += artwork.price * inputItem.quantity;
    }

    const order = new this.orderModel({
      buyerId: new Types.ObjectId(buyerId),
      items,
      totalAmount,
      currency: 'IRR',
      shippingAddress: dto.shippingAddress,
      status: OrderStatus.PENDING,
    });

    return order.save();
  }

  async findByIdOrThrow(id: string): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Order not found');
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findForUser(userId: string, page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const filter = { buyerId: new Types.ObjectId(userId) };
    const [items, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async findAll(page?: number, limit?: number) {
    const { page: p, limit: l, skip } = parsePagination(page, limit);
    const [items, total] = await Promise.all([
      this.orderModel.find().sort({ createdAt: -1 }).skip(skip).limit(l).exec(),
      this.orderModel.countDocuments().exec(),
    ]);
    return { items: items.map((item) => this.toDto(item)), total, page: p, limit: l };
  }

  async pay(orderId: string, requesterId: string, isAdmin: boolean) {
    const order = await this.findByIdOrThrow(orderId);
    if (!isAdmin && order.buyerId.toString() !== requesterId) {
      throw new ForbiddenException('You do not own this order');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in a payable state');
    }

    const payment = await this.paymentsService.createAndProcess(order._id.toString(), order.totalAmount, order.currency);

    if (payment.status === PaymentStatus.SUCCEEDED) {
      order.status = OrderStatus.PAID;
      await order.save();
      for (const item of order.items) {
        await this.artworksService.update(
          item.artworkId.toString(),
          requesterId,
          true,
          { status: ArtworkStatus.SOLD },
        );
      }
    }

    return { order: this.toDto(order), payment: this.paymentsService.toDto(payment) };
  }

  async totalRevenue(): Promise<number> {
    const result = await this.orderModel.aggregate<{ _id: null; total: number }>([
      { $match: { status: { $in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    return result[0]?.total ?? 0;
  }

  async count(): Promise<number> {
    return this.orderModel.countDocuments().exec();
  }

  toDto(order: OrderDocument): OrderDto {
    return {
      id: order._id.toString(),
      buyerId: order.buyerId.toString(),
      items: order.items.map((item) => ({
        artworkId: item.artworkId.toString(),
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      currency: order.currency,
      status: order.status,
      shippingAddress: order.shippingAddress,
      createdAt: (order.createdAt ?? new Date()).toISOString(),
      updatedAt: (order.updatedAt ?? new Date()).toISOString(),
    };
  }
}
