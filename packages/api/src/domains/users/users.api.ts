import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type { User, UserResponse, UsersListParams, UsersListResponse } from "./users.types";

export const DEFAULT_USERS_PER_PAGE = 6;

export const normalizeUsersParams = (params?: UsersListParams) => ({
  page: params?.page ?? 1,
  perPage: params?.perPage ?? DEFAULT_USERS_PER_PAGE,
});

export async function fetchUsers(
  params?: UsersListParams
): Promise<UsersListResponse> {
  const normalized = normalizeUsersParams(params);

  return http.get<UsersListResponse>(endpoints.users.list, {
    query: {
      page: normalized.page,
      per_page: normalized.perPage,
    },
  });
}

export async function fetchUser(userId: number | string): Promise<User> {
  const response = await http.get<UserResponse>(endpoints.users.detail(userId));
  return response.data;
}
