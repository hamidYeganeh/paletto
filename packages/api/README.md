# @repo/api

Shared API client and data layer for Paletto apps. Provides a typed fetch wrapper, TanStack Query setup, and domain-specific API + hooks.

## What It Provides
- A fetch wrapper with typed helpers and an `ApiError`
- Auth token persistence in `localStorage`
- A preconfigured TanStack Query `QueryClient`
- Optional query persistence to `localStorage`
- Domain APIs and hooks for auth, posts, and users

## Exports
From `packages/api/src/index.ts`:
- Provider: `ApiProvider`
- Client: `API_BASE_URL`, `DEFAULT_HEADERS`, `http`
- Session: `getAuthToken`, `setAuthToken`
- Query client: `createApiQueryClient`, `getDehydratedState`
- Query keys: `authKeys`, `postsKeys`, `usersKeys`
- Domain APIs + hooks + types:
  - `auth`: `signIn`, `fetchCurrentUser`, `useSignIn`, `useCurrentUser`
  - `posts`: `fetchPosts`, `fetchPost`, `createPost`, related hooks/types
  - `users`: `fetchUsers`, `fetchUser`, `fetchUserProfile`, `updateUserProfile`, related hooks/types
- `HydrationBoundary` from `@tanstack/react-query`

## Configuration
Environment variable:
- `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:5000`)

The auth token is stored under `paletto/auth-token` in `localStorage`.

## Scripts
- `lint`: `eslint . --max-warnings 0`
- `check-types`: `tsc --noEmit`

## Usage
Provider setup (client component):

```tsx
import { ApiProvider } from "@repo/api";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApiProvider>{children}</ApiProvider>;
}
```

Using hooks:

```tsx
import { useCurrentUser, useSignIn } from "@repo/api";

const { data } = useCurrentUser();
const mutation = useSignIn();
```

Direct API calls:

```ts
import { fetchPosts } from "@repo/api";

const posts = await fetchPosts({ page: 1, limit: 10 });
```

## Notes
- `ApiProvider` persists queries to `localStorage` using the key `paletto/api-cache`.
- `http` automatically adds `Authorization: Bearer <token>` when a token is present.
- Default endpoints are defined in `client/endpoints.ts`:
  - `auth.signIn`: `/auth/sign-in`
  - `auth.me`: `/users/profile/get`
  - `users.list`: `/admin/users/list`
  - `users.detail`: `/users/:id`
  - `users.profile.get`: `/users/profile/get`
  - `users.profile.update`: `/users/profile/update`
  - `posts.list`: `https://jsonplaceholder.typicode.com/posts`
  - `posts.detail`: `https://jsonplaceholder.typicode.com/posts/:id`
