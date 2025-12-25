"use client";

import Input, { type InputProps } from "../Input";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  useController,
  type Control,
} from "react-hook-form";

export type ControlledInputProps<TFieldValues extends FieldValues> = Omit<
  InputProps,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  defaultValue?: TFieldValues[Path<TFieldValues>];
};

export function ControlledInput<TFieldValues extends FieldValues>(
  props: ControlledInputProps<TFieldValues>
) {
  const {
    control,
    name,
    rules,
    defaultValue,
    isInvalid: isInvalidProp,
    errorMessage: errorMessageProp,
    isDisabled: isDisabledProp,
    ...inputProps
  } = props;

  const { field, fieldState } = useController({
    control,
    name,
    rules,
    defaultValue,
  });

  const errorMessage = fieldState.error?.message;
  const isInvalid = isInvalidProp ?? Boolean(errorMessage);

  return (
    <Input
      {...inputProps}
      ref={field.ref}
      name={field.name}
      value={
        typeof field.value === "string"
          ? field.value
          : field.value == null
            ? ""
            : String(field.value)
      }
      onChange={field.onChange}
      onBlur={field.onBlur}
      isInvalid={isInvalid}
      errorMessage={errorMessageProp ?? errorMessage}
      isDisabled={isDisabledProp ?? field.disabled}
    />
  );
}

