# @repo/utils

Shared utility helpers for the Paletto monorepo.

## Exports
- `cn`: className merger using `clsx` + `tailwind-merge`
- `cva`: re-export of `class-variance-authority`
- `VariantProps`: type helper from `class-variance-authority`

## Usage

```ts
import { cn } from "@repo/utils";

const className = cn("px-4", condition && "text-primary");
```

```ts
import { cva, type VariantProps } from "@repo/utils";

const button = cva("px-4 py-2", { variants: { intent: { primary: "bg-blue" } } });
```
