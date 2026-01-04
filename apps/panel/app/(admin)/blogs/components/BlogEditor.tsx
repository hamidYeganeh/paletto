"use client";

import { useBlog } from "@repo/api";
import { useTranslations } from "@repo/i18n/client";
import { getApiErrorMessage } from "../../../lib/apiErrors";
import { BlogForm } from "./BlogForm";

export function BlogEditor({ id }: { id: string }) {
  const { data, isLoading, error } = useBlog(id);
  const t = useTranslations("Panel");

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
        <p className="text-sm text-panel-muted">
          {t("messages.loadingDetails")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {getApiErrorMessage(error, t("errors.loadItem"))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {t("errors.loadItem")}
      </div>
    );
  }

  return <BlogForm mode="edit" initialData={data} />;
}
