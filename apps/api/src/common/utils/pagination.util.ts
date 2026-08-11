import { PaginatedResultDto } from '@workspace/shared';

export function paginate<T>(items: T[], total: number, page: number, limit: number): PaginatedResultDto<T> {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function parsePagination(page?: number | string, limit?: number | string) {
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (parsedPage - 1) * parsedLimit;
  return { page: parsedPage, limit: parsedLimit, skip };
}
