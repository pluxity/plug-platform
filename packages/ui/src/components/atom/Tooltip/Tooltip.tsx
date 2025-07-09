import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../../utils/utils";
import { TooltipProviderProps, TooltipContentProps, TooltipProps, TooltipTriggerProps } from "./Tooltip.types";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

TooltipProvider.displayName = "TooltipProvider";  

function Tooltip({
  ...props
}: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

Tooltip.displayName = "Tooltip";

function TooltipTrigger({
  ...props
}: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

TooltipTrigger.displayName = "TooltipTrigger";

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
                    "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                    "z-50 w-fit rounded-sm px-3 py-1.5 text-xs text-balance",
                    "data-[side=top]:origin-bottom data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left",
                    "data-[side=bottom]:slide-in-from-top-2",
                    "data-[side=left]:slide-in-from-right-2",
                    "data-[side=right]:slide-in-from-left-2",
                    "data-[side=top]:slide-in-from-bottom-2",
                    color === "primary" && "bg-primary text-primary-foreground",
                    color === "destructive" && "bg-destructive text-primary-foreground",
                    color === "muted" && "bg-muted text-muted-foreground",
                    isCustom && "border",
                    borderColor && "border",
                    className
                )}
                style={
                    isCustom
                        ? {
                            backgroundColor: bgColor,
                            color: textColor,
                            borderColor: borderColor,
                        }
                        : undefined
                }
                {...props}
            >
            {children}
                <TooltipPrimitive.Arrow
                    className={cn(
                        "z-50 size-2 translate-y-[-50%] rotate-45",
                        color === "primary" && "bg-primary fill-primary",
                        color === "destructive" && "bg-destructive fill-destructive",
                        color === "muted" && "bg-muted fill-muted",
                        isCustom && "border border-l-0 border-t-0"
                    )}
                    style={
                        isCustom
                            ? {
                                backgroundColor: bgColor,
                                fill: bgColor ?? undefined,
                                borderColor: borderColor ?? undefined,
                            }
                            : undefined
                    }
                />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
} 

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
