import type { TaxonomyType } from "@repo/api";

export const taxonomyMeta: Record<
  TaxonomyType,
  {
    label: string;
    plural: string;
    description: string;
    formHint: string;
  }
> = {
  techniques: {
    label: "Technique",
    plural: "Techniques",
    description:
      "Maintain the toolset and methods artists can tag on their artworks.",
    formHint:
      "Use clear titles and action-driven slugs so artists can find them quickly.",
  },
  styles: {
    label: "Style",
    plural: "Styles",
    description:
      "Define the aesthetic movements and stylistic groupings for the catalog.",
    formHint:
      "Keep style titles concise and link to a distinct aesthetic signature.",
  },
  categories: {
    label: "Category",
    plural: "Categories",
    description:
      "Organize artwork themes and subject matter across the catalog.",
    formHint:
      "Categories should read like clear browsing filters for collectors.",
  },
};
