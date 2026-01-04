import { TaxonomyForm } from "../../components/TaxonomyForm";

export function TechniqueForm({ mode }: { mode: "create" | "edit" }) {
  return <TaxonomyForm type="techniques" mode={mode} />;
}
