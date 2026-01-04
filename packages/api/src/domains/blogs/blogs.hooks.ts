import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import {
  createBlog,
  fetchBlog,
  fetchBlogs,
  updateBlog,
  updateBlogStatus,
} from "./blogs.api";
import { blogKeys } from "./blogs.keys";
import type {
  BlogItem,
  BlogListParams,
  BlogListResponse,
  BlogPayload,
  UpdateBlogInput,
} from "./blogs.types";

export function useBlogs(
  params?: BlogListParams,
  options?: UseQueryOptions<BlogListResponse, ApiError>
) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => fetchBlogs(params),
    staleTime: 60_000,
    ...options,
  });
}

export function useBlog(
  id: string,
  options?: UseQueryOptions<BlogItem, ApiError>
) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => fetchBlog(id),
    staleTime: 60_000,
    ...options,
  });
}

export function useCreateBlog(
  options?: UseMutationOptions<BlogItem, ApiError, BlogPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: blogKeys.create(),
    mutationFn: (payload) => createBlog(payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.listRoot(),
        exact: false,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUpdateBlog(
  options?: UseMutationOptions<BlogItem, ApiError, UpdateBlogInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: blogKeys.update(),
    mutationFn: ({ id, payload }) => updateBlog(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.listRoot(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(variables.id),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUpdateBlogStatus(
  options?: UseMutationOptions<
    BlogItem,
    ApiError,
    { id: string; status: BlogPayload["status"] }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: blogKeys.updateStatus(),
    mutationFn: ({ id, status }) => updateBlogStatus(id, status),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: blogKeys.listRoot(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(variables.id),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
