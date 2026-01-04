import { CategoryEditor } from "../components/CategoryEditor";

type PageParams = { categoryId: string };

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<PageParams> | PageParams;
}) {
  const { categoryId } = await params;

  return <CategoryEditor id={categoryId} />;
}
