import { cn, cva, VariantProps } from "@repo/utils";

const CheckboxBaseStyles = cva(
  cn(
    "peer border-0 shrink-0 transition-color outline-none overflow-hidden relative",
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

const CheckboxFieldStyles = cva(
  cn(
    "flex flex-row items-center gap-2 transition-all duration-400 rounded-theme-lg"
  ),
  {
    variants: {
      variant: {
        contained:
          "bg-(--bg-color)/5 [&:has([data-state=checked])]:bg-(--indicator-color) [&:has([data-state=checked])]:text-(--bg-color)",
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
        md: "p-2",
      },
      bgTransparent: {
        false: "[&:not([data-state=checked])]:bg-transparent!  text-inherit!",
      },
    },
    defaultVariants: {
      color: "black",
      variant: "contained",
      size: "md",
      bgTransparent: false,
    },
  }
);

export const CheckboxStyles = {
  base: CheckboxBaseStyles,
  field: CheckboxFieldStyles,
};

export type CheckboxStylesVariants = VariantProps<typeof CheckboxStyles.base>;
export type CheckboxFieldStylesVariants = VariantProps<
  typeof CheckboxStyles.field
>;
