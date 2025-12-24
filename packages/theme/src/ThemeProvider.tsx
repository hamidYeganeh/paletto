"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export type ThemeMode = "light" | "dark" | "system";

export function ThemeProvider({
  children,
  defaultMode = "system",
}: {
  children: ReactNode;
  defaultMode?: ThemeMode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultMode}
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}

export function useThemeMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mode = (theme ?? "system") as ThemeMode;
  const resolvedMode = (resolvedTheme ?? "light") as "light" | "dark";

  return {
    mode,
    resolvedMode,
    setMode: (next: ThemeMode) => setTheme(next),
    toggleMode: () => setTheme(resolvedMode === "dark" ? "light" : "dark"),
  };
}
