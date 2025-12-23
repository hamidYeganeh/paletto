import {
  DEFAULT_POST_PAGE_SIZE,
  HydrationBoundary,
  createApiQueryClient,
  getDehydratedState,
  prefetchPostsList,
} from "@repo/api";
import ApiDemoClient from "./api-demo-client";

export default async function ApiDemo() {
  const queryClient = createApiQueryClient();
  await prefetchPostsList(queryClient, {
    page: 1,
    limit: DEFAULT_POST_PAGE_SIZE,
  });

  const dehydratedState = getDehydratedState(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ApiDemoClient />
    </HydrationBoundary>
  );
}
