import type { Messages } from "@repo/i18n";
import type { TaxonomyType } from "./taxonomyTypes";

type NestedMessageKeys<T> = {
  [Key in Extract<keyof T, string>]: T[Key] extends string
    ? Key
    : T[Key] extends Record<string, unknown>
      ? `${Key}.${NestedMessageKeys<T[Key]>}`
      : never;
}[Extract<keyof T, string>];

type PanelMessageKey = NestedMessageKeys<Messages["Panel"]>;

export const taxonomyMeta = {
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
} as const satisfies Record<
  TaxonomyType,
  {
    labelKey: PanelMessageKey;
    pluralKey: PanelMessageKey;
    descriptionKey: PanelMessageKey;
    formHintKey: PanelMessageKey;
  }
>;
