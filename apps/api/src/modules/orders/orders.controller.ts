import { Body, Controller, ForbiddenException, Get, Param, Post, Query } from '@nestjs/common';
import { UserRole } from '@workspace/shared';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateOrderDto) {
    const order = await this.ordersService.create(user.userId, dto);
    return this.ordersService.toDto(order);
  }

  @Get('me')
  findMine(@CurrentUser() user: RequestUser, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ordersService.findForUser(user.userId, page, limit);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ordersService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    const order = await this.ordersService.findByIdOrThrow(id);
    if (user.role !== UserRole.ADMIN && order.buyerId.toString() !== user.userId) {
      throw new ForbiddenException('You do not have access to this order');
    }
    return this.ordersService.toDto(order);
  }

  @Post(':id/pay')
  pay(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.ordersService.pay(id, user.userId, user.role === UserRole.ADMIN);
  }
}
