import { TaxonomyEditor } from "../../components/TaxonomyEditor";

export default function TechniqueDetailPage({
  params,
}: {
  params: { techniqueId: string };
}) {
  return <TaxonomyEditor type="techniques" id={params.techniqueId} />;
}
