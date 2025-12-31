import { TaxonomyEditor } from "../../components/TaxonomyEditor";

export default function StyleDetailPage({
  params,
}: {
  params: { styleId: string };
}) {
  return <TaxonomyEditor type="styles" id={params.styleId} />;
}
