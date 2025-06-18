import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../../utils/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

type TooltipColor = 'primary' | 'destructive' | 'muted' | 'custom';

interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  color?: TooltipColor;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

function TooltipContent({
                          className,
                          sideOffset = 0,
                          children,
                          color = 'primary',
                          bgColor,
                          textColor,
                          borderColor,
                          ...props
                        }: TooltipContentProps) {
  const isCustom = color === 'custom';

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          !isCustom && `bg-${color} text-primary-foreground`,
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "z-50 w-fit origin-[--radix-tooltip-content-transform-origin] rounded-md px-3 py-1.5 text-xs text-balance",
          borderColor && "border",
          className
        )}
        style={ isCustom ? { backgroundColor: bgColor, color: textColor, borderColor: borderColor } : undefined }
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className={cn(
            !isCustom && `bg-${color} fill-${color}`,
            "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
          )}
          style={isCustom ? { backgroundColor: bgColor, fill: bgColor ?? undefined } : undefined}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
