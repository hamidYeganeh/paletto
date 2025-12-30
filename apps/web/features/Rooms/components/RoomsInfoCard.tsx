"use client";

import type { SceneObject } from "./RoomsScene";

type RoomsInfoCardProps = {
  selected: SceneObject | null;
  onClose: () => void;
};

export const RoomsInfoCard = ({ selected, onClose }: RoomsInfoCardProps) => {
  if (!selected) return null;

  return (
    <div
      className="fixed left-6 top-6 z-20 w-72 rounded-2xl border p-4 text-sm shadow-xl backdrop-blur"
      style={{
        backgroundColor: "var(--secondary-50)",
        borderColor: "var(--primary-200)",
        color: "var(--primary-900)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--primary-500)" }}
          >
            Selected Cube
          </p>
          <p className="text-base font-semibold">{selected.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] transition hover:opacity-80"
          style={{
            borderColor: "var(--primary-200)",
            color: "var(--primary-600)",
            backgroundColor: "transparent",
          }}
        >
          Close
        </button>
      </div>
      <div className="mt-3 space-y-1 text-xs" style={{ color: "var(--primary-700)" }}>
        <p>Size ratio: {selected.size}</p>
        <p>Cube side: {selected.side.toFixed(2)}</p>
        <p>
          Position: {selected.position.x.toFixed(2)},{" "}
          {selected.position.z.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
