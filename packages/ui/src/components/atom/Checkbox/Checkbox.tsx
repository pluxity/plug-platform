import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "../../../utils/utils";

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: 'square' | 'round';
}


function Checkbox({
  variant = 'square',
  className,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `
        peer size-4 shrink-0 border 
        flex items-center justify-center
        transition-colors outline-none 
        bg-white text-transparent

        border-gray 
        data-[state=checked]:bg-point-blue-dark 
        data-[state=checked]:text-white 
        data-[state=checked]:border-point-blue-dark

        disabled:bg-point-blue-disable
        disabled:border-gray2

        data-[state=checked]:disabled:bg-point-blue-disable
        data-[state=checked]:disabled:text-gray2
        data-[state=checked]:disabled:border-gray2

        disabled:cursor-not-allowed disabled:opacity-100
        `,
        variant === "round" ? "rounded-full" : "rounded-xs",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
