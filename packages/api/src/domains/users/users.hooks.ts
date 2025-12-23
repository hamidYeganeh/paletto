import {
  type UseInfiniteQueryOptions,
  type UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { ApiError } from "../../client/http";
import { fetchUser, fetchUsers, normalizeUsersParams } from "./users.api";
import { usersKeys } from "./users.keys";
import type { User, UsersListParams, UsersListResponse } from "./users.types";

export function useUsers(
  params?: UsersListParams,
  options?: UseQueryOptions<UsersListResponse, ApiError>
) {
  const normalized = normalizeUsersParams(params);

  return useQuery({
    queryKey: usersKeys.list(normalized),
    queryFn: () => fetchUsers(normalized),
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
  const normalized = normalizeUsersParams(params);

  return useInfiniteQuery({
    queryKey: usersKeys.list(normalized),
    initialPageParam: normalized.page,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    queryFn: ({ pageParam }) =>
      fetchUsers({
        ...normalized,
        page: typeof pageParam === "number" ? pageParam : normalized.page,
      }),
    ...options,
  });
}
