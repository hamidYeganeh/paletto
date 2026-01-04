export type BlogStatus = "active" | "deactive" | "draft";

export type BlogItem = {
  _id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  status: BlogStatus;
  cover: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogStatus;
  sortBy?: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder?: "asc" | "desc";
};

export type BlogListResponse = {
  count: number;
  items: BlogItem[];
};

export type BlogPayload = {
  title: string;
  description: string;
  content: string;
  slug: string;
  status: BlogStatus;
  cover: string;
};

export type UpdateBlogInput = {
  id: string;
  payload: Partial<BlogPayload>;
};

export type UpdateBlogStatusInput = {
  id: string;
  status: BlogStatus;
};
