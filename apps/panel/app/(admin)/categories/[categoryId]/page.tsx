import { TaxonomyEditor } from "../../components/TaxonomyEditor";

export default function CategoryDetailPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return <TaxonomyEditor type="categories" id={params.categoryId} />;
}
