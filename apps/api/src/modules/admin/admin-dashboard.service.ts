import { Injectable } from '@nestjs/common';
import { AdminDashboardStatsDto, UserRole } from '@workspace/shared';
import { UsersService } from '../users/users.service';
import { ArtworksService } from '../artworks/artworks.service';
import { OrdersService } from '../orders/orders.service';
import { CommissionsService } from '../commissions/commissions.service';

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly artworksService: ArtworksService,
    private readonly ordersService: OrdersService,
    private readonly commissionsService: CommissionsService,
  ) {}

  async getStats(): Promise<AdminDashboardStatsDto> {
    const [totalUsers, totalArtists, totalArtworks, totalOrders, totalCommissions, totalRevenue] =
      await Promise.all([
        this.usersService.count(),
        this.usersService.count({ role: UserRole.ARTIST }),
        this.artworksService.count(),
        this.ordersService.count(),
        this.commissionsService.count(),
        this.ordersService.totalRevenue(),
      ]);

    return {
      totalUsers,
      totalArtists,
      totalArtworks,
      totalOrders,
      totalCommissions,
      totalRevenue,
    };
  }
}
