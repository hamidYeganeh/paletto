import { StyleEditor } from "../components/StyleEditor";

export default function StyleDetailPage({
  params,
}: {
  params: { styleId: string };
}) {
  return <StyleEditor id={params.styleId} />;
}
