import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export interface HoverCardProps extends React.ComponentProps<typeof HoverCardPrimitive.Root> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

export interface HoverCardTriggerProps extends React.ComponentProps<typeof HoverCardPrimitive.Trigger> {
  children?: React.ReactNode;
}

export interface HoverCardContentProps extends React.ComponentProps<typeof HoverCardPrimitive.Content> {
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}
