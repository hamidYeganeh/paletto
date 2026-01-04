"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@repo/utils";
import { motion, type Transition } from "framer-motion";
import { FC } from "react";
import { ProgressProps } from "./ProgressTypes";
import { ProgressStyles } from "./ProgressStyles";

const MotionIndicator = motion.create(ProgressPrimitive.Indicator);
const defaultIndicatorTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 0.4,
};

const clampValue = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
};

const Progress: FC<ProgressProps> = (props) => {
  const {
    className,
    value,
    variant,
    color,
    radius,
    thumbRadius,
    size,
    ...otherProps
  } = props;

  const clampedValue = clampValue(value);

  const trackClassnames = cn(
    ProgressStyles.track({ color, size, variant, radius }),
    className
  );

  const thumbClassnames = cn(
    ProgressStyles.thumb({
      color,
      size,
      variant,
      radius: thumbRadius ?? radius,
    }),
    "origin-left"
  );

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={trackClassnames}
      value={clampedValue}
      {...otherProps}
    >
      <MotionIndicator
        data-slot="progress-indicator"
        className={thumbClassnames}
        initial={false}
        animate={{
          x: `${100 - clampedValue}%`,
          width: clampedValue === 0 ? 0 : "100%",
        }}
        transition={defaultIndicatorTransition}
      />
    </ProgressPrimitive.Root>
  );
};

export default Progress;
