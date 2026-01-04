import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import {
  createCategory,
  fetchCategory,
  fetchCategories,
  updateCategory,
} from "./categories.api";
import { categoryKeys } from "./categories.keys";
import type {
  CategoryItem,
  CategoryListParams,
  CategoryListResponse,
  CategoryPayload,
  UpdateCategoryInput,
} from "./categories.types";

export function useCategories(
  params?: CategoryListParams,
  options?: UseQueryOptions<CategoryListResponse, ApiError>
) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => fetchCategories(params),
    staleTime: 60_000,
    ...options,
  });
}

export function useCategory(
  id: string,
  options?: UseQueryOptions<CategoryItem, ApiError>
) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategory(id),
    staleTime: 60_000,
    ...options,
  });
}

export function useCreateCategory(
  options?: UseMutationOptions<CategoryItem, ApiError, CategoryPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: categoryKeys.create(),
    mutationFn: (payload) => createCategory(payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.listRoot(),
        exact: false,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUpdateCategory(
  options?: UseMutationOptions<CategoryItem, ApiError, UpdateCategoryInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: categoryKeys.update(),
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.listRoot(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
