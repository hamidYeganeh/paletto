"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@repo/ui/Button";
import { cn } from "@repo/utils";
import { getAuthToken, setAuthToken } from "@repo/api";

const navItems = [
  {
    label: "Techniques",
    href: "/techniques",
    helper: "Brushwork, tools, methods",
  },
  {
    label: "Styles",
    href: "/styles",
    helper: "Aesthetics & movements",
  },
  {
    label: "Categories",
    href: "/categories",
    helper: "Catalog taxonomy",
  },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-panel">
        <div className="panel-grid min-h-screen">
          <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6">
            <div className="glass-surface w-full rounded-3xl border border-black/10 px-8 py-12 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-panel-muted">
                Paletto Admin
              </p>
              <h1 className="mt-4 font-serif text-3xl text-panel-ink">
                Preparing your studio
              </h1>
              <p className="mt-3 text-sm text-panel-muted">
                Authenticating and loading workspace data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-panel">
      <div className="panel-grid min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <aside className="glass-surface w-full rounded-3xl border border-black/10 px-6 py-8 lg:w-72">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-panel-muted">
                    Paletto
                  </p>
                  <h2 className="font-serif text-2xl text-panel-ink">
                    Admin Studio
                  </h2>
                </div>
                <span className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-panel-muted">
                  v1
                </span>
              </div>
              <nav className="mt-8 flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group rounded-2xl border border-transparent px-4 py-3 transition",
                        isActive
                          ? "border-panel-accent/40 bg-white text-panel-ink shadow-sm"
                          : "hover:border-black/10 hover:bg-white/60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-panel-muted">
                          {isActive ? "Active" : "Open"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-panel-muted">
                        {item.helper}
                      </p>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-4 text-xs text-panel-muted">
                Keep taxonomy consistent for artists and curators. Updates are
                live in the app catalog.
              </div>
            </aside>

            <main className="flex-1">
              <div className="glass-surface h-full rounded-3xl border border-black/10 px-6 py-8 md:px-10">
                <header className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-panel-muted">
                      Dashboard
                    </p>
                    <h1 className="font-serif text-3xl text-panel-ink">
                      Catalog Studio
                    </h1>
                    <p className="mt-1 text-sm text-panel-muted">
                      Curate techniques, styles, and categories in one place.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs text-panel-muted">
                      Signed in as Admin
                    </div>
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => {
                        setAuthToken(null);
                        router.replace("/login");
                      }}
                    >
                      Log out
                    </Button>
                  </div>
                </header>
                <div className="pt-6 animate-fade-up">{children}</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
