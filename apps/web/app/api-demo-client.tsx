"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_POST_PAGE_SIZE,
  useCreatePost,
  useInfinitePosts,
  usePosts,
} from "@repo/api";
import { Button } from "@repo/ui/Button";

const cardClass =
  "rounded-2xl border border-black/10 bg-white/90 p-6 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.45)]";

export default function ApiDemoClient() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handler = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
    };
  }, []);

  const listQuery = usePosts({ page: 1, limit: DEFAULT_POST_PAGE_SIZE });
  const infiniteQuery = useInfinitePosts(DEFAULT_POST_PAGE_SIZE);
  const createPost = useCreatePost({ page: 1, limit: DEFAULT_POST_PAGE_SIZE });

  const hydratedPosts = listQuery.data?.items ?? [];
  const infinitePosts = useMemo(
    () => infiniteQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [infiniteQuery.data?.pages]
  );

  const isLoadingMore = infiniteQuery.isFetchingNextPage;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createPost.mutate({
      title: title || "Untitled draft",
      body: body || "This is a quick example payload.",
      userId: 77,
    });
    setTitle("");
    setBody("");
  }

  return (
    <section className="space-y-4 rounded-3xl border border-black/10 bg-white/60 p-8 backdrop-blur">
      <header className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
            API layer
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-black/85">
            React Query with SSR, offline mutations & pagination
          </h2>
          <p className="mt-1 text-sm text-black/60">
            Endpoints, payloads, and hydrated caches shipped from the new @repo/api
            package.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            title="Server prefetched query state"
          >
            SSR ready
          </span>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
              isOnline
                ? "bg-emerald-100 text-emerald-900"
                : "bg-amber-100 text-amber-900"
            }`}
          >
            {isOnline ? "Online" : "Offline queueing"}
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className={`${cardClass} lg:col-span-2`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
                Hydrated list
              </p>
              <h3 className="text-lg font-semibold text-black/80">SSR + client query</h3>
            </div>
            {listQuery.isFetching && (
              <span className="text-xs font-semibold text-black/50">Refreshing…</span>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {listQuery.isLoading && <p className="text-sm text-black/60">Loading posts…</p>}
            {listQuery.isError && (
              <p className="text-sm text-red-600">
                Failed to load posts. Try reloading the page.
              </p>
            )}
            {hydratedPosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-black/10 bg-white/70 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  Post #{post.id}
                </p>
                <p className="text-base font-semibold text-black/85">{post.title}</p>
                <p className="text-sm text-black/60 line-clamp-2">{post.body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
            Offline-first mutation
          </p>
          <h3 className="text-lg font-semibold text-black/80">
            Create a post (queues when offline)
          </h3>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm shadow-inner focus:border-black/50 focus:outline-none"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write a short body"
              rows={4}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm shadow-inner focus:border-black/50 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                isLoading={createPost.isPending}
                disabled={createPost.isPending}
              >
                {createPost.isPending ? "Saving…" : "Save draft"}
              </Button>
              {createPost.isSuccess && (
                <span className="text-xs font-semibold text-emerald-700">
                  Saved and cache updated
                </span>
              )}
            </div>
            <p className="text-xs text-black/60">
              Mutation uses networkMode=offlineFirst and optimistic updates to keep the cache
              fresh while you are offline.
            </p>
          </form>
        </article>
      </div>

      <article className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
              Infinite query
            </p>
            <h3 className="text-lg font-semibold text-black/80">
              Stream posts page by page
            </h3>
          </div>
          <Button
            disabled={!infiniteQuery.hasNextPage || isLoadingMore}
            isLoading={isLoadingMore}
            onClick={() => infiniteQuery.fetchNextPage()}
          >
            {infiniteQuery.hasNextPage ? "Load more" : "No more pages"}
          </Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {infiniteQuery.isLoading && (
            <p className="text-sm text-black/60">Loading the feed…</p>
          )}
          {infiniteQuery.isError && (
            <p className="text-sm text-red-600">Unable to load more posts.</p>
          )}
          {infinitePosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white/70 px-3 py-2"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                #{post.id}
              </p>
              <p className="text-sm font-semibold text-black/80 line-clamp-1">
                {post.title}
              </p>
              <p className="text-xs text-black/60 line-clamp-2">{post.body}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
