import { type DefaultOptions, type DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    networkMode: "offlineFirst",
    retry: 1,
  },
};

function mergeDefaultOptions(overrides?: DefaultOptions): DefaultOptions {
  if (!overrides) return defaultOptions;

  return {
    ...defaultOptions,
    ...overrides,
    queries: { ...defaultOptions.queries, ...overrides.queries },
    mutations: { ...defaultOptions.mutations, ...overrides.mutations },
  };
}

export function createApiQueryClient(overrides?: DefaultOptions) {
  return new QueryClient({
    defaultOptions: mergeDefaultOptions(overrides),
  });
}

export function getDehydratedState(client: QueryClient): DehydratedState {
  return dehydrate(client);
}

export { type DehydratedState };
