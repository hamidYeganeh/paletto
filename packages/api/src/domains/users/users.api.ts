import { endpoints } from "../../client/endpoints";
import { http } from "../../client/http";
import type {
  UpdateUserProfilePayload,
  User,
  UserProfile,
  UserProfileResponse,
  UsersListParams,
  UsersListResponse,
} from "./users.types";

export async function fetchUsers(
  params?: UsersListParams
): Promise<UsersListResponse> {
  return http.get<UsersListResponse>(endpoints.users.list, {
    query: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      search: params?.search,
    },
  });
}

export async function fetchUser(userId: number | string): Promise<User> {
  return http.get<User>(endpoints.users.detail(userId));
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  return http.get<UserProfileResponse>(endpoints.users.profile.get);
}

export async function updateUserProfile(
  payload: UpdateUserProfilePayload
): Promise<UserProfile> {
  return http.patch<UserProfile, UpdateUserProfilePayload>(
    endpoints.users.profile.update,
    payload
  );
}
