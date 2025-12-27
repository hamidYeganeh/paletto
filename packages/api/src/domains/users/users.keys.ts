import { createQueryKeys } from "../../core/queryKeys";
import type { UsersListParams } from "./users.types";

const factory = createQueryKeys("users");

export const usersKeys = {
  root: factory.base,
  list: (params?: UsersListParams) => factory.detail("list", params ?? {}),
  detail: (userId: number | string) => factory.detail("detail", userId),
  profile: () => factory.detail("profile"),
  updateProfile: () => factory.detail("update-profile"),
};
