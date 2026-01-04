import { TechniqueEditor } from "../components/TechniqueEditor";

export default function TechniqueDetailPage({
  params,
}: {
  params: { techniqueId: string };
}) {
  return <TechniqueEditor id={params.techniqueId} />;
}
