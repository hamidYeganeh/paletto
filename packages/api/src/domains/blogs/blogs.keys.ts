import { createQueryKeys } from "../../core/queryKeys";
import type { BlogListParams } from "./blogs.types";

const factory = createQueryKeys("blogs");

export const blogKeys = {
  root: factory.base,
  list: (params?: BlogListParams) => factory.detail("list", params ?? {}),
  listRoot: () => factory.detail("list"),
  detail: (id: string) => factory.detail("detail", id),
  create: () => factory.detail("create"),
  update: (id?: string) => factory.detail("update", id ?? "all"),
  updateStatus: (id?: string) => factory.detail("status", id ?? "all"),
};
