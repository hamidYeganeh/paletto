import { apiFetch, buildQuery } from "./api";

export type TaxonomyStatus = "active" | "deactive";
export type TaxonomyType = "techniques" | "styles" | "categories";

export type TaxonomyItem = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  status: TaxonomyStatus;
  createdAt: string;
  updatedAt: string;
};

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaxonomyStatus;
  sortBy?: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder?: "asc" | "desc";
};

export type TaxonomyPayload = {
  title: string;
  description?: string;
  slug: string;
  status: TaxonomyStatus;
};

const TAXONOMY_CONFIG = {
  techniques: {
    adminBase: "/admin/techniques",
    publicBase: "/techniques",
    listKey: "techniques",
    idKey: "techniqueId",
  },
  styles: {
    adminBase: "/admin/styles",
    publicBase: "/styles",
    listKey: "styles",
    idKey: "styleId",
  },
  categories: {
    adminBase: "/admin/categories",
    publicBase: "/categories",
    listKey: "categories",
    idKey: "categoryId",
  },
} as const;

export async function listTaxonomies(
  type: TaxonomyType,
  params: ListParams
) {
  const config = TAXONOMY_CONFIG[type];
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response = await apiFetch<
    { count: number } & Record<string, TaxonomyItem[]>
  >(`${config.adminBase}/list${query}`);

  return {
    count: response.count,
    items: response[config.listKey] ?? [],
  };
}

export async function getTaxonomy(type: TaxonomyType, id: string) {
  const config = TAXONOMY_CONFIG[type];
  return apiFetch<TaxonomyItem>(`${config.publicBase}/get`, {
    method: "POST",
    body: {
      [config.idKey]: id,
    },
  });
}

export async function createTaxonomy(
  type: TaxonomyType,
  payload: TaxonomyPayload
) {
  const config = TAXONOMY_CONFIG[type];
  return apiFetch<TaxonomyItem>(`${config.adminBase}/create`, {
    method: "POST",
    body: payload,
  });
}

export async function updateTaxonomy(
  type: TaxonomyType,
  id: string,
  payload: Partial<TaxonomyPayload>
) {
  const config = TAXONOMY_CONFIG[type];
  return apiFetch<TaxonomyItem>(`${config.adminBase}/update`, {
    method: "PATCH",
    body: {
      ...payload,
      [config.idKey]: id,
    },
  });
}
