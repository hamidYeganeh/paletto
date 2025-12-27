import { cva, type VariantProps } from "@repo/utils";

const DropdownMenuContentStyles = cva(
  [
    "z-50 min-w-[12rem] max-h-[min(420px,var(--radix-dropdown-menu-content-available-height))]",
    "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
    "overflow-x-hidden overflow-y-auto",
    "rounded-theme-lg border border-white/10 bg-neutral-950/90 p-2 text-white shadow-2xl backdrop-blur-xl",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ].join(" ")
);

const DropdownMenuItemStyles = cva(
  [
    "relative flex w-full cursor-pointer select-none items-center gap-3",
    "rounded-theme-md px-3 py-2 text-sm font-medium outline-none transition-colors duration-200",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      inset: {
        true: "pl-10",
        false: "",
      },
      variant: {
        default: "hover:bg-white/5 focus:bg-white/5",
        destructive:
          "text-error-400 hover:bg-error-500/15 focus:bg-error-500/15 [&_svg]:text-error-400",
      },
    },
    defaultVariants: {
      inset: false,
      variant: "default",
    },
  }
);

const DropdownMenuSelectableItemStyles = cva(
  [
    "relative flex w-full cursor-pointer select-none items-center gap-3",
    "rounded-theme-md py-2 pr-3 pl-10 text-sm font-medium outline-none transition-colors duration-200",
    "hover:bg-white/5 focus:bg-white/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" ")
);

const DropdownMenuLabelStyles = cva(
  "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-white/60",
  {
    variants: {
      inset: {
        true: "pl-10",
        false: "",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

const DropdownMenuSubTriggerStyles = cva(
  [
    "flex cursor-pointer select-none items-center gap-3 rounded-theme-md px-3 py-2",
    "text-sm font-medium outline-none transition-colors duration-200",
    "hover:bg-white/5 focus:bg-white/5 data-[state=open]:bg-white/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      inset: {
        true: "pl-10",
        false: "",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

const DropdownMenuSubContentStyles = cva(
  [
    "z-50 min-w-[12rem] rounded-theme-lg border border-white/10 bg-neutral-950/90 p-2 text-white shadow-2xl backdrop-blur-xl",
    "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
    "overflow-hidden",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ].join(" ")
);

const DropdownMenuSeparatorStyles = cva("my-2 h-px bg-white/10");
const DropdownMenuShortcutStyles = cva(
  "ml-auto text-[11px] uppercase tracking-[0.25em] text-white/40"
);

export const DropdownMenuStyles = {
  content: DropdownMenuContentStyles,
  item: DropdownMenuItemStyles,
  checkboxItem: DropdownMenuSelectableItemStyles,
  radioItem: DropdownMenuSelectableItemStyles,
  label: DropdownMenuLabelStyles,
  separator: DropdownMenuSeparatorStyles,
  shortcut: DropdownMenuShortcutStyles,
  subTrigger: DropdownMenuSubTriggerStyles,
  subContent: DropdownMenuSubContentStyles,
};

export type DropdownMenuItemVariants = VariantProps<typeof DropdownMenuStyles.item>;
export type DropdownMenuLabelVariants = VariantProps<typeof DropdownMenuStyles.label>;
export type DropdownMenuSubTriggerVariants = VariantProps<typeof DropdownMenuStyles.subTrigger>;
