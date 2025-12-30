# Paletto Web

Next.js App Router frontend for Paletto. Uses shared packages for API access, i18n, theme, and UI components.

## Tech Stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4
- next-intl for localization
- TanStack Query via `@repo/api`
- next-themes via `@repo/theme`
- Zustand, React Hook Form, framer-motion
- @react-three/fiber + three

## Key Features
- Route groups for auth and user flows under `app/(auth)` and `app/(user)`
- Locale resolution from cookies and `accept-language`
- RTL layout (`dir="rtl"`) with YekanBakh font
- Global providers for i18n, API, and theme (`app/providers.tsx`)

## Scripts
- `dev`: `next dev --port 3000`
- `build`: `next build`
- `start`: `next start`
- `lint`: `eslint --max-warnings 0`
- `check-types`: `next typegen && tsc --noEmit`

## Configuration
Environment variables used by shared API client:
- `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:5000`)

Example `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Local Development
From repo root:

```sh
pnpm --filter web dev
```

Or via Turbo:

```sh
pnpm turbo run dev --filter web
```

## Structure
- `app/`: Next.js routes, layouts, and global styles
- `app/(auth)`: auth-related routes
- `app/(user)`: user-related routes
- `app/providers.tsx`: NextIntl + API + Theme providers
- `app/fonts`: local font setup (YekanBakh)
- `components/shared`: shared UI composition
- `features/Auth`, `features/User`: feature-level UI and logic
- `public`: static assets

## Integration Points
- `@repo/api`: API client + React Query providers/hooks
- `@repo/i18n`: locale resolution + messages
- `@repo/theme`: theme tokens and provider
- `@repo/ui`: shared UI components
- `@repo/utils`: utility helpers
