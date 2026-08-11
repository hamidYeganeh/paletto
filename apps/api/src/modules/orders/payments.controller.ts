import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('order/:orderId')
  async findByOrder(@Param('orderId') orderId: string) {
    const payments = await this.paymentsService.findByOrderId(orderId);
    return payments.map((payment) => this.paymentsService.toDto(payment));
  }
}
