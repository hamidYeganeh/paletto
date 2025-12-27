"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { motion, type MotionProps } from "framer-motion";
import { cn } from "@repo/utils";
import { DropdownMenuStyles } from "./DropdownMenuStyles";
import { Highlight } from "../Highlight";
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPortalProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from "./DropdownMenuTypes";

const itemMotionProps: Pick<
  MotionProps,
  "layout" | "whileHover" | "whileTap" | "transition"
> = {
  layout: true,
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: {
    type: "spring",
    stiffness: 360,
    damping: 28,
    mass: 0.6,
  },
};

function withHighlight(children: React.ReactNode) {
  return (
    <Highlight
      controlledItems={false}
      hover
      click={false}
      className="bg-white/10 rounded-theme-md"
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      {children}
    </Highlight>
  );
}

function DropdownMenu(props: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  className,
  ...props
}: DropdownMenuTriggerProps) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={className}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(DropdownMenuStyles.content(), className)}
        {...props}
      >
        {withHighlight(children)}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPortal>
  );
}

function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item asChild {...props}>
      <motion.div
        data-slot="dropdown-menu-item"
        data-inset={inset}
        data-variant={variant}
        className={cn(
          DropdownMenuStyles.item({
            inset,
            variant,
          }),
          className
        )}
        {...itemMotionProps}
      >
        {children}
      </motion.div>
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem asChild {...props}>
      <motion.div
        data-slot="dropdown-menu-checkbox-item"
        className={cn(DropdownMenuStyles.checkboxItem(), className)}
        {...itemMotionProps}
      >
        <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator asChild>
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <CheckIcon className="size-4" />
            </motion.span>
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </motion.div>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <DropdownMenuPrimitive.RadioItem asChild {...props}>
      <motion.div
        data-slot="dropdown-menu-radio-item"
        className={cn(DropdownMenuStyles.radioItem(), className)}
        {...itemMotionProps}
      >
        <span className="pointer-events-none absolute left-3 flex size-4 items-center justify-center">
          <DropdownMenuPrimitive.ItemIndicator asChild forceMount>
            <motion.span
              layoutId="dropdown-menu-radio-indicator"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <CircleIcon className="size-3 fill-current" />
            </motion.span>
          </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
      </motion.div>
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        DropdownMenuStyles.label({
          inset,
        }),
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(DropdownMenuStyles.separator(), className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(DropdownMenuStyles.shortcut(), className)}
      {...props}
    />
  );
}

function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger asChild {...props}>
      <motion.div
        data-slot="dropdown-menu-sub-trigger"
        data-inset={inset}
        className={cn(
          DropdownMenuStyles.subTrigger({
            inset,
          }),
          className
        )}
        {...itemMotionProps}
      >
        {children}
        <ChevronRightIcon className="ml-auto size-4" />
      </motion.div>
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        className={cn(DropdownMenuStyles.subContent(), className)}
        {...props}
      >
        {withHighlight(children)}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPortal>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
