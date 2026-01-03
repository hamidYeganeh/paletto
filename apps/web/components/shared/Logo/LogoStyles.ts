import { cn, cva, type VariantProps } from "@repo/utils";

export const LogoStyles = {
  base: cva(cn(""), {
    variants: {
      color: {
        primary:
          "[&_path]:fill-primary-500 [&_stroke]:[&_path]:fill-primary-500",
        secondary:
          "[&_path]:fill-secondary-500 [&_stroke]:[&_path]:fill-secondary-500",
      },
      size: {
        xs: "w-7 h-5",
        sm: "w-9 h-6",
        md: "w-12 h-8",
        lg: "w-16 h-12",
        xl: "w-20 h-16",
      },
    },
  }),
};

export type LogoStylesVariants = VariantProps<typeof LogoStyles.base>;
