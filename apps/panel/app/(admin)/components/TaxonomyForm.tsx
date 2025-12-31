"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/Button";
import {
  useCreateTaxonomy,
  useUpdateTaxonomy,
  type TaxonomyItem,
  type TaxonomyPayload,
  type TaxonomyType,
} from "@repo/api";
import { taxonomyMeta } from "./taxonomyMeta";
import { getApiErrorMessage } from "../../lib/apiErrors";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "deactive", label: "Deactive" },
] as const;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function TaxonomyForm({
  type,
  mode,
  initialData,
}: {
  type: TaxonomyType;
  mode: "create" | "edit";
  initialData?: TaxonomyItem | null;
}) {
  const router = useRouter();
  const meta = taxonomyMeta[type];
  const defaultValues = useMemo<TaxonomyPayload>(
    () => ({
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      slug: initialData?.slug ?? "",
      status: initialData?.status ?? "active",
    }),
    [initialData]
  );

  const [formState, setFormState] = useState(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const createMutation = useCreateTaxonomy(type);
  const updateMutation = useUpdateTaxonomy(type);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    setFormState(defaultValues);
  }, [defaultValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(formState);
        setSuccess(`${meta.label} created successfully.`);
        router.push(`/${type}`);
        return;
      }

      if (!initialData) {
        setError("Unable to update without initial data.");
        return;
      }

      await updateMutation.mutateAsync({
        id: initialData._id,
        payload: formState,
      });
      setSuccess(`${meta.label} updated successfully.`);
      router.push(`/${type}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save. Please try again."));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-3xl border border-black/10 bg-white/80 p-6"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-panel-muted">
          {meta.label}
        </p>
        <h2 className="mt-2 font-serif text-2xl text-panel-ink">
          {mode === "create" ? `Create ${meta.label}` : `Edit ${meta.label}`}
        </h2>
        <p className="mt-2 text-sm text-panel-muted">{meta.formHint}</p>
      </div>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        Title
        <input
          required
          value={formState.title}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, title: event.target.value }))
          }
          placeholder={`Enter ${meta.label.toLowerCase()} title`}
          className="h-12 rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        Description
        <textarea
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          placeholder="Optional description"
          rows={4}
          className="rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        Slug
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            required
            value={formState.slug}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, slug: event.target.value }))
            }
            placeholder="e.g. abstract-expressionism"
            className="h-12 w-full rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
          />
          <Button
            type="button"
            size="sm"
            onClick={() =>
              setFormState((prev) => ({
                ...prev,
                slug: toSlug(prev.title || prev.slug),
              }))
            }
          >
            Generate
          </Button>
        </div>
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        Status
        <select
          value={formState.status}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              status: event.target.value as TaxonomyPayload["status"],
            }))
          }
          className="h-12 rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" color="primary" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : mode === "create"
            ? `Create ${meta.label}`
            : `Save ${meta.label}`}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => router.push(`/${type}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
