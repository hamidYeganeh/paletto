import { cva, VariantProps } from "@repo/utils";

const ProgressTrackStyles = cva("w-full overflow-hidden relative", {
  variants: {
    variant: {
      contained: "bg-(--bg-color)/20",
    },
    color: {
      white: "[--bg-color:theme(colors.white)]",
    },
    size: {
      xs: "",
      sm: "",
      md: "h-2 p-0.5",
      lg: "",
      xl: "",
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
  },
  defaultVariants: {
    color: "white",
    size: "md",
    variant: "contained",
    radius: "full",
  },
});
const ProgressThumbStyles = cva(
  "h-full w-full flex-1 transition-transform duration-200 ease-out will-change-transform",
  {
    variants: {
      variant: {
        contained: "bg-(--thumb-color)",
      },
      color: {
        white: "[--thumb-color:theme(colors.white)]",
      },
      size: {
        xs: "",
        sm: "",
        md: "h-1",
        lg: "",
        xl: "",
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
    },
    defaultVariants: {
      color: "white",
      size: "md",
      variant: "contained",
      radius: "full",
    },
  }
);

export const ProgressStyles = {
  track: ProgressTrackStyles,
  thumb: ProgressThumbStyles,
};

export type ProgressTrackVariants = VariantProps<typeof ProgressStyles.track>;
export type ProgressThumbVariants = VariantProps<typeof ProgressStyles.thumb>;
