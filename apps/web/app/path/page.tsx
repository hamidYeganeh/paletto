"use client";

import React, { useCallback, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { create } from "zustand";

/* -------------------------------------------
   types
------------------------------------------- */
type StageStatus = "done" | "active" | "locked";

export type StageInput = {
  id: string;
  title: string;
  status: StageStatus;
};

type Stage = StageInput & { x: number; y: number };

type ViewBox = { x: number; y: number; w: number; h: number };
type Transform = { zoom: number; tx: number; ty: number };

type RoadmapState = {
  selectedId: string | null;
  zoom: number;
  tx: number;
  ty: number;
  setTransform: (t: Transform) => void;
  select: (id: string) => void;
  reset: () => void;
  getIsZoomed: () => boolean;
};

/* -------------------------------------------
   utils
------------------------------------------- */
const vibrate = (pattern: number | number[] = [10]) => {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator)
      navigator.vibrate(pattern as any);
  } catch {}
};

/**
 * Vertical "main path" with gentle curves (NOT circle/spiral).
 * We generate points along a vertical line and offset x by a sine wave.
 */
const buildVerticalCurvyPoints = ({
  topY,
  bottomY,
  points = 900,
  amplitude = 85,
  waves = 3.2,
  xCenter = 0,
}: {
  topY: number;
  bottomY: number;
  points?: number;
  amplitude?: number;
  waves?: number;
  xCenter?: number;
}) => {
  const pts = new Array<{ x: number; y: number }>(points);
  const h = bottomY - topY;
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1); // 0..1
    const y = topY + t * h;
    // sine-based horizontal sway
    const x = xCenter + Math.sin(t * Math.PI * 2 * waves) * amplitude;
    pts[i] = { x, y };
  }
  return pts;
};

const pointsToPathD = (pts: Array<{ x: number; y: number }>) => {
  if (!pts.length) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i += 2) {
    const p1 = pts[i];
    const p2 = pts[i + 1] ?? pts[i];
    d += ` Q ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
};

/**
 * Stage positions come from an array (StageInput[]) and we "project"
 * them evenly along the curve points.
 */
const mapStagesToCurve = (
  pts: Array<{ x: number; y: number }>,
  stageInputs: StageInput[]
): Stage[] => {
  const count = stageInputs.length;
  const last = pts.length - 1;
  return stageInputs.map((s, i) => {
    const idx = Math.round((i / Math.max(1, count - 1)) * last);
    const p = pts[idx];
    return { ...s, x: p.x, y: p.y };
  });
};

/**
 * Centering selected stage in viewBox:
 * We apply: translate(tx, ty) scale(zoom)
 * Effective mapping: P' = P*zoom + T
 * Center: stage*zoom + T = vbCenter  =>  T = vbCenter - stage*zoom
 */
const computeTransform = ({
  VB,
  center,
  zoom,
}: {
  VB: ViewBox;
  center: { x: number; y: number };
  zoom: number;
}): Transform => {
  const targetX = VB.x + VB.w / 2;
  const targetY = VB.y + VB.h / 2;
  return { zoom, tx: targetX - center.x * zoom, ty: targetY - center.y * zoom };
};

/* -------------------------------------------
   zustand store
------------------------------------------- */
const useRoadmapStore = create<RoadmapState>((set, get) => ({
  selectedId: null,
  zoom: 1,
  tx: 0,
  ty: 0,
  setTransform: (t) => set({ zoom: t.zoom, tx: t.tx, ty: t.ty }),
  select: (id) => set({ selectedId: id }),
  reset: () => set({ selectedId: null, zoom: 1, tx: 0, ty: 0 }),
  getIsZoomed: () => Math.abs(get().zoom - 1) > 0.001,
}));

/* -------------------------------------------
   UI components
------------------------------------------- */

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <div className="text-lg font-black text-slate-900">{title}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
    </div>
  );
}

function SmartFab({
  label,
  onClick,
  visible,
}: {
  label: string;
  onClick: () => void;
  visible: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onClick}
          initial={
            reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.98 }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
          }
          exit={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 26 }
          }
          className={[
            "absolute bottom-3 right-3",
            "flex items-center gap-2",
            "rounded-full border border-black/10 bg-white",
            "px-3 py-2 shadow-lg shadow-black/10",
            "active:scale-[0.98]",
            "min-h-[44px]",
          ].join(" ")}
          aria-label={label}
        >
          <span aria-hidden="true">↩️</span>
          <span className="text-[13px] font-extrabold text-slate-900">
            {label}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function InfoPanel({ selected }: { selected: Stage | null }) {
  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
      {selected ? (
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-black text-slate-900">{selected.title}</div>
            <div className="mt-0.5 text-xs text-slate-500">
              وضعیت:{" "}
              {selected.status === "done"
                ? "تکمیل‌شده ✅"
                : selected.status === "active"
                  ? "فعال ⭐"
                  : "قفل 🔒"}
            </div>
          </div>
          <button
            onClick={() => vibrate([10])}
            disabled={selected.status === "locked"}
            className={[
              "min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold",
              selected.status === "locked"
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-slate-50 active:scale-[0.99]",
            ].join(" ")}
          >
            شروع مرحله
          </button>
        </div>
      ) : (
        <div className="text-sm text-slate-500">یک استیج را انتخاب کن.</div>
      )}
    </div>
  );
}

function StageNode({
  stage,
  index,
  isSelected,
  onSelect,
}: {
  stage: Stage;
  index: number;
  isSelected: boolean;
  onSelect: (stage: Stage) => void;
}) {
  const reduceMotion = useReducedMotion();
  const fillOpacity =
    stage.status === "done" ? 0.95 : stage.status === "active" ? 0.85 : 0.25;
  const aria = `${stage.title} - ${
    stage.status === "done"
      ? "تکمیل‌شده"
      : stage.status === "active"
        ? "فعال"
        : "قفل"
  }`;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={aria}
      onClick={() => onSelect(stage)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(stage);
        }
      }}
      style={{ cursor: "pointer" }}
    >
      {/* Mobile hit area */}
      <circle cx={stage.x} cy={stage.y} r={28} fill="transparent" />

      <motion.circle
        cx={stage.x}
        cy={stage.y}
        r={isSelected ? 16 : 14}
        fill="currentColor"
        fillOpacity={fillOpacity}
        stroke="black"
        strokeOpacity={0.22}
        strokeWidth={isSelected ? 7 : 5}
        initial={false}
        animate={{ scale: isSelected ? 1.08 : 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 26 }
        }
      />

      <text
        x={stage.x}
        y={stage.y + 5}
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fill="white"
      >
        {index + 1}
      </text>

      {stage.status === "locked" && (
        <text
          x={stage.x + 20}
          y={stage.y - 14}
          textAnchor="middle"
          fontSize="14"
          fill="black"
          opacity={0.5}
        >
          🔒
        </text>
      )}

      {stage.status === "active" && !reduceMotion && (
        <circle
          cx={stage.x}
          cy={stage.y}
          r={26}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={6}
        >
          <animate
            attributeName="r"
            values="20;30;20"
            dur="1.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="0.45;0.08;0.45"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}

function RoadmapCanvas({
  pathD,
  stages,
  VB,
  viewPx,
}: {
  pathD: string;
  stages: Stage[];
  VB: ViewBox;
  viewPx: number;
}) {
  const reduceMotion = useReducedMotion();
  const { selectedId, zoom, tx, ty, setTransform, select, reset } =
    useRoadmapStore();

  const selected = useMemo(
    () => stages.find((s) => s.id === selectedId) ?? null,
    [stages, selectedId]
  );
  const isZoomed = Math.abs(zoom - 1) > 0.001 || !!selectedId;

  const fabLabel = useMemo(() => {
    if (selectedId) return "برگشت به نقشه";
    if (Math.abs(zoom - 1) > 0.001) return "خروج از زوم";
    return "";
  }, [selectedId, zoom]);

  const zoomTransition = useMemo(() => {
    if (reduceMotion) return { duration: 0 };
    return { type: "spring", stiffness: 260, damping: 30, mass: 0.7 };
  }, [reduceMotion]);

  const onSelectStage = useCallback(
    (stage: Stage) => {
      vibrate(stage.status === "locked" ? [18, 20, 18] : [10]);

      select(stage.id);

      const targetZoom = stage.status === "locked" ? 2.0 : 2.35;
      const next = computeTransform({
        VB,
        center: { x: stage.x, y: stage.y },
        zoom: targetZoom,
      });
      setTransform(next);
    },
    [VB, select, setTransform]
  );

  const onReset = useCallback(() => {
    vibrate([12, 30, 12]);
    reset();
  }, [reset]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <svg
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        width="100%"
        height={viewPx}
        className="block select-none"
        style={{ touchAction: "manipulation" }}
        role="img"
        aria-label="نقشه مسیر یادگیری"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="white" />

        <motion.g
          transformTemplate={({ scale, x, y }) =>
            `translate(${x}, ${y}) scale(${scale})`
          }
          animate={{ scale: zoom, x: tx, y: ty }}
          transition={zoomTransition}
        >
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={6}
            opacity={0.75}
            strokeLinecap="round"
          />

          {stages.map((s, i) => (
            <StageNode
              key={s.id}
              stage={s}
              index={i}
              isSelected={s.id === selectedId}
              onSelect={onSelectStage}
            />
          ))}
        </motion.g>
      </svg>

      <SmartFab label={fabLabel} onClick={onReset} visible={isZoomed} />

      <div className="p-3 pt-0">
        <InfoPanel selected={selected} />
      </div>
    </div>
  );
}

/* -------------------------------------------
   page component (export)
------------------------------------------- */
export default function CurvyVerticalRoadmapPage() {
  // Taller viewBox to feel like a vertical Duolingo path
  const VB = useMemo<ViewBox>(
    () => ({ x: -220, y: -520, w: 440, h: 1040 }),
    []
  );
  const viewPx = 520;

  // ✅ stages MUST be mapped from an array:
  const stageInputs = useMemo<StageInput[]>(
    () => [
      { id: "s1", title: "مرحله ۱", status: "done" },
      { id: "s2", title: "مرحله ۲", status: "done" },
      { id: "s3", title: "مرحله ۳", status: "done" },
      { id: "s4", title: "مرحله ۴", status: "active" },
      { id: "s5", title: "مرحله ۵", status: "locked" },
      { id: "s6", title: "مرحله ۶", status: "locked" },
      { id: "s7", title: "مرحله ۷", status: "locked" },
      { id: "s8", title: "مرحله ۸", status: "locked" },
      { id: "s9", title: "مرحله ۹", status: "locked" },
      { id: "s10", title: "مرحله ۱۰", status: "locked" },
      { id: "s11", title: "مرحله ۱۱", status: "locked" },
      { id: "s12", title: "مرحله ۱۲", status: "locked" },
      { id: "s13", title: "مرحله ۱۳", status: "locked" },
      { id: "s14", title: "مرحله ۱۴", status: "locked" },
      { id: "s15", title: "مرحله ۱۵", status: "locked" },
    ],
    []
  );

  const { pathD, stages } = useMemo(() => {
    const pts = buildVerticalCurvyPoints({
      topY: VB.y + 80,
      bottomY: VB.y + VB.h - 80,
      points: 900,
      amplitude: 95, // curve strength
      waves: 2.6, // number of left-right bends
      xCenter: 0,
    });

    return {
      pathD: pointsToPathD(pts),
      stages: mapStagesToCurve(pts, stageInputs),
    };
  }, [VB, stageInputs]);

  return (
    <div className="mx-auto max-w-[440px] p-4">
      <Header
        title="رودمپ دوره (عمودی منحنی)"
        subtitle="Path عمودی با خم‌ها + استیج‌ها از آرایه"
      />
      <RoadmapCanvas pathD={pathD} stages={stages} VB={VB} viewPx={viewPx} />
    </div>
  );
}
