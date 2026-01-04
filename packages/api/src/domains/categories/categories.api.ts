import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type {
  CategoryItem,
  CategoryListParams,
  CategoryListResponse,
  CategoryPayload,
} from "./categories.types";

export async function fetchCategories(
  params?: CategoryListParams
): Promise<CategoryListResponse> {
  const response = await http.get<{ count: number; categories: CategoryItem[] }>(
    endpoints.categories.admin.list,
    {
      query: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        status: params?.status,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
      },
    }
  );

  return {
    count: response.count ?? 0,
    items: response.categories ?? [],
  };
}

export async function fetchCategory(id: string): Promise<CategoryItem> {
  return http.post<CategoryItem, { categoryId: string }>(
    endpoints.categories.public.get,
    {
      categoryId: id,
    }
  );
}

export async function createCategory(
  payload: CategoryPayload
): Promise<CategoryItem> {
  return http.post<CategoryItem, CategoryPayload>(
    endpoints.categories.admin.create,
    payload
  );
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>
): Promise<CategoryItem> {
  return http.patch<CategoryItem, Record<string, unknown>>(
    endpoints.categories.admin.update,
    {
      ...payload,
      categoryId: id,
    }
  );
}
