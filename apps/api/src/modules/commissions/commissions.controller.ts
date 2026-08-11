import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@workspace/shared';
import { CommissionsService } from './commissions.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionStatusDto } from './dto/update-commission-status.dto';

@Controller('commissions')
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateCommissionDto) {
    const commission = await this.commissionsService.create(user.userId, dto);
    return this.commissionsService.toDto(commission);
  }

  @Get('sent')
  findSent(@CurrentUser() user: RequestUser, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.commissionsService.findSent(user.userId, page, limit);
  }

  @Get('received')
  findReceived(@CurrentUser() user: RequestUser, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.commissionsService.findReceived(user.userId, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const commission = await this.commissionsService.findByIdOrThrow(id);
    return this.commissionsService.toDto(commission);
  }

  @Patch(':id/status')
  async updateStatus(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateCommissionStatusDto,
  ) {
    const commission = await this.commissionsService.updateStatus(
      id,
      user.userId,
      user.role === UserRole.ADMIN,
      dto,
    );
    return this.commissionsService.toDto(commission);
  }
}
