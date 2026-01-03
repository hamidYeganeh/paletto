"use client";

import { useMemo } from "react";
import { ProgressGroup } from "@repo/ui/Progress";
import type { PreferencesStep } from "../constants/preferencesSteps";
import { usePreferencesStore } from "../store/PreferencesStore";

type PreferencesProgressProps = {
  steps: PreferencesStep[];
};

export const PreferencesProgress = ({ steps }: PreferencesProgressProps) => {
  const stepIndex = usePreferencesStore((state) => state.stepIndex);

  const progressItems = useMemo(() => {
    if (!steps.length) return [];

    const safeIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
    const stepNumber = Math.min(steps.length, Math.max(1, safeIndex + 1));
    const totalProgress = stepNumber / steps.length;
    const stepFraction = 1 / steps.length;

    return steps.map((_step, index) => {
      const start = index * stepFraction;
      const filled = Math.min(
        Math.max(totalProgress - start, 0),
        stepFraction
      );
      const value = Math.round((filled / stepFraction) * 100);
      return { value, key: index };
    });
  }, [stepIndex, steps]);

  return (
    <ProgressGroup
      items={progressItems}
      color="white"
      variant="contained"
      size="md"
    />
  );
};
