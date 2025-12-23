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
        default: "text-neutral-800",
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
    "relative w-full inline-flex items-center gap-2 rounded-lg border bg-white text-neutral-900 shadow-sm transition-all duration-150 ease-in-out focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 data-[invalid=true]:border-red-400 data-[invalid=true]:focus-within:ring-red-200",
    {
      variants: {
        variant: {
          bordered: "",
          ghost:
            "border-transparent bg-transparent shadow-none focus-within:border-primary-400 focus-within:ring-0",
        },
        color: {
          default: "",
        },
        size: {
          xs: "h-9 px-3 text-xs",
          sm: "h-10 px-3 text-sm",
          md: "h-11 px-3 text-sm",
          lg: "h-12 px-4 text-base",
          xl: "h-14 px-4 text-base",
        },
        radius: {
          none: "rounded-none",
          sm: "rounded-sm",
          md: "rounded-theme-md",
          lg: "rounded-lg",
          full: "rounded-full",
        },
        isInvalid: {
          true: "border-red-400 text-red-700",
          false: "",
        },
        isDisabled: {
          true: "opacity-60 pointer-events-none bg-neutral-100",
          false: "",
        },
      },
      defaultVariants: {
        variant: "bordered",
        color: "default",
        size: "md",
        radius: "md",
        isInvalid: false,
        isDisabled: false,
      },
    }
  ),
  input: cva(
    "w-full h-full font-normal bg-transparent outline-none placeholder:text-neutral-400 focus-visible:outline-none data-[has-start-content=true]:ps-1 data-[has-end-content=true]:pe-1 file:bg-transparent file:border-0 file:bg-none file:text-sm file:font-medium",
    {
      variants: {
        size: {
          sm: "text-xs",
          md: "text-sm",
          lg: "text-base",
        },
      },
      defaultVariants: {
        size: "md",
      },
    }
  ),
  description: cva("text-xs text-zinc-500 mt-1"),
  errorMessage: cva("text-xs text-red-500 mt-1"),
  clearButton: cva(
    "p-1 rounded-full hover:bg-zinc-200 text-zinc-500 cursor-pointer transition-colors"
  ),
};

export type InputVariantProps = VariantProps<typeof InputStyles.inputWrapper> &
  VariantProps<typeof InputStyles.base>;
