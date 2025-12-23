/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@repo/ui/Input";

type ControlledInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
  autoComplete?: string;
};

export function ControlledInput({
  name,
  label,
  placeholder,
  type = "text",
  description,
  autoComplete,
}: ControlledInputProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const fieldError = useMemo(() => {
    const err = errors[name];
    if (!err) return undefined;
    if (typeof err.message === "string") return err.message;
    return undefined;
  }, [errors, name]);

  return (
    <Input
      label={label}
      placeholder={placeholder}
      labelPlacement="outside"
      type={type}
      fullWidth
      isDisabled={isSubmitting}
      description={description}
      isInvalid={Boolean(fieldError)}
      errorMessage={fieldError}
      {...register(name)}
      autoComplete={autoComplete}
    />
  );
}
