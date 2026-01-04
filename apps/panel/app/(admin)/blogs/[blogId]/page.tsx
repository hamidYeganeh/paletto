import { BlogEditor } from "../components/BlogEditor";

type PageParams = { blogId: string };

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<PageParams> | PageParams;
}) {
  const { blogId } = await params;

  return <BlogEditor id={blogId} />;
}
