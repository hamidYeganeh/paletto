import { ComponentProps } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import {
  CheckboxFieldStylesVariants,
  CheckboxStylesVariants,
} from "./CheckboxStyles";
import { VariantProps } from "class-variance-authority";

export interface CheckboxProps
  extends
    Omit<ComponentProps<typeof CheckboxPrimitive.Root>, "color">,
    CheckboxStylesVariants,
    CheckboxFieldStylesVariants {
  label?: string;
  isIndeterminate?: boolean;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  disabledRipples?: boolean;
}
