"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@repo/ui/DataTable";
import { Button } from "@repo/ui/Button";
import { cn } from "@repo/utils";
import {
  useTaxonomies,
  type TaxonomyItem,
  type TaxonomyListParams,
  type TaxonomyType,
} from "@repo/api";
import { taxonomyMeta } from "./taxonomyMeta";
import { getApiErrorMessage } from "../../lib/apiErrors";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "deactive", label: "Deactive" },
] as const;

const SORT_FIELDS = [
  { value: "createdAt", label: "Created" },
  { value: "updatedAt", label: "Updated" },
  { value: "title", label: "Title" },
  { value: "slug", label: "Slug" },
] as const;

const SORT_ORDERS = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
] as const;

const LIMIT_OPTIONS = [10, 20, 30, 50];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
};

type ActiveFilters = TaxonomyListParams & {
  page: number;
  limit: number;
  search: string;
  sortBy: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder: "asc" | "desc";
};

type SearchParamsLike = Pick<URLSearchParams, "get">;

type DraftFilters = Omit<ActiveFilters, "status"> & {
  status: "" | "active" | "deactive";
};

const parseFilters = (searchParams: SearchParamsLike): ActiveFilters => {
  const page = Math.max(1, parseNumber(searchParams.get("page"), 1));
  const limit = Math.max(1, parseNumber(searchParams.get("limit"), 10));
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "") as
    | "active"
    | "deactive"
    | "";
  const sortBy = (searchParams.get("sortBy") ?? "createdAt") as
    | "createdAt"
    | "updatedAt"
    | "title"
    | "slug";
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as
    | "asc"
    | "desc";

  return {
    page,
    limit,
    search,
    status: status || undefined,
    sortBy,
    sortOrder,
  };
};

export function TaxonomyList({ type }: { type: TaxonomyType }) {
  const meta = taxonomyMeta[type];
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const activeFilters = useMemo(
    () => parseFilters(searchParams),
    [searchKey]
  );
  const [draft, setDraft] = useState<DraftFilters>({
    ...activeFilters,
    status: activeFilters.status ?? "",
  });
  const { data, isLoading, isFetching, error } = useTaxonomies(
    type,
    activeFilters
  );

  useEffect(() => {
    setDraft({
      ...activeFilters,
      status: activeFilters.status ?? "",
    });
  }, [activeFilters]);

  const items = data?.items ?? [];
  const totalCount = data?.count ?? 0;

  const columns = useMemo<ColumnDef<TaxonomyItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="grid gap-1">
            <span className="text-sm font-semibold text-panel-ink">
              {row.original.title}
            </span>
            {row.original.description ? (
              <span className="text-xs text-panel-muted line-clamp-2">
                {row.original.description}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-panel-muted">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              row.original.status === "active"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            )}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-xs text-panel-muted">
            {formatDate(row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/${type}/${row.original._id}`}
            className="text-xs font-semibold text-panel-accent hover:text-panel-accent-strong"
          >
            Edit
          </Link>
        ),
      },
    ],
    [type]
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / activeFilters.limit));

  const applyFilters = (next: ActiveFilters) => {
    const params = new URLSearchParams();
    params.set("page", String(next.page));
    params.set("limit", String(next.limit));
    if (next.search) params.set("search", next.search);
    if (next.status) params.set("status", next.status);
    if (next.sortBy) params.set("sortBy", next.sortBy);
    if (next.sortOrder) params.set("sortOrder", next.sortOrder);
    const query = params.toString();
    router.push(`/${type}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-panel-muted">
            {meta.plural}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-panel-ink">
            {meta.plural}
          </h2>
          <p className="mt-2 text-sm text-panel-muted">{meta.description}</p>
        </div>
        <Button asChild size="sm" color="primary">
          <Link href={`/${type}/new`}>Create {meta.label}</Link>
        </Button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters({
            ...draft,
            status: draft.status || undefined,
            page: 1,
          });
        }}
        className="grid gap-4 rounded-3xl border border-black/10 bg-white/80 p-5"
      >
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            Search
            <input
              value={draft.search}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, search: event.target.value }))
              }
              placeholder={`Search ${meta.plural.toLowerCase()}`}
              className="h-11 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
            />
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            Status
            <select
              value={draft.status ?? ""}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  status: event.target.value as "active" | "deactive" | "",
                }))
              }
              className="h-11 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            Sort by
            <select
              value={draft.sortBy}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  sortBy: event.target.value as
                    | "createdAt"
                    | "updatedAt"
                    | "title"
                    | "slug",
                }))
              }
              className="h-11 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
            >
              {SORT_FIELDS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            Order
            <select
              value={draft.sortOrder}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  sortOrder: event.target.value as "asc" | "desc",
                }))
              }
              className="h-11 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
            >
              {SORT_ORDERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            Per page
            <select
              value={draft.limit}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  limit: Number(event.target.value),
                }))
              }
              className="h-11 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
            >
              {LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" color="primary">
            Apply filters
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setDraft({
                page: 1,
                limit: 10,
                search: "",
                status: "",
                sortBy: "createdAt",
                sortOrder: "desc",
              });
              router.push(`/${type}`);
            }}
          >
            Reset
          </Button>
          <span className="text-xs text-panel-muted">
            Showing {items.length} of {totalCount} entries
          </span>
        </div>
      </form>

      <div className="rounded-3xl border border-black/10 bg-white/80 p-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {getApiErrorMessage(error, "Unable to load data.")}
          </div>
        ) : null}
        <DataTable
          data={items}
          columns={columns}
          emptyMessage={
            isLoading || isFetching ? "Loading catalog..." : "No results found."
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-black/10 bg-white/80 px-5 py-4 text-xs text-panel-muted">
        <span>
          Page {activeFilters.page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={activeFilters.page <= 1}
            onClick={() =>
              applyFilters({
                ...activeFilters,
                page: Math.max(1, activeFilters.page - 1),
              })
            }
          >
            Previous
          </Button>
          <Button
            size="sm"
            disabled={activeFilters.page >= totalPages}
            onClick={() =>
              applyFilters({
                ...activeFilters,
                page: Math.min(totalPages, activeFilters.page + 1),
              })
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
