"use client";

import Input, { type InputProps } from "../Input";
import {
  type FieldValues,
  type FieldPathValue,
  type Path,
  type FieldError,
  type RegisterOptions,
  useController,
  useFormState,
  type Control,
} from "react-hook-form";

export type ShowErrorStrategy = "submitted" | "touched" | "dirty" | "always";

export type ControlledInputProps<TFieldValues extends FieldValues> = Omit<
  InputProps,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur"
> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  defaultValue?: FieldPathValue<TFieldValues, Path<TFieldValues>>;
  showError?: ShowErrorStrategy;
  t?: (key: any) => string;
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
    showError = "submitted",
    t,
    ...inputProps
  } = props;

  const { field, fieldState } = useController({
    control,
    name,
    rules,
    defaultValue,
  });

  const { submitCount } = useFormState({ control });

  function translateErrorMessage(error: FieldError | undefined) {
    const message = error?.message;
    if (!message) return undefined;
    if (!t) return message;
    try {
      return t(message as any);
    } catch {
      return message;
    }
  }

  const hasFieldError = Boolean(fieldState.error);
  const shouldShowError =
    showError === "always"
      ? true
      : showError === "dirty"
        ? fieldState.isDirty
        : showError === "touched"
          ? fieldState.isTouched
          : submitCount > 0;

  const resolvedErrorMessage =
    errorMessageProp ??
    (hasFieldError && shouldShowError
      ? translateErrorMessage(fieldState.error)
      : undefined);

  const isInvalid =
    isInvalidProp ?? (hasFieldError && shouldShowError) ?? false;

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
      errorMessage={resolvedErrorMessage}
    />
  );
}
