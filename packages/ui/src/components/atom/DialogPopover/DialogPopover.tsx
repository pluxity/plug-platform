import * as PopoverPrimitive from "@radix-ui/react-popover"
import { XIcon } from "lucide-react"
import { cn } from "../../../utils/utils";
import {
  DialogStylePopoverProps,
  DialogStylePopoverTriggerProps,
  DialogStylePopoverContentProps,
  DialogStylePopoverAnchorProps,
} from "./DialogPopover.types";

function DialogStylePopover({ ...props
}: DialogStylePopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

DialogStylePopover.displayName = "DialogStylePopover";  

function DialogStylePopoverTrigger({ ...props }: DialogStylePopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

DialogStylePopoverTrigger.displayName = "DialogStylePopoverTrigger";

function DialogStylePopoverContent({
  className,
  children,
  align = "center",
  sideOffset = 4,
  title = "테스트",
  showCloseButton = true,
  footer,
  onClose,
  ...props
}: DialogStylePopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-white rounded-[5px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-slate-300 overflow-hidden z-50 w-96",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="w-full p-4 bg-blue-50 inline-flex justify-between items-center">
          <div className="text-lg font-semibold text-black">
            {title}
          </div>
          {showCloseButton && (
            <PopoverPrimitive.Close
              className="w-6 h-6 relative cursor-pointer"
              onClick={onClose}
              data-property-1="close"
            >
              <XIcon className="text-zinc-700" />
            </PopoverPrimitive.Close>
          )}
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 flex justify-center items-center gap-4">
            {footer}
          </div>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

DialogStylePopoverContent.displayName = "DialogStylePopoverContent";

function DialogStylePopoverAnchor({ ...props }: DialogStylePopoverAnchorProps) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

DialogStylePopoverAnchor.displayName = "DialogStylePopoverAnchor";

export { 
  DialogStylePopover, 
  DialogStylePopoverTrigger, 
  DialogStylePopoverContent, 
  DialogStylePopoverAnchor 
}