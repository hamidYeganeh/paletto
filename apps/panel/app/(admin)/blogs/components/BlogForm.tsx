"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/Button";
import {
  useCreateBlog,
  useUpdateBlog,
  type BlogItem,
  type BlogPayload,
} from "@repo/api";
import { useTranslations } from "@repo/i18n/client";
import { getApiErrorMessage } from "../../../lib/apiErrors";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function BlogForm({
  mode,
  initialData,
}: {
  mode: "create" | "edit";
  initialData?: BlogItem | null;
}) {
  const router = useRouter();
  const t = useTranslations("Panel");
  const label = t("blogs.label");
  const formHint = t("blogs.formHint");
  const defaultValues = useMemo<BlogPayload>(
    () => ({
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      content: initialData?.content ?? "",
      slug: initialData?.slug ?? "",
      status: initialData?.status ?? "draft",
      cover: initialData?.cover ?? "",
    }),
    [initialData]
  );

  const [formState, setFormState] = useState(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
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
        setSuccess(t("messages.createdSuccess", { label }));
        router.push("/blogs");
        return;
      }

      if (!initialData) {
        setError(t("errors.missingInitial"));
        return;
      }

      await updateMutation.mutateAsync({
        id: initialData._id,
        payload: formState,
      });
      setSuccess(t("messages.updatedSuccess", { label }));
      router.push("/blogs");
    } catch (err) {
      setError(getApiErrorMessage(err, t("errors.save")));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-3xl border border-black/10 bg-white/80 p-6"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-panel-muted">
          {label}
        </p>
        <h2 className="mt-2 font-serif text-2xl text-panel-ink">
          {mode === "create"
            ? t("actions.createLabel", { label })
            : t("actions.editLabel", { label })}
        </h2>
        <p className="mt-2 text-sm text-panel-muted">{formHint}</p>
      </div>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        {t("form.title")}
        <input
          required
          value={formState.title}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, title: event.target.value }))
          }
          placeholder={t("form.placeholders.title", { resource: label })}
          className="h-12 rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        {t("form.description")}
        <textarea
          required
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          placeholder={t("form.placeholders.description")}
          rows={3}
          className="rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        {t("form.content")}
        <textarea
          required
          value={formState.content}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              content: event.target.value,
            }))
          }
          rows={8}
          className="rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        {t("form.slug")}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            required
            value={formState.slug}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, slug: event.target.value }))
            }
            placeholder={t("form.placeholders.slug")}
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
            {t("actions.generate")}
          </Button>
        </div>
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        {t("form.cover")}
        <input
          required
          value={formState.cover}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, cover: event.target.value }))
          }
          placeholder={t("form.placeholders.cover")}
          className="h-12 rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-panel-muted">
        {t("form.status")}
        <select
          value={formState.status}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              status: event.target.value as BlogPayload["status"],
            }))
          }
          className="h-12 rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-panel-ink focus:border-panel-accent focus:outline-none"
        >
          <option value="draft">{t("status.draft")}</option>
          <option value="active">{t("status.active")}</option>
          <option value="deactive">{t("status.deactive")}</option>
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
            ? t("messages.saving")
            : mode === "create"
            ? t("actions.createLabel", { label })
            : t("actions.saveLabel", { label })}
        </Button>
        <Button type="button" size="sm" onClick={() => router.push("/blogs")}>
          {t("actions.cancel")}
        </Button>
      </div>
    </form>
  );
}
