import * as TogglePrimitive from "@radix-ui/react-toggle";
import { VariantProps } from "class-variance-authority";
import { ToggleVariants } from "./Toggle";

export interface ToggleProps extends React.ComponentProps<typeof TogglePrimitive.Root>,
  VariantProps<typeof ToggleVariants> {
  bgColor?: string;
  activeBgColor?: string;
  textColor?: string;
  iconColor?: string;
  isCustom?: boolean;
  className?: string;
  children?: React.ReactNode;
}

