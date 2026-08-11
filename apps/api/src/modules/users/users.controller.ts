import { Body, Controller, Get, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { UserRole } from '@workspace/shared';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() user: RequestUser) {
    const found = await this.usersService.findById(user.userId);
    if (!found) throw new NotFoundException('User not found');
    return this.usersService.toDto(found);
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: RequestUser, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateUser(user.userId, dto);
    return this.usersService.toDto(updated);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('role') role?: UserRole) {
    return this.usersService.findAll(page, limit, role);
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const found = await this.usersService.findById(id);
    if (!found) throw new NotFoundException('User not found');
    return this.usersService.toDto(found);
  }
}
