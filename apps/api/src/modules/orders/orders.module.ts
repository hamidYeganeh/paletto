import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ArtworksModule } from '../artworks/artworks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    ArtworksModule,
  ],
  controllers: [OrdersController, PaymentsController],
  providers: [OrdersService, PaymentsService],
  exports: [OrdersService, PaymentsService],
})
export class OrdersModule {}
