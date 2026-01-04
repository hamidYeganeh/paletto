import { TaxonomyEditor } from "../../components/TaxonomyEditor";

export function TechniqueEditor({ id }: { id: string }) {
  return <TaxonomyEditor type="techniques" id={id} />;
}
