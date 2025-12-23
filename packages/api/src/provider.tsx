"use client";

import { ReactNode, useMemo, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { createApiQueryClient } from "./queryClient";

type ApiProviderProps = {
  children: ReactNode;
};

export function ApiProvider({ children }: ApiProviderProps) {
  const [queryClient] = useState(() => createApiQueryClient());

  const persister = useMemo(() => {
    if (typeof window === "undefined") return null;

    return createSyncStoragePersister({
      storage: window.localStorage,
      key: "paletto/api-cache",
      throttleTime: 2000,
    });
  }, []);

  if (!persister) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: () => true,
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
