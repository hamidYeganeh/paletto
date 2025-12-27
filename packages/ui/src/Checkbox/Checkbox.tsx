"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@repo/utils";
import { CheckboxStyles } from "./CheckboxStyles";
import { forwardRef, useId } from "react";
import type { ElementRef, MouseEvent } from "react";
import { CheckboxProps } from "./CheckboxTypes";
import { useRipple } from "@repo/hooks";
import { motion } from "framer-motion";

const iconDimensions: Record<
  NonNullable<CheckboxProps["size"]>,
  { width: number; height: number }
> = {
  md: { width: 16, height: 16 },
};

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>((props, ref) => {
  const {
    className,
    color,
    variant,
    size,
    label,
    isIndeterminate,
    ariaInvalid,
    ariaRequired,
    checked,
    defaultChecked,
    onClick,
    disabledRipples,
    bgTransparent,
    ...otherProps
  } = props;

  const iconSize = iconDimensions[size ?? "md"] ?? iconDimensions.md;
  const CheckboxClassnames = cn(
    CheckboxStyles.base({ color, size, variant }),
    className
  );
  const generatedId = useId();
  const checkboxId = otherProps.id ?? generatedId;
  const resolvedChecked = isIndeterminate ? "indeterminate" : checked;
  const indicatorState =
    resolvedChecked === "indeterminate"
      ? "indeterminate"
      : resolvedChecked
        ? "checked"
        : "unchecked";
  const { createRipple } = useRipple();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (otherProps.disabled) {
      event.preventDefault();
      return;
    }

    if (!disabledRipples) {
      createRipple(event);
    }

    onClick?.(event);
  }

  const root = (
    <CheckboxPrimitive.Root
      ref={ref}
      asChild
      {...otherProps}
      checked={resolvedChecked}
      defaultChecked={isIndeterminate ? undefined : defaultChecked}
      id={checkboxId}
    >
      <motion.button
        data-slot="checkbox"
        className={CheckboxClassnames}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <CheckboxPrimitive.Indicator
          forceMount
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none leading-none"
          asChild
        >
          {indicatorState === "indeterminate" ? (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
              stroke="currentColor"
              width={iconSize.width}
              height={iconSize.height}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: 1,
                  transition: { duration: 0.2 },
                }}
              />
            </motion.svg>
          ) : (
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
              stroke="currentColor"
              width={iconSize.width}
              height={iconSize.height}
              initial={false}
              animate={indicatorState === "checked" ? "checked" : "unchecked"}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13.5 10 18.5 19 6"
                variants={{
                  checked: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 0.2, delay: 0.1 },
                  },
                  unchecked: {
                    pathLength: 0,
                    opacity: 0,
                    transition: { duration: 0.15 },
                  },
                }}
              />
            </motion.svg>
          )}
        </CheckboxPrimitive.Indicator>
      </motion.button>
    </CheckboxPrimitive.Root>
  );

  return (
    <div
      data-slot="checkbox-field"
      className={cn(
        CheckboxStyles.field({ color, size, variant, bgTransparent })
      )}
    >
      {root}
      {label ? (
        <label
          data-slot="checkbox-label"
          htmlFor={checkboxId}
          className="text-sm font-semibold select-none text-inherit"
        >
          {label}
        </label>
      ) : null}
    </div>
  );
});

export default Checkbox;
