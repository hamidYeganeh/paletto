import { TaxonomyForm } from "../../components/TaxonomyForm";

export function StyleForm({ mode }: { mode: "create" | "edit" }) {
  return <TaxonomyForm type="styles" mode={mode} />;
}
