"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "../Button";
import type { ButtonProps } from "../Button/ButtonTypes";

export type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  disableWhileSubmitting?: boolean;
};

export function SubmitButton(props: SubmitButtonProps) {
  const { disableWhileSubmitting = true, disabled, isLoading, ...buttonProps } =
    props;
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Button
      {...buttonProps}
      type="submit"
      isLoading={isLoading ?? isSubmitting}
      disabled={disabled ?? (disableWhileSubmitting ? isSubmitting : false)}
    />
  );
}

