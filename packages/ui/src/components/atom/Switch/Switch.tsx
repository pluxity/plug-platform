import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../../utils/utils";
import { SwitchProps } from "./Switch.types";

function Switch({
  className,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-4 w-7 shrink-0 rounded-lg overflow-hidden outline outline-1 outline-offset-[-1px] transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 items-center",
        "data-[state=checked]:bg-blue-600 data-[state=checked]:outline-blue-700",
        "data-[state=unchecked]:bg-white data-[state=unchecked]:outline-gray-500",
        "disabled:cursor-not-allowed",
        "disabled:data-[state=checked]:bg-gray-200 disabled:data-[state=checked]:outline-neutral-300",
        "disabled:data-[state=unchecked]:bg-white disabled:data-[state=unchecked]:outline-neutral-300",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-3 w-3 rounded-full transition-transform",
          "data-[state=checked]:translate-x-[13px] data-[state=checked]:bg-white",
          "data-[state=unchecked]:translate-x-[2px] data-[state=unchecked]:bg-gray-500",
          "disabled:data-[state=checked]:bg-white",
          "disabled:data-[state=unchecked]:bg-neutral-300"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

Switch.displayName = "Switch";

export { Switch }