"use client";

import { forwardRef, MouseEvent } from "react";
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
    disabled,
    onClick,
    disabledRipples,
    ...otherProps
  } = props;

  const { createRipple } = useRipple();
  const isDisabled = Boolean(disabled || isLoading);

  const buttonClassName = cn(
    ButtonStyles.base({ variant, color, size, isLoading }),
    className
  );

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    if (!disabledRipples) {
      createRipple(event);
    }

    if (onClick) {
      onClick(event);
    }
  }

  return (
    <button
      ref={ref}
      className={buttonClassName}
      type={type ?? "button"}
      disabled={isDisabled}
      onClick={handleClick}
      {...otherProps}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
