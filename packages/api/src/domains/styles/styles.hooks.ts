import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import { createStyle, fetchStyle, fetchStyles, updateStyle } from "./styles.api";
import { styleKeys } from "./styles.keys";
import type {
  StyleItem,
  StyleListParams,
  StyleListResponse,
  StylePayload,
  UpdateStyleInput,
} from "./styles.types";

export function useStyles(
  params?: StyleListParams,
  options?: UseQueryOptions<StyleListResponse, ApiError>
) {
  return useQuery({
    queryKey: styleKeys.list(params),
    queryFn: () => fetchStyles(params),
    staleTime: 60_000,
    ...options,
  });
}

export function useStyle(
  id: string,
  options?: UseQueryOptions<StyleItem, ApiError>
) {
  return useQuery({
    queryKey: styleKeys.detail(id),
    queryFn: () => fetchStyle(id),
    staleTime: 60_000,
    ...options,
  });
}

export function useCreateStyle(
  options?: UseMutationOptions<StyleItem, ApiError, StylePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: styleKeys.create(),
    mutationFn: (payload) => createStyle(payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: styleKeys.listRoot(),
        exact: false,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUpdateStyle(
  options?: UseMutationOptions<StyleItem, ApiError, UpdateStyleInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: styleKeys.update(),
    mutationFn: ({ id, payload }) => updateStyle(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: styleKeys.listRoot(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: styleKeys.detail(variables.id),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
