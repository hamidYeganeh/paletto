// "use client";

// import * as ProgressPrimitive from "@radix-ui/react-progress";
// import { cn } from "@repo/utils";
// import { FC } from "react";
// import { ProgressProps } from "./ProgressTypes";
// import { ProgressStyles } from "./ProgressStyles";

// const clampValue = (value: number | null | undefined) => {
//   if (value == null || Number.isNaN(value)) return 0;
//   return Math.min(100, Math.max(0, value));
// };

// const Progress: FC<ProgressProps> = (props) => {
//   const { className, value, variant, color, radius, size, ...otherProps } =
//     props;
//   const clampedValue = clampValue(value);

//   const ProgressTrackClassnames = cn(
//     ProgressStyles.track({ color, size, variant, radius }),
//     className
//   );
//   const ProgressThumbClassnames = cn(
//     ProgressStyles.thumb({ color, size, variant, radius }),
//     className,
//     "origin-left"
//   );

//   return (
//     <ProgressPrimitive.Root
//       data-slot="progress"
//       className={ProgressTrackClassnames}
//       value={clampedValue}
//       {...otherProps}
//     >
//       <ProgressPrimitive.Indicator
//         data-slot="progress-indicator"
//         className={ProgressThumbClassnames}
//         // style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//         style={{ transform: `translateX(${100 - clampedValue}%)` }}
//       />
//     </ProgressPrimitive.Root>
//   );
// };

// export default Progress;

"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@repo/utils";
import { FC } from "react";
import { ProgressProps } from "./ProgressTypes";
import { ProgressStyles } from "./ProgressStyles";

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
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={thumbClassnames}
        style={{
          transform: `translateX(${100 - clampedValue}%)`,
          width: clampedValue === 0 ? 0 : "100%",
        }}
      />

      {/* <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={thumbClassnames}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      /> */}
    </ProgressPrimitive.Root>
  );
};

export default Progress;
