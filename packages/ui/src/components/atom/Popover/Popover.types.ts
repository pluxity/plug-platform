import * as PopoverPrimitive from "@radix-ui/react-popover";

export interface PopoverProps extends React.ComponentProps<typeof PopoverPrimitive.Root> {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
}

export interface PopoverTriggerProps extends React.ComponentProps<typeof PopoverPrimitive.Trigger> {
    children?: React.ReactNode;
    asChild?: boolean;
}

export interface PopoverContentProps extends React.ComponentProps<typeof PopoverPrimitive.Content> {
    align?: "start" | "center" | "end";
    sideOffset?: number;
    children?: React.ReactNode;
    className?: string;
}

export interface PopoverAnchorProps extends React.ComponentProps<typeof PopoverPrimitive.Anchor> {
    children?: React.ReactNode;
}
