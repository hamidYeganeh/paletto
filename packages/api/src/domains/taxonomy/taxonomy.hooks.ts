import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import {
  createTaxonomy,
  fetchTaxonomies,
  fetchTaxonomy,
  updateTaxonomy,
} from "./taxonomy.api";
import { taxonomyKeys } from "./taxonomy.keys";
import type {
  TaxonomyItem,
  TaxonomyListParams,
  TaxonomyListResponse,
  TaxonomyPayload,
  TaxonomyType,
  UpdateTaxonomyInput,
} from "./taxonomy.types";

export function useTaxonomies(
  type: TaxonomyType,
  params?: TaxonomyListParams,
  options?: UseQueryOptions<TaxonomyListResponse, ApiError>
) {
  return useQuery({
    queryKey: taxonomyKeys.list(type, params),
    queryFn: () => fetchTaxonomies(type, params),
    staleTime: 60_000,
    ...options,
  });
}

export function useTaxonomy(
  type: TaxonomyType,
  id: string,
  options?: UseQueryOptions<TaxonomyItem, ApiError>
) {
  return useQuery({
    queryKey: taxonomyKeys.detail(type, id),
    queryFn: () => fetchTaxonomy(type, id),
    staleTime: 60_000,
    ...options,
  });
}

export function useCreateTaxonomy(
  type: TaxonomyType,
  options?: UseMutationOptions<TaxonomyItem, ApiError, TaxonomyPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: taxonomyKeys.create(type),
    mutationFn: (payload) => createTaxonomy(type, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: taxonomyKeys.listRoot(type),
        exact: false,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUpdateTaxonomy(
  type: TaxonomyType,
  options?: UseMutationOptions<TaxonomyItem, ApiError, UpdateTaxonomyInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: taxonomyKeys.update(type),
    mutationFn: ({ id, payload }) => updateTaxonomy(type, id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: taxonomyKeys.listRoot(type),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: taxonomyKeys.detail(type, variables.id),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
