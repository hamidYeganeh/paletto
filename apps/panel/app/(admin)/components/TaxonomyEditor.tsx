"use client";

import { useTranslations } from "@repo/i18n/client";
import { getApiErrorMessage } from "../../lib/apiErrors";
import { TaxonomyForm } from "./TaxonomyForm";
import { taxonomyHooks } from "./taxonomyHooks";
import type { TaxonomyType } from "./taxonomyTypes";

export function TaxonomyEditor({
  type,
  id,
}: {
  type: TaxonomyType;
  id: string;
}) {
  const hooks = taxonomyHooks[type];
  const { data, isLoading, error } = hooks.useItem(id);
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

  return <TaxonomyForm type={type} mode="edit" initialData={data} />;
}
