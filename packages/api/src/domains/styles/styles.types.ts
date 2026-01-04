export type StyleStatus = "active" | "deactive";

export type StyleItem = {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  status: StyleStatus;
  createdAt: string;
  updatedAt: string;
};

export type StyleListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: StyleStatus;
  sortBy?: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder?: "asc" | "desc";
};

export type StylePayload = {
  title: string;
  description?: string;
  slug: string;
  status: StyleStatus;
};

export type StyleListResponse = {
  count: number;
  items: StyleItem[];
};

export type UpdateStyleInput = {
  id: string;
  payload: Partial<StylePayload>;
};
