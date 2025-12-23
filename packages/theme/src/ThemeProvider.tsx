"use client";

import type { ReactNode } from "react";
import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps,
} from "next-themes";

type Props = Omit<ThemeProviderProps, "children"> & {
  children: ReactNode;
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
  enableColorScheme = true,
  storageKey = "paletto-theme",
  ...rest
}: Props) {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      enableColorScheme={enableColorScheme}
      storageKey={storageKey}
      {...rest}
    >
      {children}
    </NextThemeProvider>
  );
}
