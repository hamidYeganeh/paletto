import { type InputHTMLAttributes, type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { InputStyles } from "./InputStyles";

type InputBaseProps = VariantProps<typeof InputStyles.inputWrapper> &
  VariantProps<typeof InputStyles.base>;

export type LabelPlacement = "inside" | "outside" | "outside-left";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    InputBaseProps {
  label?: ReactNode;
  labelPlacement?: LabelPlacement;
  description?: ReactNode;
  errorMessage?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  isClearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
}
