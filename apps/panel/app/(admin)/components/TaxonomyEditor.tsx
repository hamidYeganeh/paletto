"use client";

import { useTaxonomy, type TaxonomyType } from "@repo/api";
import { getApiErrorMessage } from "../../lib/apiErrors";
import { TaxonomyForm } from "./TaxonomyForm";

export function TaxonomyEditor({
  type,
  id,
}: {
  type: TaxonomyType;
  id: string;
}) {
  const { data, isLoading, error } = useTaxonomy(type, id);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/80 p-6">
        <p className="text-sm text-panel-muted">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {getApiErrorMessage(error, "Unable to load item.")}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Unable to load item.
      </div>
    );
  }

  return <TaxonomyForm type={type} mode="edit" initialData={data} />;
}
