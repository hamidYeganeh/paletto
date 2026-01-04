import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type {
  BlogItem,
  BlogListParams,
  BlogListResponse,
  BlogPayload,
  BlogStatus,
} from "./blogs.types";

export async function fetchBlogs(
  params?: BlogListParams
): Promise<BlogListResponse> {
  const response = await http.get<{ count: number; blogs: BlogItem[] }>(
    endpoints.blogs.admin.list,
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
    items: response.blogs ?? [],
  };
}

export async function fetchBlog(id: string): Promise<BlogItem> {
  return http.post<BlogItem, { blogId: string }>(endpoints.blogs.admin.get, {
    blogId: id,
  });
}

export async function createBlog(payload: BlogPayload): Promise<BlogItem> {
  return http.post<BlogItem, BlogPayload>(
    endpoints.blogs.admin.create,
    payload
  );
}

export async function updateBlog(
  id: string,
  payload: Partial<BlogPayload>
): Promise<BlogItem> {
  return http.patch<BlogItem, Record<string, unknown>>(
    endpoints.blogs.admin.update,
    {
      ...payload,
      blogId: id,
    }
  );
}

export async function updateBlogStatus(
  id: string,
  status: BlogStatus
): Promise<BlogItem> {
  return http.patch<BlogItem, { blogId: string; status: BlogStatus }>(
    endpoints.blogs.admin.updateStatus,
    {
      blogId: id,
      status,
    }
  );
}
