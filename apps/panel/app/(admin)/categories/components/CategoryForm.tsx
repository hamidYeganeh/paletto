import { TaxonomyForm } from "../../components/TaxonomyForm";

export function CategoryForm({ mode }: { mode: "create" | "edit" }) {
  return <TaxonomyForm type="categories" mode={mode} />;
}
