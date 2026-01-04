export type CategoryStatus = "active" | "deactive";

export type CategoryItem = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export type CategoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CategoryStatus;
  sortBy?: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder?: "asc" | "desc";
};

export type CategoryPayload = {
  title: string;
  description?: string;
  slug: string;
  status: CategoryStatus;
};

export type CategoryListResponse = {
  count: number;
  items: CategoryItem[];
};

export type UpdateCategoryInput = {
  id: string;
  payload: Partial<CategoryPayload>;
};
