import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "../../../utils/utils"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  disabled?: boolean
}

function Label({
  disabled,
  className,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-disabled={disabled ? "true" : undefined}
      className={cn(
        `
        flex items-center gap-2 text-sm font-medium select-none
        transition-colors

        text-black
        data-[disabled=true]:text-gray2
        peer-disabled:text-gray2 peer-disabled:cursor-not-allowed
        `,
        className
      )}
      {...props}
    />
  )
}

export { Label }
