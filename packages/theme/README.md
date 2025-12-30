# @repo/theme

Theme tokens and helpers for Paletto. Provides Tailwind v4 theme tokens and a theme provider based on `next-themes`.

## Exports
- `ThemeProvider` and `useThemeMode` from `@repo/theme`
- `theme.css` from `@repo/theme/theme.css`
- `postcss` config from `@repo/theme/postcss`
- `ThemeProvider` from `@repo/theme/provider`

## Usage
Provider setup (client component):

```tsx
import { ThemeProvider } from "@repo/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultMode="system">{children}</ThemeProvider>;
}
```

Include theme tokens:

```css
@import "@repo/theme/theme.css";
```

## Theme Tokens
- Uses Tailwind v4 `@theme` for color and typography tokens
- Adds `dark` variant via `@custom-variant dark`
- Maps `--color-*` tokens to the app-specific palette

## Notes
- `useThemeMode` exposes `mode`, `resolvedMode`, `setMode`, and `toggleMode`.
- Theme mode defaults to `system` but can be overridden with `defaultMode`.
