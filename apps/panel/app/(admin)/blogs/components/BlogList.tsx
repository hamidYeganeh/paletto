"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@repo/ui/DataTable";
import { Button } from "@repo/ui/Button";
import { cn } from "@repo/utils";
import {
  useBlogs,
  type BlogItem,
  type BlogListParams,
  type BlogStatus,
} from "@repo/api";
import { useLocale, useTranslations } from "@repo/i18n/client";
import { getApiErrorMessage } from "../../../lib/apiErrors";

const LIMIT_OPTIONS = [10, 20, 30, 50];

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
};

type ActiveFilters = BlogListParams & {
  page: number;
  limit: number;
  search: string;
  sortBy: "createdAt" | "updatedAt" | "title" | "slug";
  sortOrder: "asc" | "desc";
};

type SearchParamsLike = Pick<URLSearchParams, "get">;

type DraftFilters = Omit<ActiveFilters, "status"> & {
  status: "" | BlogStatus;
};

const parseFilters = (searchParams: SearchParamsLike): ActiveFilters => {
  const page = Math.max(1, parseNumber(searchParams.get("page"), 1));
  const limit = Math.max(1, parseNumber(searchParams.get("limit"), 10));
  const search = searchParams.get("search") ?? "";
  const status = (searchParams.get("status") ?? "") as BlogStatus | "";
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

export function BlogList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const t = useTranslations("Panel");
  const locale = useLocale();
  const activeFilters = useMemo(
    () => parseFilters(searchParams),
    [searchKey]
  );
  const [draft, setDraft] = useState<DraftFilters>({
    ...activeFilters,
    status: activeFilters.status ?? "",
  });
  const { data, isLoading, isFetching, error } = useBlogs(activeFilters);

  useEffect(() => {
    setDraft({
      ...activeFilters,
      status: activeFilters.status ?? "",
    });
  }, [activeFilters]);

  const items = data?.items ?? [];
  const totalCount = data?.count ?? 0;
  const label = t("blogs.label");
  const plural = t("blogs.plural");
  const description = t("blogs.description");
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [locale]
  );
  const formatDate = (value: string) => formatter.format(new Date(value));

  const statusLabel = (status: BlogStatus) => {
    switch (status) {
      case "active":
        return t("status.active");
      case "draft":
        return t("status.draft");
      case "deactive":
        return t("status.deactive");
      default:
        return status;
    }
  };

  const statusBadgeClass = (status: BlogStatus) =>
    cn(
      "rounded-full px-3 py-1 text-xs font-semibold",
      status === "active" && "bg-emerald-100 text-emerald-700",
      status === "draft" && "bg-amber-100 text-amber-700",
      status === "deactive" && "bg-rose-100 text-rose-700"
    );

  const columns = useMemo<ColumnDef<BlogItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: t("table.columns.title"),
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
        header: t("table.columns.slug"),
        cell: ({ row }) => (
          <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-panel-muted">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: t("table.columns.status"),
        cell: ({ row }) => (
          <span className={statusBadgeClass(row.original.status)}>
            {statusLabel(row.original.status)}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: t("table.columns.updated"),
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
            href={`/blogs/${row.original._id}`}
            className="text-xs font-semibold text-panel-accent hover:text-panel-accent-strong"
          >
            {t("actions.edit")}
          </Link>
        ),
      },
    ],
    [formatDate, statusBadgeClass, statusLabel, t]
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
    router.push(`/blogs${query ? `?${query}` : ""}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-panel-muted">
            {plural}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-panel-ink">{plural}</h2>
          <p className="mt-2 text-sm text-panel-muted">{description}</p>
        </div>
        <Button asChild size="sm" color="primary">
          <Link href="/blogs/new">
            {t("actions.createLabel", { label })}
          </Link>
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
            {t("filters.search")}
            <input
              value={draft.search}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, search: event.target.value }))
              }
              placeholder={t("filters.searchPlaceholder", {
                resource: plural,
              })}
              className="h-11 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
            />
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            {t("filters.status")}
            <select
              value={draft.status ?? ""}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  status: event.target.value as BlogStatus | "",
                }))
              }
              className="h-11 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
            >
              <option value="">{t("status.all")}</option>
              <option value="active">{t("status.active")}</option>
              <option value="draft">{t("status.draft")}</option>
              <option value="deactive">{t("status.deactive")}</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            {t("filters.sortBy")}
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
              <option value="createdAt">{t("sort.created")}</option>
              <option value="updatedAt">{t("sort.updated")}</option>
              <option value="title">{t("sort.title")}</option>
              <option value="slug">{t("sort.slug")}</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            {t("filters.order")}
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
              <option value="desc">{t("sort.newest")}</option>
              <option value="asc">{t("sort.oldest")}</option>
            </select>
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
            {t("filters.perPage")}
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
            {t("filters.apply")}
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
              router.push("/blogs");
            }}
          >
            {t("filters.reset")}
          </Button>
          <span className="text-xs text-panel-muted">
            {t("filters.showing", {
              shown: items.length,
              total: totalCount,
            })}
          </span>
        </div>
      </form>

      <div className="rounded-3xl border border-black/10 bg-white/80 p-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {getApiErrorMessage(error, t("errors.loadData"))}
          </div>
        ) : null}
        <DataTable
          data={items}
          columns={columns}
          emptyMessage={
            isLoading || isFetching
              ? t("messages.loadingCatalog")
              : t("table.empty")
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-black/10 bg-white/80 px-5 py-4 text-xs text-panel-muted">
        <span>
          {t("pagination.pageOf", {
            page: activeFilters.page,
            total: totalPages,
          })}
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
            {t("pagination.previous")}
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
            {t("pagination.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
