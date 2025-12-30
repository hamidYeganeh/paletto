# @repo/typescript-config

Shared TypeScript configuration presets for the Paletto monorepo.

## Presets
- `base.json`: common strict defaults for all projects
- `nextjs.json`: Next.js App Router friendly config
- `react-library.json`: React library config

## Usage
In a project `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

For Next.js apps:

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

For React libraries:

```json
{
  "extends": "@repo/typescript-config/react-library.json"
}
```

## Notes
- `base.json` enables `strict`, `noUncheckedIndexedAccess`, and `resolveJsonModule`.
- `nextjs.json` sets `moduleResolution` to `Bundler` and enables the Next.js TS plugin.
