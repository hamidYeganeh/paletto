import type { ComponentPropsWithoutRef } from "react";
import type { ButtonStylesVariants } from "./ButtonStyles";

export interface ButtonProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color">,
    ButtonStylesVariants {
  disabledRipples?: boolean;
  isLoading?: boolean;
}
