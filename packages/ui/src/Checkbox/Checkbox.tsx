"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@repo/utils"
import { CheckboxStyles } from "./CheckboxStyles"
import { FC } from "react"
import { CheckboxProps } from "./CheckboxTypes"


const Checkbox: FC<CheckboxProps> = (props) => {
    const {
        className,
        color, variant,
        size,
        ...otherProps
    } = props

    const CheckboxClassnames = cn(CheckboxStyles.base({ color, size, variant }), className)

    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={CheckboxClassnames}
            {...otherProps}
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
}

export default Checkbox 
