import { createQueryKeys } from "../../core/queryKeys";
import type { StyleListParams } from "./styles.types";

const factory = createQueryKeys("styles");

export const styleKeys = {
  root: factory.base,
  list: (params?: StyleListParams) => factory.detail("list", params ?? {}),
  listRoot: () => factory.detail("list"),
  detail: (id: string) => factory.detail("detail", id),
  create: () => factory.detail("create"),
  update: (id?: string) => factory.detail("update", id ?? "all"),
};
