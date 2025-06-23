import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { XIcon } from "lucide-react"
import { cn } from "../../../utils/utils";

function DialogStylePopover({ ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function DialogStylePopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
interface DialogStylePopoverContentProps extends React.ComponentProps<typeof PopoverPrimitive.Content> {
  title?: React.ReactNode;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
}

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
          "bg-white text-zinc-700 rounded-[5px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-slate-400 overflow-hidden z-50 w-96",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="w-full p-5 bg-blue-50 inline-flex justify-between items-center">
          <div className="justify-start text-zinc-700 text-lg font-bold font-['SUIT']">
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

function DialogStylePopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { 
  DialogStylePopover, 
  DialogStylePopoverTrigger, 
  DialogStylePopoverContent, 
  DialogStylePopoverAnchor 
}