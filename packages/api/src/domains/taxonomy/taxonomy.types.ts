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

export type TaxonomyListParams = {
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

export type TaxonomyListResponse = {
  count: number;
  items: TaxonomyItem[];
};

export type UpdateTaxonomyInput = {
  id: string;
  payload: Partial<TaxonomyPayload>;
};
