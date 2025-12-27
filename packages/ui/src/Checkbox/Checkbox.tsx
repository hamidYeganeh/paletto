"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@repo/utils"
import { CheckboxStyles } from "./CheckboxStyles"
import { forwardRef, useId } from "react"
import type { ElementRef, MouseEvent } from "react"
import { CheckboxProps } from "./CheckboxTypes"
import { useRipple } from "@repo/hooks"


const Checkbox = forwardRef<
    ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
>((props, ref) => {
    const {
        className,
        color, variant,
        size,
        label,
        isIndeterminate,
        ariaInvalid,
        ariaRequired,
        checked,
        defaultChecked,
        onClick,
        disabledRipples,
        bgTransparent,
        ...otherProps
    } = props

    const CheckboxClassnames = cn(CheckboxStyles.base({ color, size, variant }), className)
    const generatedId = useId()
    const checkboxId = otherProps.id ?? generatedId
    const resolvedChecked = isIndeterminate ? "indeterminate" : checked
    const { createRipple } = useRipple()

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
        if (otherProps.disabled) {
            event.preventDefault();
            return;
        }

        if (!disabledRipples) {
            createRipple(event);
        }

        onClick?.(event);
    }

    const root = (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            ref={ref}
            className={CheckboxClassnames}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired}
            {...otherProps}
            checked={resolvedChecked}
            defaultChecked={isIndeterminate ? undefined : defaultChecked}
            id={checkboxId}
            onClick={handleClick}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none"
            >
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4.0625L4.96 8C6.85515 5.39086 9.14438 3.09219 11.7457 1.18632L12 1" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )

    return (
        <div data-slot="checkbox-field" className={cn(CheckboxStyles.field({ color, size, variant, bgTransparent }))}>
            {root}
            {label ? (
                <label data-slot="checkbox-label" htmlFor={checkboxId} className="text-sm font-semibold select-none text-inherit">
                    {label}
                </label>
            ) : null}
        </div>
    )
})

export default Checkbox 
