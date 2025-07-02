import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../../utils/utils";
import { PopoverProps, PopoverTriggerProps, PopoverContentProps, PopoverAnchorProps } from "./Popover.types";

function Popover({ ...props}: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

Popover.displayName = "Popover";

function PopoverTrigger({ ...props}: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

PopoverTrigger.displayName = "PopoverTrigger";

function PopoverContent({ className, align = "center", sideOffset = 4, ...props }: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

PopoverContent.displayName = "PopoverContent";

function PopoverAnchor({ ...props }: PopoverAnchorProps) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

PopoverAnchor.displayName = "PopoverAnchor";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
