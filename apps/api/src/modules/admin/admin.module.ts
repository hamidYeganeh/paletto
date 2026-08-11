import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ArtworksModule } from '../artworks/artworks.module';
import { OrdersModule } from '../orders/orders.module';
import { CommissionsModule } from '../commissions/commissions.module';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';

@Module({
  imports: [UsersModule, ArtworksModule, OrdersModule, CommissionsModule],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminModule {}
