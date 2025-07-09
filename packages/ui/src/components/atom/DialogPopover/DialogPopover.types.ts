import * as PopoverPrimitive from "@radix-ui/react-popover";

export interface DialogStylePopoverProps extends React.ComponentProps<typeof PopoverPrimitive.Root> {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
}

export interface DialogStylePopoverTriggerProps extends React.ComponentProps<typeof PopoverPrimitive.Trigger> {
    asChild?: boolean;
}

export type DialogStylePopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content> & {
  title?: React.ReactNode;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export interface DialogStylePopoverAnchorProps extends React.ComponentProps<typeof PopoverPrimitive.Anchor> {
    children?: React.ReactNode;
}
