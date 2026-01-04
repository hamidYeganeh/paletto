import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type {
  TechniqueItem,
  TechniqueListParams,
  TechniqueListResponse,
  TechniquePayload,
} from "./techniques.types";

export async function fetchTechniques(
  params?: TechniqueListParams
): Promise<TechniqueListResponse> {
  const response = await http.get<{ count: number; techniques: TechniqueItem[] }>(
    endpoints.techniques.admin.list,
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
    items: response.techniques ?? [],
  };
}

export async function fetchTechnique(id: string): Promise<TechniqueItem> {
  return http.post<TechniqueItem, { techniqueId: string }>(
    endpoints.techniques.public.get,
    {
      techniqueId: id,
    }
  );
}

export async function createTechnique(
  payload: TechniquePayload
): Promise<TechniqueItem> {
  return http.post<TechniqueItem, TechniquePayload>(
    endpoints.techniques.admin.create,
    payload
  );
}

export async function updateTechnique(
  id: string,
  payload: Partial<TechniquePayload>
): Promise<TechniqueItem> {
  return http.patch<TechniqueItem, Record<string, unknown>>(
    endpoints.techniques.admin.update,
    {
      ...payload,
      techniqueId: id,
    }
  );
}
