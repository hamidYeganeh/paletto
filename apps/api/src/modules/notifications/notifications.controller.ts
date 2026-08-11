import { Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotificationType } from '@workspace/shared';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findMine(@CurrentUser() user: RequestUser, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.findForUser(user.userId, page, limit);
  }

  @Patch('read-all')
  async markAllRead(@CurrentUser() user: RequestUser) {
    await this.notificationsService.markAllRead(user.userId);
    return { success: true };
  }

  @Patch(':id/read')
  async markRead(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    await this.notificationsService.markRead(id, user.userId);
    return { success: true };
  }

  @Post('test')
  async test(@CurrentUser() user: RequestUser) {
    const notification = await this.notificationsService.create(
      user.userId,
      NotificationType.SYSTEM,
      'Test notification',
      'This is a manual test notification',
    );
    return this.notificationsService.toDto(notification);
  }
}
