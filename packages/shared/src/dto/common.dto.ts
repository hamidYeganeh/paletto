export interface PaginationQueryDto {
  page?: number;
  limit?: number;
}

export interface PaginatedResultDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminDashboardStatsDto {
  totalUsers: number;
  totalArtists: number;
  totalArtworks: number;
  totalOrders: number;
  totalCommissions: number;
  totalRevenue: number;
}
