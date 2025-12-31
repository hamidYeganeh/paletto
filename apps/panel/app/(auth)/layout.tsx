import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-panel">
      <div className="panel-grid min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
