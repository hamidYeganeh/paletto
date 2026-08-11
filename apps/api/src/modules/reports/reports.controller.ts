import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@workspace/shared';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, RequestUser } from '../../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateReportDto) {
    const report = await this.reportsService.create(user.userId, dto);
    return this.reportsService.toDto(report);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.reportsService.findAll(page, limit);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
    const report = await this.reportsService.updateStatus(id, dto);
    return this.reportsService.toDto(report);
  }
}
