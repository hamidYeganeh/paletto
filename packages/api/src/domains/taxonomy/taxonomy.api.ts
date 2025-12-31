import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type {
  TaxonomyItem,
  TaxonomyListParams,
  TaxonomyListResponse,
  TaxonomyPayload,
  TaxonomyType,
} from "./taxonomy.types";

const TAXONOMY_CONFIG = {
  techniques: {
    endpoints: endpoints.taxonomies.techniques,
    listKey: "techniques",
    idKey: "techniqueId",
  },
  styles: {
    endpoints: endpoints.taxonomies.styles,
    listKey: "styles",
    idKey: "styleId",
  },
  categories: {
    endpoints: endpoints.taxonomies.categories,
    listKey: "categories",
    idKey: "categoryId",
  },
} as const;

export async function fetchTaxonomies(
  type: TaxonomyType,
  params?: TaxonomyListParams
): Promise<TaxonomyListResponse> {
  const config = TAXONOMY_CONFIG[type];
  const response = await http.get<
    { count: number } & Record<string, TaxonomyItem[]>
  >(config.endpoints.admin.list, {
    query: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
      status: params?.status,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
    },
  });

  return {
    count: response.count ?? 0,
    items: response[config.listKey] ?? [],
  };
}

export async function fetchTaxonomy(
  type: TaxonomyType,
  id: string
): Promise<TaxonomyItem> {
  const config = TAXONOMY_CONFIG[type];
  return http.post<TaxonomyItem, Record<string, string>>(
    config.endpoints.public.get,
    {
      [config.idKey]: id,
    }
  );
}

export async function createTaxonomy(
  type: TaxonomyType,
  payload: TaxonomyPayload
): Promise<TaxonomyItem> {
  const config = TAXONOMY_CONFIG[type];
  return http.post<TaxonomyItem, TaxonomyPayload>(
    config.endpoints.admin.create,
    payload
  );
}

export async function updateTaxonomy(
  type: TaxonomyType,
  id: string,
  payload: Partial<TaxonomyPayload>
): Promise<TaxonomyItem> {
  const config = TAXONOMY_CONFIG[type];
  return http.patch<TaxonomyItem, Record<string, unknown>>(
    config.endpoints.admin.update,
    {
      ...payload,
      [config.idKey]: id,
    }
  );
}
