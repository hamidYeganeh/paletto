export type TechniqueStatus = "active" | "deactive";

export type TechniqueItem = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  status: TechniqueStatus;
  createdAt: string;
  updatedAt: string;
};

export type TechniqueListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TechniqueStatus;
  sortBy?: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder?: "asc" | "desc";
};

export type TechniquePayload = {
  title: string;
  description?: string;
  slug: string;
  status: TechniqueStatus;
};

export type TechniqueListResponse = {
  count: number;
  items: TechniqueItem[];
};

export type UpdateTechniqueInput = {
  id: string;
  payload: Partial<TechniquePayload>;
};
