"use client";

import React, { forwardRef, useId, useMemo, useState } from "react";
import type { InputProps } from "./InputTypes";
import { InputStyles } from "./InputStyles";
import { cn } from "@repo/utils";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      labelPlacement = "outside",
      placeholder,
      description,
      errorMessage,
      startContent,
      endContent,
      isClearable,
      onClear,
      fullWidth,
      isRequired,
      isInvalid,
      variant,
      color,
      size,
      radius,
      isDisabled,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      id: idProp,
      ...rest
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = idProp ?? reactId;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [isFocused, setIsFocused] = useState(false);

    // Simple controlled/uncontrolled handling for clear button visibility
    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value ?? "") : internalValue;
    const hasValue =
      currentValue !== "" &&
      currentValue !== undefined &&
      currentValue !== null;

    const describedBy = useMemo(() => {
      const ids: string[] = [];
      if (isInvalid && errorMessage) ids.push(`${inputId}-error`);
      if (description) ids.push(`${inputId}-description`);
      return ids.length ? ids.join(" ") : undefined;
    }, [description, errorMessage, inputId, isInvalid]);

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      if (onClear) {
        onClear();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const labelContent = label ? (
      <label
        htmlFor={inputId}
        className={cn(
          InputStyles.label({
            color: "default",
            required: isRequired,
          })
        )}
      >
        {label}
      </label>
    ) : null;

    return (
      <div
        className={cn(InputStyles.base({ fullWidth }), className)}
        data-invalid={isInvalid}
        data-focus={isFocused}
      >
        {labelPlacement === "outside" || labelPlacement === "outside-left"
          ? labelContent
          : null}

        <div
          className={cn(
            InputStyles.inputWrapper({
              variant,
              color,
              size,
              radius,
              isInvalid,
              isDisabled,
            }),
            labelPlacement === "outside-left"
              ? "flex-row-reverse justify-end gap-2"
              : ""
          )}
          data-invalid={isInvalid}
        >
          {startContent && <span className="select-none">{startContent}</span>}

          <div className="relative flex h-full w-full items-center">
            {labelPlacement === "inside" && label && (
              <label
                htmlFor={inputId}
                className="absolute left-3 top-1 text-xs font-semibold text-neutral-500"
              >
                {label}
              </label>
            )}
            <input
              autoComplete="off"
              ref={ref}
              id={inputId}
              type={type}
              className={cn(
                InputStyles.input({ size: "md" }),
                labelPlacement === "inside" ? "pt-5" : ""
              )}
              placeholder={placeholder}
              disabled={!!isDisabled}
              required={isRequired}
              aria-invalid={isInvalid}
              aria-required={isRequired}
              aria-describedby={describedBy}
              value={currentValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              data-has-start-content={!!startContent}
              data-has-end-content={!!endContent}
              {...rest}
            />
          </div>
          {isClearable && hasValue && !isDisabled && (
            <button
              type="button"
              onClick={handleClear}
              className={InputStyles.clearButton()}
              tabIndex={-1}
              aria-label="Clear input"
            >
              <span aria-hidden="true">{"\u00d7"}</span>
            </button>
          )}

          {endContent && <span className="select-none">{endContent}</span>}
        </div>

        {isInvalid && errorMessage ? (
          <div id={`${inputId}-error`} className={InputStyles.errorMessage()}>
            {errorMessage}
          </div>
        ) : description ? (
          <div
            id={`${inputId}-description`}
            className={InputStyles.description()}
          >
            {description}
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
