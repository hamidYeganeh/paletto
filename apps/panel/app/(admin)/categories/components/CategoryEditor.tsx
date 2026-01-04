import { TaxonomyEditor } from "../../components/TaxonomyEditor";

export function CategoryEditor({ id }: { id: string }) {
  return <TaxonomyEditor type="categories" id={id} />;
}
