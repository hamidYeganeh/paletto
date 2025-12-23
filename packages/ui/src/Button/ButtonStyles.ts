import { cn, cva, VariantProps } from "@repo/utils";

const ButtonBaseStyles = cva(
  cn(
    // Layout
    "inline-flex items-center justify-center gap-2",
    "relative overflow-hidden rounded-theme-md outline-none",

    // Motion
    "transition-colors duration-200"
  ),
  {
    variants: {
      variant: {
        contained:
          "bg-(--main-color) text-(--text-color) hover:bg-(--dark-color)",
      },
      color: {
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
        xs: "h-10 px-1 text-xs",
        sm: "h-11 px-3 text-xs",
        md: "h-12 px-4 text-sm",
        lg: "h-13 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
      isLoading: {
        true: "opacity-70 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "contained",
      color: "primary",
      size: "md",
    },
  }
);

export const ButtonStyles = {
  base: ButtonBaseStyles,
};
export type ButtonStylesVariants = VariantProps<typeof ButtonStyles.base>;
