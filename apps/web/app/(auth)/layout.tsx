"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren, useEffect, useState } from "react";

const Silk = dynamic(
  () => import("../../components/shared/SilkBackground/SilkBackground"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function AuthRootLayout(props: PropsWithChildren) {
  const { children } = props;
  const [showSilk, setShowSilk] = useState(false);

  useEffect(() => {
    // Delay mounting the heavy canvas background until after hydrate
    const scheduleIdle =
      typeof window !== "undefined" &&
      (window as any).requestIdleCallback &&
      typeof (window as any).requestIdleCallback === "function";

    if (scheduleIdle) {
      const id = (window as any).requestIdleCallback(() => setShowSilk(true));
      return () => (window as any).cancelIdleCallback?.(id);
    }

    const timeoutId = setTimeout(() => setShowSilk(true), 200);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="bg-primary-500 relative">
      {showSilk && (
        <div className="absolute inset-0 m-auto z-0">
          <Silk
            color="#3b6c57"
            speed={12}
            scale={1}
            noiseIntensity={0.5}
            fps={24}
          />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
