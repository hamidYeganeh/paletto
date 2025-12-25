import { cn, cva, VariantProps } from "@repo/utils";

const CheckboxBaseStyles = cva(
  cn(
    "peer border-0 shrink-0 transition-color outline-none",
    "rounded-theme-md transition-all duration-400"
  ),
  {
    variants: {
      variant: {
        contained:
          "bg-(--bg-color)/20 data-[state=checked]:bg-(--bg-color) data-[state=checked]:text-(--indicator-color) data-[state=checked]:[&_path]:stroke-(--indicator-color)",
      },
      color: {
        white: cn(
          "[--bg-color:theme(colors.white)]",
          "[--indicator-color:theme(colors.black)]"
        ),
        black: cn(
          "[--bg-color:theme(colors.black)]",
          "[--indicator-color:theme(colors.white)]"
        ),
        primary: cn(
          "[--bg-color:theme(colors.primary.500)]",
          "[--indicator-color:theme(colors.primary.50)]"
        ),
      },
      size: {
        md: "w-6 h-8",
      },
    },
    defaultVariants: {
      color: "white",
      variant: "contained",
      size: "md",
    },
  }
);

export const CheckboxStyles = {
  base: CheckboxBaseStyles,
};

export type CheckboxStylesVariants = VariantProps<typeof CheckboxStyles.base>;
