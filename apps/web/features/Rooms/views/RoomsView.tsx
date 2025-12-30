"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { RoomsInfoCard } from "../components/RoomsInfoCard";
import { RoomsScene, type SceneObject } from "../components/RoomsScene";

const itemsPerPage = 10;
const totalItems = 30;
const sizeOptions = [
  { label: "1*2", width: 1, height: 2 },
  { label: "2*3", width: 2, height: 3 },
  { label: "2*2", width: 2, height: 2 },
];
const colorPalette = ["#295142", "#437c64", "#6c9b87", "#9b8750", "#b29b5b"];

const darkenColor = (color: string) =>
  `#${new THREE.Color(color)
    .lerp(new THREE.Color("#0f1f18"), 0.35)
    .getHexString()}`;

const createRng = (seed: number) => {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let t = Math.imul(value ^ (value >>> 15), value | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const placeRandomly = (
  objects: Array<Omit<SceneObject, "position">>,
  spreadX: number,
  spreadZ: number,
  seed: number,
) => {
  const rng = createRng(seed);
  const placed: Array<{ x: number; z: number; side: number }> = [];

  return objects.map((object) => {
    let position: { x: number; z: number } | null = null;
    const minGap = 0.6;

    for (let attempt = 0; attempt < 120; attempt += 1) {
      const x = (rng() - 0.5) * spreadX;
      const z = (rng() - 0.5) * spreadZ;
      let valid = true;

      for (const other of placed) {
        const dx = x - other.x;
        const dz = z - other.z;
        const minDistance = (object.side + other.side) / 2 + minGap;
        if (dx * dx + dz * dz < minDistance * minDistance) {
          valid = false;
          break;
        }
      }

      if (valid) {
        position = { x, z };
        break;
      }
    }

    if (!position) {
      position = {
        x: (rng() - 0.5) * spreadX,
        z: (rng() - 0.5) * spreadZ,
      };
    }

    placed.push({ x: position.x, z: position.z, side: object.side });

    return {
      ...object,
      position: {
        x: position.x,
        z: position.z,
        yOffset: 0.15,
      },
    };
  });
};

export const RoomsView = () => {
  const [selected, setSelected] = useState<SceneObject | null>(null);
  const [page, setPage] = useState(1);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  const allObjects = useMemo(
    () =>
      Array.from({ length: totalItems }, (_, index) => {
        const option = sizeOptions[index % sizeOptions.length] ?? sizeOptions[0];
        const frontColor =
          colorPalette[index % colorPalette.length] ?? "#295142";
        const side = Math.sqrt(option.width * option.height);

        return {
          name: `Cube ${index + 1}`,
          size: option.label,
          side,
          frontColor,
          sideColor: darkenColor(frontColor),
        };
      }),
    [],
  );

  const totalPages = Math.max(1, Math.ceil(allObjects.length / itemsPerPage));

  const pageObjects = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const slice = allObjects.slice(start, start + itemsPerPage);
    const aspect =
      viewport.height > 0 ? viewport.width / viewport.height : 1.5;
    const spreadX = 10 * Math.max(1, aspect);
    const spreadZ = 10;

    return placeRandomly(slice, spreadX, spreadZ, page * 1337);
  }, [allObjects, page, viewport]);

  useEffect(() => {
    setSelected(null);
  }, [page]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const handlePrev = () => setPage((current) => Math.max(1, current - 1));
  const handleNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  return (
    <main
      className="relative h-dvh w-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px at 15% 10%, var(--secondary-50), var(--primary-50) 55%, #ffffff 100%)",
        color: "var(--primary-900)",
      }}
    >
      <div
        className="pointer-events-none fixed inset-6 rounded-[32px] border"
        style={{ borderColor: "var(--primary-100)" }}
      />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(41,81,66,0.05), rgba(178,155,91,0.08))",
        }}
      />

      <RoomsScene objects={pageObjects} selected={selected} onSelect={setSelected} />
      <RoomsInfoCard selected={selected} onClose={() => setSelected(null)} />

      <div
        className="pointer-events-none fixed right-6 bottom-6 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
        style={{
          borderColor: "var(--primary-200)",
          color: "var(--primary-600)",
          backgroundColor: "rgba(255,255,255,0.7)",
        }}
      >
        Paletto Rooms
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page <= 1 || Boolean(selected)}
          className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition disabled:opacity-40"
          style={{
            borderColor: "var(--primary-200)",
            color: "var(--primary-700)",
            backgroundColor: "rgba(255,255,255,0.85)",
          }}
        >
          Prev
        </button>
        <div
          className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{
            borderColor: "var(--primary-200)",
            color: "var(--primary-600)",
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        >
          Page {page} / {totalPages}
        </div>
        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages || Boolean(selected)}
          className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition disabled:opacity-40"
          style={{
            borderColor: "var(--primary-200)",
            color: "var(--primary-700)",
            backgroundColor: "rgba(255,255,255,0.85)",
          }}
        >
          Next
        </button>
      </div>
    </main>
  );
};
