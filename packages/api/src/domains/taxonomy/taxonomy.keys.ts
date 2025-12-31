import { createQueryKeys } from "../../core/queryKeys";
import type { TaxonomyListParams, TaxonomyType } from "./taxonomy.types";

const factory = createQueryKeys("taxonomies");

export const taxonomyKeys = {
  root: factory.base,
  list: (type: TaxonomyType, params?: TaxonomyListParams) =>
    factory.detail(type, "list", params ?? {}),
  listRoot: (type: TaxonomyType) => factory.detail(type, "list"),
  detail: (type: TaxonomyType, id: string) =>
    factory.detail(type, "detail", id),
  create: (type: TaxonomyType) => factory.detail(type, "create"),
  update: (type: TaxonomyType, id?: string) =>
    factory.detail(type, "update", id ?? "all"),
};
