import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type { Paginated, Post, CreatePostPayload } from "./posts.types";

export type PostListParams = {
  page?: number;
  limit?: number;
};

export const DEFAULT_POST_PAGE_SIZE = 5;

const normalizeParams = (
  params?: PostListParams
): Required<PostListParams> => ({
  page: params?.page ?? 1,
  limit: params?.limit ?? DEFAULT_POST_PAGE_SIZE,
});

export async function fetchPosts(
  params?: PostListParams
): Promise<Paginated<Post>> {
  const normalized = normalizeParams(params);

  const data = await http.get<Post[]>(endpoints.posts.list, {
    query: {
      _page: normalized.page,
      _limit: normalized.limit,
    },
  });

  return {
    items: data,
    page: normalized.page,
    limit: normalized.limit,
    hasMore: data.length === normalized.limit,
  };
}

export async function fetchPost(postId: number | string) {
  return http.get<Post>(endpoints.posts.detail(postId));
}

export async function createPost(payload: CreatePostPayload) {
  return http.post<Post, CreatePostPayload>(endpoints.posts.list, payload);
}

export { normalizeParams as normalizePostParams };
