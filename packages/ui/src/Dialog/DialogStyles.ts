import { cva } from "@repo/utils";

const DialogOverlayStyles = cva(
  [
    "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  ].join(" ")
);

const DialogContentStyles = cva(
  [
    "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg",
    "translate-x-[-50%] translate-y-[-50%] gap-4",
    "rounded-theme-lg border border-white/10 bg-neutral-950/90 p-6 text-white shadow-2xl backdrop-blur-xl",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  ].join(" ")
);

const DialogHeaderStyles = cva(
  "flex flex-col gap-1.5 text-center sm:text-left"
);

const DialogFooterStyles = cva(
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
);

const DialogTitleStyles = cva("text-lg font-semibold leading-none tracking-tight");

const DialogDescriptionStyles = cva("text-sm text-white/60");

const DialogCloseStyles = cva(
  [
    "absolute right-4 top-4 inline-flex size-9 items-center justify-center",
    "rounded-theme-sm text-white/60 transition hover:text-white",
    "focus:outline-none focus:ring-2 focus:ring-white/30",
    "disabled:pointer-events-none",
  ].join(" ")
);

export const DialogStyles = {
  overlay: DialogOverlayStyles,
  content: DialogContentStyles,
  header: DialogHeaderStyles,
  footer: DialogFooterStyles,
  title: DialogTitleStyles,
  description: DialogDescriptionStyles,
  close: DialogCloseStyles,
};
