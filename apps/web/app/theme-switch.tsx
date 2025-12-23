"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@repo/ui/Button";

export function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";

  return (
    <Button
      size="sm"
      radius="full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      startIcon={<span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>}
      aria-label="Toggle theme"
    >
      {mounted ? (isDark ? "Dark" : "Light") : "…"}
    </Button>
  );
}
