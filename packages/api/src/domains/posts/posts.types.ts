export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type CreatePostPayload = {
  title: string;
  body: string;
  userId: number;
};

export type Paginated<TData> = {
  items: TData[];
  page: number;
  limit: number;
  hasMore: boolean;
  total?: number;
};
