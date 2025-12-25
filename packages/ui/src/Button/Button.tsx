"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { ButtonProps } from "./ButtonTypes";
import { cn } from "@repo/utils";
import { ButtonStyles } from "./ButtonStyles";
import { useRipple } from "@repo/hooks";

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    variant,
    color,
    size,
    type,
    children,
    isLoading,
    loadingText,
    disabled,
    radius,
    onClick,
    startIcon,
    endIcon,
    asChild,
    disabledRipples = false,
    ...otherProps
  } = props;

  const { createRipple } = useRipple();
  const child = isValidElement(children) ? (children as ReactElement) : null;
  const childProps = (child?.props ?? {}) as Record<string, unknown>;
  const childClassName = childProps.className as string | undefined;
  const childContent = (childProps.children ?? null) as ReactNode;
  const isDisabled = Boolean(disabled || isLoading);

  const buttonClassName = cn(
    ButtonStyles.base({ variant, color, size, isLoading, radius }),
    className
  );

  const childOnClick = childProps.onClick as
    | ((event: MouseEvent<any>) => void)
    | undefined;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    if (!disabledRipples) {
      createRipple(event);
    }

    onClick?.(event);
    childOnClick?.(event as unknown as MouseEvent<any>);
  }

  const label: ReactNode = child ? childContent : children;
  const loadingLabel = loadingText ?? label;

  const content = isLoading ? (
    <>
      <span
        aria-hidden="true"
        className="inline-flex size-4 items-center justify-center rounded-full border-2 border-current border-b-transparent animate-spin"
      />
      {loadingLabel && <span className="inline-flex items-center">{loadingLabel}</span>}
    </>
  ) : (
    <>
      {startIcon && <span className="inline-flex items-center">{startIcon}</span>}
      {label && <span className="inline-flex items-center">{label}</span>}
      {endIcon && <span className="inline-flex items-center">{endIcon}</span>}
    </>
  );

  if (asChild && child) {
    const { children: _childChildren, ...childRestProps } =
      childProps as Record<string, any>;

    return cloneElement(
      child,
      {
        ...childRestProps,
        ...otherProps,
        ref,
        className: cn(childClassName, buttonClassName),
        onClick: handleClick,
        "aria-disabled": isDisabled || undefined,
        "aria-busy": isLoading || undefined,
        "data-loading": isLoading || undefined,
        "data-disabled": isDisabled || undefined,
        children: content,
      } as any
    );
  }

  return (
    <button
      ref={ref}
      className={buttonClassName}
      type={type ?? "button"}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading || undefined}
      data-loading={isLoading || undefined}
      data-disabled={isDisabled || undefined}
      onClick={handleClick}
      {...otherProps}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
