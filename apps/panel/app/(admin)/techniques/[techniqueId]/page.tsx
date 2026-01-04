import { TechniqueEditor } from "../components/TechniqueEditor";

type PageParams = { techniqueId: string };

export default async function TechniqueDetailPage({
  params,
}: {
  params: Promise<PageParams> | PageParams;
}) {
  const { techniqueId } = await params;

  return <TechniqueEditor id={techniqueId} />;
}
