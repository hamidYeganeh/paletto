import { Controller, Get } from '@nestjs/common';
import { UserRole } from '@workspace/shared';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminDashboardService } from './admin-dashboard.service';

@Roles(UserRole.ADMIN)
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get()
  getStats() {
    return this.adminDashboardService.getStats();
  }
}
