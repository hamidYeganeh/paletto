import { createQueryKeys } from "../../core/queryKeys";
import type { CategoryListParams } from "./categories.types";

const factory = createQueryKeys("categories");

export const categoryKeys = {
  root: factory.base,
  list: (params?: CategoryListParams) => factory.detail("list", params ?? {}),
  listRoot: () => factory.detail("list"),
  detail: (id: string) => factory.detail("detail", id),
  create: () => factory.detail("create"),
  update: (id?: string) => factory.detail("update", id ?? "all"),
};
