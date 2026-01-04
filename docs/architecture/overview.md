# Architecture Overview

This repository is a Turborepo monorepo for the Paletto products and shared packages.

## Structure

- apps
  - panel
  - service
  - web
- packages
  - api
  - hooks
  - i18n
  - theme
  - ui
  - utils
  - eslint-config
  - typescript-config

## Principles

- Apps should depend on packages, not the other way around.
- Shared logic belongs in packages, not duplicated across apps.
- Domain APIs are modeled under packages/api/src/domains/<domain>.
- Keep public interfaces stable; prefer additive changes.

## Key Links

- docs/architecture/boundaries.md
- docs/architecture/c4-context.mmd
- docs/adr/README.md
