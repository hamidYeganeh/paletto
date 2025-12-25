import { ComponentProps } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckboxStylesVariants } from "./CheckboxStyles";

export interface CheckboxProps
  extends
    Omit<ComponentProps<typeof CheckboxPrimitive.Root>, "color">,
    CheckboxStylesVariants {}
