import { createQueryKeys } from "../../core/queryKeys";
import type { TechniqueListParams } from "./techniques.types";

const factory = createQueryKeys("techniques");

export const techniqueKeys = {
  root: factory.base,
  list: (params?: TechniqueListParams) => factory.detail("list", params ?? {}),
  listRoot: () => factory.detail("list"),
  detail: (id: string) => factory.detail("detail", id),
  create: () => factory.detail("create"),
  update: (id?: string) => factory.detail("update", id ?? "all"),
};
