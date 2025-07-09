import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export type TooltipColor = 'primary' | 'destructive' | 'muted' | 'custom'

export interface TooltipProviderProps extends React.ComponentProps<typeof TooltipPrimitive.Provider> {
  delayDuration?: number
}

export interface TooltipProps extends React.ComponentProps<typeof TooltipPrimitive.Root> {
    children?: React.ReactNode;
}

export interface TooltipTriggerProps extends React.ComponentProps<typeof TooltipPrimitive.Trigger> {
    asChild?: boolean;
}

export interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  color?: TooltipColor;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  sideOffset?: number;
}
