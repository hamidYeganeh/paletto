"use client";

import {
  useCategories,
  useCategory,
  useCreateCategory,
  useCreateStyle,
  useCreateTechnique,
  useStyles,
  useStyle,
  useTechnique,
  useTechniques,
  useUpdateCategory,
  useUpdateStyle,
  useUpdateTechnique,
} from "@repo/api";
import type {
  TaxonomyItem,
  TaxonomyListParams,
  TaxonomyPayload,
  TaxonomyType,
} from "./taxonomyTypes";

type ListResult = {
  data?: { items: TaxonomyItem[]; count: number };
  isLoading: boolean;
  isFetching: boolean;
  error?: unknown;
};

type DetailResult = {
  data?: TaxonomyItem;
  isLoading: boolean;
  error?: unknown;
};

type CreateResult = {
  mutateAsync: (payload: TaxonomyPayload) => Promise<TaxonomyItem>;
  isPending: boolean;
};

type UpdateResult = {
  mutateAsync: (input: { id: string; payload: Partial<TaxonomyPayload> }) => Promise<TaxonomyItem>;
  isPending: boolean;
};

type TaxonomyHookGroup = {
  useList: (params: TaxonomyListParams) => ListResult;
  useItem: (id: string) => DetailResult;
  useCreate: () => CreateResult;
  useUpdate: () => UpdateResult;
};

export const taxonomyHooks: Record<TaxonomyType, TaxonomyHookGroup> = {
  techniques: {
    useList: useTechniques,
    useItem: useTechnique,
    useCreate: useCreateTechnique,
    useUpdate: useUpdateTechnique,
  },
  styles: {
    useList: useStyles,
    useItem: useStyle,
    useCreate: useCreateStyle,
    useUpdate: useUpdateStyle,
  },
  categories: {
    useList: useCategories,
    useItem: useCategory,
    useCreate: useCreateCategory,
    useUpdate: useUpdateCategory,
  },
};
