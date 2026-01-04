# AI Playbook

This file lists common tasks and the minimum steps to complete them.

## Add a new API endpoint

1. Add the endpoint to packages/api/src/client/endpoints.ts
2. In packages/api/src/domains/<domain>/, update or add:
   - <domain>.api.ts: API call
   - <domain>.types.ts: request/response types
   - <domain>.keys.ts: query keys if using caching
   - <domain>.hooks.ts: hook helpers
3. If the endpoint is used by an app, wire it into the app layer and keep the UI logic in the app.

## Add a new domain module

1. Create packages/api/src/domains/<new-domain>/
2. Add <new-domain>.api.ts, <new-domain>.hooks.ts, <new-domain>.keys.ts, <new-domain>.types.ts
3. Update packages/api/src/index.ts exports if needed
4. Add endpoints to packages/api/src/client/endpoints.ts

## Add a new package

1. Create packages/<name>/ with package.json and tsconfig
2. Add an entry in pnpm-workspace.yaml if needed
3. Prefer exporting from packages/<name>/src/index.ts

## Update docs

- If you change a workflow, update docs/ai/PLAYBOOK.md
- If you change architecture or dependencies, add an ADR in docs/adr/
