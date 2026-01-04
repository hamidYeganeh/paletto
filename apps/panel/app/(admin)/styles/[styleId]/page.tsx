import { StyleEditor } from "../components/StyleEditor";

type PageParams = { styleId: string };

export default async function StyleDetailPage({
  params,
}: {
  params: Promise<PageParams> | PageParams;
}) {
  const { styleId } = await params;

  return <StyleEditor id={styleId} />;
}
