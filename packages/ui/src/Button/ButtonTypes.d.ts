import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ButtonStylesVariants } from "./ButtonStyles";

export interface ButtonProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color">,
    ButtonStylesVariants {
  asChild?: boolean;
  disabledRipples?: boolean;
  endIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: ReactNode;
  startIcon?: ReactNode;
}
