import { ProgressProps as BaseProgressProps } from "@radix-ui/react-progress";
import { ProgressThumbVariants, ProgressTrackVariants } from "./ProgressStyles";

export interface ProgressProps
  extends Omit<BaseProgressProps, "color">, ProgressTrackVariants {
  thumbRadius?: ProgressThumbVariants["radius"];
}
