import {
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
  fetchUser,
  fetchUserProfile,
  fetchUsers,
  updateUserProfile,
} from "./users.api";
import { usersKeys } from "./users.keys";
import type {
  UpdateUserProfilePayload,
  User,
  UserProfile,
  UserProfileResponse,
  UsersListParams,
  UsersListResponse,
} from "./users.types";

export function useUsers(
  params?: UsersListParams,
  options?: UseQueryOptions<UsersListResponse, ApiError>
) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => fetchUsers(params),
    staleTime: 60_000,
    ...options,
  });
}

export function useUser(
  userId: number | string,
  options?: UseQueryOptions<User, ApiError>
) {
  return useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: () => fetchUser(userId),
    staleTime: 60_000,
    ...options,
  });
}

export function useInfiniteUsers(
  params?: UsersListParams,
  options?: UseInfiniteQueryOptions<UsersListResponse, ApiError>
) {
  return useInfiniteQuery({
    queryKey: usersKeys.list(params),
    initialPageParam: params?.page ?? 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      const currentPage =
        typeof lastPageParam === "number" ? lastPageParam : params?.page ?? 1;
      const pageSize = params?.limit ?? 10;
      const totalPages =
        lastPage.count && pageSize ? Math.ceil(lastPage.count / pageSize) : undefined;
      if (!totalPages) return undefined;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    queryFn: ({ pageParam }) =>
      fetchUsers({
        ...params,
        page: typeof pageParam === "number" ? pageParam : params?.page ?? 1,
        limit: params?.limit ?? 10,
      }),
    ...options,
  });
}

export function useUserProfile(
  options?: UseQueryOptions<UserProfileResponse, ApiError>
) {
  return useQuery({
    queryKey: usersKeys.profile(),
    queryFn: fetchUserProfile,
    ...options,
  });
}

export function useUpdateUserProfile(
  options?: UseMutationOptions<UserProfile, ApiError, UpdateUserProfilePayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: usersKeys.updateProfile(),
    mutationFn: updateUserProfile,
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.profile() });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
}
