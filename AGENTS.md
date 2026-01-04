# AGENTS

This file is the entry point for AI tools working in this repo.

## Repo map

- apps/panel: application entry point (admin or internal UI)
- apps/service: service app (see apps/service/USER_STORIES.md)
- apps/web: public-facing web app
- packages/api: API client, domain types, and hooks
- packages/hooks: shared hooks
- packages/i18n: localization utilities
- packages/theme: shared theming
- packages/ui: shared UI components
- packages/utils: shared utilities
- packages/eslint-config: linting presets
- packages/typescript-config: shared TS configs

## Commands

- pnpm dev: run all apps/packages in dev mode
- pnpm build: build all apps/packages
- pnpm lint: lint all packages
- pnpm check-types: typecheck all packages
- pnpm format: format code

## Architecture rules

- Apps can depend on packages. Packages should avoid depending on apps.
- Keep packages small and focused on a single concern.
- If you add a new API surface, update both:
  - packages/api/src/client/endpoints.ts
  - packages/api/src/domains/<domain>/ (api, hooks, keys, types)
- Preserve domain folder structure: <domain>.api.ts, <domain>.hooks.ts, <domain>.keys.ts, <domain>.types.ts

## Change hygiene

- Prefer small, scoped diffs.
- If a change affects how to work in the repo, update docs/ai/PLAYBOOK.md.
- Use rg for search.
- Keep documentation in sync with actual scripts and folder structure.
