import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import {
  createTechnique,
  fetchTechnique,
  fetchTechniques,
  updateTechnique,
} from "./techniques.api";
import { techniqueKeys } from "./techniques.keys";
import type {
  TechniqueItem,
  TechniqueListParams,
  TechniqueListResponse,
  TechniquePayload,
  UpdateTechniqueInput,
} from "./techniques.types";

export function useTechniques(
  params?: TechniqueListParams,
  options?: UseQueryOptions<TechniqueListResponse, ApiError>
) {
  return useQuery({
    queryKey: techniqueKeys.list(params),
    queryFn: () => fetchTechniques(params),
    staleTime: 60_000,
    ...options,
  });
}

export function useTechnique(
  id: string,
  options?: UseQueryOptions<TechniqueItem, ApiError>
) {
  return useQuery({
    queryKey: techniqueKeys.detail(id),
    queryFn: () => fetchTechnique(id),
    staleTime: 60_000,
    ...options,
  });
}

export function useCreateTechnique(
  options?: UseMutationOptions<TechniqueItem, ApiError, TechniquePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: techniqueKeys.create(),
    mutationFn: (payload) => createTechnique(payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: techniqueKeys.listRoot(),
        exact: false,
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}

export function useUpdateTechnique(
  options?: UseMutationOptions<TechniqueItem, ApiError, UpdateTechniqueInput>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: techniqueKeys.update(),
    mutationFn: ({ id, payload }) => updateTechnique(id, payload),
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: techniqueKeys.listRoot(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: techniqueKeys.detail(variables.id),
      });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
