# @repo/eslint-config

Shared ESLint configurations for the Paletto monorepo.

## Exports
- `@repo/eslint-config/base`: base config for TypeScript projects
- `@repo/eslint-config/next-js`: Next.js config (App Router + React)
- `@repo/eslint-config/react-internal`: React library config

## What Is Included
- ESLint recommended rules
- TypeScript ESLint recommended rules
- Prettier compatibility (`eslint-config-prettier`)
- Turbo rules (`turbo/no-undeclared-env-vars`)
- React + React Hooks rules (in Next.js and React configs)
- Default ignores for Next.js output directories

## Usage
In `eslint.config.mjs`:

```js
import { config as baseConfig } from "@repo/eslint-config/base";

export default baseConfig;
```

For Next.js apps:

```js
import { nextJsConfig } from "@repo/eslint-config/next-js";

export default nextJsConfig;
```

For React libraries:

```js
import { config as reactConfig } from "@repo/eslint-config/react-internal";

export default reactConfig;
```

## Notes
- `only-warn` is enabled in the base config, so lint violations are warnings by default.
- `dist/**` is ignored by default.
