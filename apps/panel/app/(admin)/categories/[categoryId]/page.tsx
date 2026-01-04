import { CategoryEditor } from "../components/CategoryEditor";

export default function CategoryDetailPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return <CategoryEditor id={params.categoryId} />;
}
