import type { ComponentPropsWithoutRef } from "react";
import type * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type {
  DropdownMenuItemVariants,
  DropdownMenuLabelVariants,
  DropdownMenuSubTriggerVariants,
} from "./DropdownMenuStyles";

export type DropdownMenuProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
>;
export type DropdownMenuPortalProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Portal
>;
export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;
export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;
export type DropdownMenuGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;
export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;
export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioGroup
>;
export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
>;
export type DropdownMenuSubProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Sub
>;
export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
>;
export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
> &
  DropdownMenuLabelVariants;

export type DropdownMenuShortcutProps = ComponentPropsWithoutRef<"span">;

export type DropdownMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> &
  DropdownMenuItemVariants;

export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubTrigger
> &
  DropdownMenuSubTriggerVariants;
