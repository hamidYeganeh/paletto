import { createQueryKeys } from "../../core/queryKeys";
import type { PostListParams } from "./posts.api";

const factory = createQueryKeys("posts");

export const postsKeys = {
  root: factory.base,
  list: (params: Required<PostListParams>) => factory.detail("list", params),
  detail: (postId: number | string) => factory.detail("detail", postId),
  infinite: (limit: number) => factory.detail("infinite", { limit }),
  create: () => factory.detail("create"),
};
