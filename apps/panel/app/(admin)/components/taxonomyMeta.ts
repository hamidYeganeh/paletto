import type { TaxonomyType } from "./taxonomyTypes";

export const taxonomyMeta: Record<
  TaxonomyType,
  {
    labelKey: string;
    pluralKey: string;
    descriptionKey: string;
    formHintKey: string;
  }
> = {
  techniques: {
    labelKey: "taxonomies.techniques.label",
    pluralKey: "taxonomies.techniques.plural",
    descriptionKey: "taxonomies.techniques.description",
    formHintKey: "taxonomies.techniques.formHint",
  },
  styles: {
    labelKey: "taxonomies.styles.label",
    pluralKey: "taxonomies.styles.plural",
    descriptionKey: "taxonomies.styles.description",
    formHintKey: "taxonomies.styles.formHint",
  },
  categories: {
    labelKey: "taxonomies.categories.label",
    pluralKey: "taxonomies.categories.plural",
    descriptionKey: "taxonomies.categories.description",
    formHintKey: "taxonomies.categories.formHint",
  },
};
