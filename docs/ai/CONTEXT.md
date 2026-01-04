# AI Context

This file is a concise orientation for AI tools and new contributors.

## Project map

- apps/panel: app entry point
- apps/service: service app; see apps/service/USER_STORIES.md
- apps/web: web app
- packages/api: API client, domain types, and hooks
- packages/ui: shared UI components
- packages/hooks: shared hooks
- packages/utils: shared utilities
- packages/i18n: localization
- packages/theme: theming

## Domain modules (packages/api/src/domains)

- auth
- blogs
- categories
- posts
- styles
- taxonomy
- techniques
- users

## Key files

- packages/api/src/client/endpoints.ts
- packages/api/src/domains/<domain>/*.api.ts
- packages/api/src/domains/<domain>/*.hooks.ts
- packages/api/src/domains/<domain>/*.keys.ts
- packages/api/src/domains/<domain>/*.types.ts

## Conventions

- Keep domain logic together under its folder.
- Prefer adding fields instead of renaming/removing to avoid breaking changes.
- Update documentation when a new workflow is introduced.
