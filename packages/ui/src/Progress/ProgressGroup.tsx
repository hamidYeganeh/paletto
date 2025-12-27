"use client";

import { cn } from "@repo/utils";
import { FC } from "react";
import Progress from "./Progress";
import { ProgressProps } from "./ProgressTypes";

export interface ProgressGroupItem extends ProgressProps {
  key?: string | number;
}

export interface ProgressGroupProps {
  items: ProgressGroupItem[];
  className?: string;
  /** Optional className applied to each item */
  itemClassName?: string;
  color?: ProgressProps["color"];
  variant?: ProgressProps["variant"];
  size?: ProgressProps["size"];
  radius?: ProgressProps["radius"];
}

export const ProgressGroup: FC<ProgressGroupProps> = ({
  items,
  className,
  itemClassName,
  color,
  variant,
  size,
  radius,
}) => {
  if (!items?.length) return null;

  return (
    <div className={cn("flex w-full flex-row items-center", className)}>
      {items.map((item, index) => {
        const {
          key,
          className: itemSpecificClass,
          radius: itemRadius,
          ...restItem
        } = item;

        return (
          <Progress
            key={key ?? index}
            {...{ color, variant, size }}
            {...restItem}
            thumbRadius={radius ?? "full"}
            className={cn(
              "flex-1",
              "first:rounded-e-none! not-first:not-last:rounded-none last:rounded-s-none!",
              itemClassName,
              itemSpecificClass
            )}
          />
        );
      })}
    </div>
  );
};

export default ProgressGroup;
