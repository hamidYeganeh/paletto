import { BlogEditor } from "../components/BlogEditor";

export default function BlogDetailPage({
  params,
}: {
  params: { blogId: string };
}) {
  return <BlogEditor id={params.blogId} />;
}
