import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { ToggleVariants } from "../../atom/Toggle/Toggle";

export type ToggleGroupContextValue = VariantProps<typeof ToggleVariants>

export type ToggleGroupProps = (ToggleGroupPrimitive.ToggleGroupSingleProps | ToggleGroupPrimitive.ToggleGroupMultipleProps) &
  VariantProps<typeof ToggleVariants>

export type ToggleGroupItemProps = ToggleGroupPrimitive.ToggleGroupItemProps &
  VariantProps<typeof ToggleVariants>
