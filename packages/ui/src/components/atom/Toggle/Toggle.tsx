import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { cn } from "../../../utils/utils";
import { ToggleProps } from "./Toggle.types";
import { useState } from "react";

const ToggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
                  className,
                  variant,
                  size,
                  bgColor,
                  activeBgColor,
                  textColor,
                  iconColor,
                  isCustom,
                  ...props
                }: ToggleProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(
        ToggleVariants({ variant, size }),
        "relative transition-colors duration-200",
        isCustom && "hover:brightness-95 focus-visible:outline",
        className
      )}
      style={
        isCustom
          ? {
            backgroundColor: pressed ? activeBgColor : bgColor,
            color: textColor,
          }
          : undefined
      }
      onPressedChange={setPressed}
      {...props}
    >
      <span style={{ color: iconColor }}>{props.children}</span>
    </TogglePrimitive.Root>
  );
}

Toggle.displayName = "Toggle";

export { Toggle, ToggleVariants };
