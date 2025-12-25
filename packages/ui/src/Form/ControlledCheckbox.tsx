"use client";

import Checkbox, { CheckboxProps } from "../Checkbox";
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
import type { ShowErrorStrategy } from "./ControlledInput";

export type ControlledCheckboxProps<TFieldValues extends FieldValues> = Omit<
  CheckboxProps,
  "name" | "checked" | "defaultChecked" | "onCheckedChange" | "onBlur"
> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  defaultValue?: FieldPathValue<TFieldValues, Path<TFieldValues>>;
  showError?: ShowErrorStrategy;
  t?: (key: any) => string;
};

export function ControlledCheckbox<TFieldValues extends FieldValues>(
  props: ControlledCheckboxProps<TFieldValues>
) {
  const {
    control,
    name,
    rules,
    defaultValue,
    ariaInvalid,
    showError = "submitted",
    t,
    ...checkboxProps
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

  const translatedErrorMessage =
    hasFieldError && shouldShowError
      ? translateErrorMessage(fieldState.error)
      : undefined;

  const checkedValue =
    field.value === "indeterminate"
      ? "indeterminate"
      : typeof field.value === "boolean"
        ? field.value
        : Boolean(field.value);

  return (
    <Checkbox
      {...checkboxProps}
      ref={field.ref}
      name={field.name}
      checked={checkedValue}
      onCheckedChange={field.onChange}
      onBlur={field.onBlur}
      ariaInvalid={
        ariaInvalid ?? (Boolean(translatedErrorMessage) ? true : false)
      }
    />
  );
}
