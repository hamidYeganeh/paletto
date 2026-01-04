import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type {
  StyleItem,
  StyleListParams,
  StyleListResponse,
  StylePayload,
} from "./styles.types";

export async function fetchStyles(
  params?: StyleListParams
): Promise<StyleListResponse> {
  const response = await http.get<{ count: number; styles: StyleItem[] }>(
    endpoints.styles.admin.list,
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
    items: response.styles ?? [],
  };
}

export async function fetchStyle(id: string): Promise<StyleItem> {
  return http.post<StyleItem, { styleId: string }>(
    endpoints.styles.public.get,
    {
      styleId: id,
    }
  );
}

export async function createStyle(payload: StylePayload): Promise<StyleItem> {
  return http.post<StyleItem, StylePayload>(endpoints.styles.admin.create, payload);
}

export async function updateStyle(
  id: string,
  payload: Partial<StylePayload>
): Promise<StyleItem> {
  return http.patch<StyleItem, Record<string, unknown>>(
    endpoints.styles.admin.update,
    {
      ...payload,
      styleId: id,
    }
  );
}
