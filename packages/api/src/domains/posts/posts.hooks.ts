import {
  type InfiniteData,
  type QueryClient,
  type UseInfiniteQueryOptions,
  type UseMutationOptions,
  type UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import {
  createPost,
  fetchPost,
  fetchPosts,
  normalizePostParams,
} from "./posts.api";
import { postsKeys } from "./posts.keys";
import type { CreatePostPayload, Paginated, Post } from "./posts.types";

export function usePosts(
  params?: Parameters<typeof normalizePostParams>[0],
  options?: UseQueryOptions<Paginated<Post>, ApiError>
) {
  const normalized = normalizePostParams(params);

  return useQuery({
    queryKey: postsKeys.list(normalized),
    queryFn: () => fetchPosts(normalized),
    staleTime: 60_000,
    ...options,
  });
}

export function usePost(
  postId: number | string,
  options?: UseQueryOptions<Post, ApiError>
) {
  return useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: () => fetchPost(postId),
    staleTime: 60_000,
    ...options,
  });
}

export function useInfinitePosts(
  limit?: number,
  options?: UseInfiniteQueryOptions<
    Paginated<Post>,
    ApiError,
    InfiniteData<Paginated<Post>>
  >
): ReturnType<typeof useInfiniteQuery<Paginated<Post>, ApiError>> {
  const normalized = normalizePostParams({ limit });

  return useInfiniteQuery({
    queryKey: postsKeys.infinite(normalized.limit),
    initialPageParam: normalized.page,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    queryFn: ({ pageParam = normalized.page }) =>
      fetchPosts({ page: Number(pageParam), limit: normalized.limit }),
    ...options,
  });
}

type CreatePostContext = {
  previousPage?: Paginated<Post>;
  previousInfinite?: InfiniteData<Paginated<Post>>;
  optimisticPost?: Post;
};

export function useCreatePost(
  params?: Parameters<typeof normalizePostParams>[0],
  options?: UseMutationOptions<Post, ApiError, CreatePostPayload, CreatePostContext>
) {
  const queryClient = useQueryClient();
  const normalized = normalizePostParams(params);
  const listKey = postsKeys.list(normalized);
  const infiniteKey = postsKeys.infinite(normalized.limit);

  return useMutation({
    mutationKey: postsKeys.create(),
    mutationFn: createPost,
    networkMode: "offlineFirst",
    ...options,
    onMutate: async (input): Promise<CreatePostContext> => {
      await queryClient.cancelQueries({ queryKey: postsKeys.root });

      const optimisticPost: Post = {
        ...input,
        id: Date.now(),
      };

      const previousPage = queryClient.getQueryData<Paginated<Post>>(listKey);
      if (previousPage) {
        queryClient.setQueryData<Paginated<Post>>(listKey, (current) => {
          if (!current) return current;
          return { ...current, items: [optimisticPost, ...current.items] };
        });
      }

      const previousInfinite =
        queryClient.getQueryData<InfiniteData<Paginated<Post>>>(infiniteKey);

      if (previousInfinite) {
        queryClient.setQueryData<InfiniteData<Paginated<Post>>>(infiniteKey, (current) => {
          if (!current?.pages?.length) return current;

          const [firstPage, ...restPages] = current.pages;
          if (!firstPage) return current;

          return {
            ...current,
            pages: [
              {
                ...firstPage,
                items: [optimisticPost, ...firstPage.items],
              },
              ...restPages,
            ],
          };
        });
      }

      const context: CreatePostContext = {
        previousPage,
        previousInfinite,
        optimisticPost,
      };

      return context;
    },
    onError: (error, variables, context, mutationContext) => {
      if (context?.previousPage) {
        queryClient.setQueryData(listKey, context.previousPage);
      }
      if (context?.previousInfinite) {
        queryClient.setQueryData(infiniteKey, context.previousInfinite);
      }
      options?.onError?.(error, variables, context, mutationContext);
    },
    onSuccess: (data, variables, context, mutationContext) => {
      queryClient.setQueryData<Paginated<Post>>(listKey, (current) => {
        if (!current) return current;

        const filtered = current.items.filter(
          (post) => post.id !== context?.optimisticPost?.id
        );

        return { ...current, items: [data, ...filtered] };
      });

      queryClient.setQueryData<InfiniteData<Paginated<Post>>>(infiniteKey, (current) => {
        if (!current?.pages?.length) return current;

        const [firstPage, ...restPages] = current.pages;
        if (!firstPage) return current;

        const filtered = firstPage.items.filter((post) => post.id !== context?.optimisticPost?.id);
        const updatedFirstPage = { ...firstPage, items: [data, ...filtered] };

        return { ...current, pages: [updatedFirstPage, ...restPages] };
      });

      options?.onSuccess?.(data, variables, context, mutationContext);
    },
    onSettled: (data, error, variables, context, mutationContext) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.root });
      options?.onSettled?.(data, error, variables, context, mutationContext);
    },
  });
}

export async function prefetchPostsList(
  queryClient: QueryClient,
  params?: Parameters<typeof normalizePostParams>[0]
) {
  const normalized = normalizePostParams(params);
  await queryClient.prefetchQuery({
    queryKey: postsKeys.list(normalized),
    queryFn: () => fetchPosts(normalized),
  });
}

export async function prefetchPost(queryClient: QueryClient, postId: number | string) {
  await queryClient.prefetchQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: () => fetchPost(postId),
  });
}
