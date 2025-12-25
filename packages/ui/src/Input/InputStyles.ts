import { cva, type VariantProps } from "class-variance-authority";

export const InputStyles = {
  base: cva("group flex flex-col gap-1 data-[hidden=true]:hidden", {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }),
  label: cva("block text-sm font-normal mb-1.5", {
    variants: {
      color: {
        default: "text-white",
      },
      required: {
        true: "after:content-['*'] after:text-red-500 after:ml-0.5",
        false: "",
      },
    },
    defaultVariants: {
      color: "default",
      required: false,
    },
  }),
  inputWrapper: cva(
    "relative w-full inline-flex items-center gap-2 rounded-lg transition-all duration-500 ease-in-out data-[invalid=true]:ring-error-400 data-[invalid=true]:focus-within:ring-error-200",
    {
      variants: {
        variant: {
          outlined:
            "ring ring-white/40 input-border-b-glow focus-within:bg-white/5 origin-bottom-left text-white bg-black/10 focus-within:ring-white/60 placeholder:text-white",
        },
        color: {
          default: "text-white",
        },
        size: {
          xs: "h-11 px-3 text-xs",
          sm: "h-12 px-3 text-sm",
          md: "h-13 px-3 text-sm",
          lg: "h-14 px-4 text-base",
          xl: "h-15 px-4 text-base",
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
        isInvalid: {
          true: "ring-error-400 text-error-700",
          false: "",
        },
        isDisabled: {
          true: "opacity-60 pointer-events-none bg-neutral-100",
          false: "",
        },
      },
      defaultVariants: {
        variant: "outlined",
        color: "default",
        size: "md",
        radius: "md",
        isInvalid: false,
        isDisabled: false,
      },
    }
  ),
  input: cva(
    "w-full h-full font-semibold bg-transparent outline-none placeholder:text-white focus-visible:outline-none data-[has-start-content=true]:ps-1 data-[has-end-content=true]:pe-1 file:bg-transparent file:border-0 file:bg-none file:text-sm file:font-medium",
    {
      variants: {
        size: {
          xs: "text-xs",
          sm: "text-sm",
          md: "text-base",
          lg: "text-base",
          xl: "text-base",
        },
      },
      defaultVariants: {
        size: "md",
      },
    }
  ),
  description: cva("text-xs text-white mt-1"),
  errorMessage: cva("text-xs text-red-500 mt-1"),
  clearButton: cva(
    "aspect-square p-1 rounded-full hover:bg-zinc-200 text-zinc-500 cursor-pointer transition-colors"
  ),
};

export type InputVariantProps = VariantProps<typeof InputStyles.inputWrapper> &
  VariantProps<typeof InputStyles.base>;
