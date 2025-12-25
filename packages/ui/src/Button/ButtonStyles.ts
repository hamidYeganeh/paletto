import { cn, cva, VariantProps } from "@repo/utils";

const ButtonBaseStyles = cva(
  cn(
    // Layout
    "inline-flex items-center justify-center gap-2 min-w-20",
    "relative overflow-hidden outline-none cursor-pointer select-none",

    "font-semibold text-sm leading-normal",

    // Focus
    // "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--main-color)",

    // Motion
    "transition-colors duration-400",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    "data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed"
  ),
  {
    variants: {
      variant: {
        contained:
          "bg-(--main-color) text-(--text-color) hover:bg-(--dark-color)",
      },
      color: {
        default: cn(
          "[--lighter-color:theme(colors.gray.50)]",
          "[--light-color:theme(colors.gray.100)]",
          "[--main-color:theme(colors.white)]",
          "[--dark-color:theme(colors.gray.300)]",
          "[--darker-color:theme(colors.gray.400)]",
          "[--text-color:theme(colors.gray.900)]"
        ),
        primary: cn(
          "[--lighter-color:theme(colors.primary.50)]",
          "[--light-color:theme(colors.primary.100)]",
          "[--main-color:theme(colors.primary.500)]",
          "[--dark-color:theme(colors.primary.600)]",
          "[--darker-color:theme(colors.primary.700)]",
          "[--text-color:theme(colors.primary.50)]"
        ),
      },
      size: {
        xs: "h-11 px-1 text-xs",
        sm: "h-12 px-3 text-xs",
        md: "h-13 px-3 text-sm",
        lg: "h-14 px-6 text-base",
        xl: "h-15 px-8 text-lg",
      },
      radius: {
        xs: "rounded-theme-xs",
        sm: "rounded-theme-sm",
        md: "rounded-theme-md",
        lg: "rounded-theme-lg",
        xl: "rounded-theme-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
      isLoading: {
        true: "opacity-70 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "contained",
      color: "default",
      size: "md",
      radius: "md",
      isLoading: false,
    },
  }
);

export const ButtonStyles = {
  base: ButtonBaseStyles,
};
export type ButtonStylesVariants = VariantProps<typeof ButtonStyles.base>;
