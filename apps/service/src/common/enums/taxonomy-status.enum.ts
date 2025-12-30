export const TAXONOMY_STATUSES = ["active", "deactive"] as const;

export type TaxonomyStatus = (typeof TAXONOMY_STATUSES)[number];
