import { TaxonomyEditor } from "../../components/TaxonomyEditor";

export function StyleEditor({ id }: { id: string }) {
  return <TaxonomyEditor type="styles" id={id} />;
}
