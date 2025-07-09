import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { ToggleVariants } from "../../atom/Toggle/Toggle";

export type ToggleGroupContextValue = VariantProps<typeof ToggleVariants>

export type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof ToggleVariants>

export type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof ToggleVariants>
