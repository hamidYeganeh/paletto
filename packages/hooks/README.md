# @repo/hooks

Shared React hooks for Paletto UI packages.

## Exports
- `useRipple`: helper for ripple effects on click/tap interactions

## Usage

```tsx
import { useRipple } from "@repo/hooks";

function ActionButton() {
  const { createRipple } = useRipple();

  return (
    <button onClick={createRipple} className="relative overflow-hidden">
      Click me
    </button>
  );
}
```

## Notes
- `useRipple` is DOM-dependent; use in client components only.
- The ripple color uses the `--color` CSS variable on the target element or falls back to `currentColor`.
