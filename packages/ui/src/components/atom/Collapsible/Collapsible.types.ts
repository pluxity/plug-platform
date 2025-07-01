import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

export interface CollapsibleProps extends CollapsiblePrimitive.CollapsibleProps{
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
    className?: string;
}

export interface CollapsibleTriggerProps extends CollapsiblePrimitive.CollapsibleTriggerProps{
    children?: React.ReactNode;
    asChild?: boolean;
    className?: string;
}

export interface CollapsibleContentProps extends CollapsiblePrimitive.CollapsibleContentProps{
    children?: React.ReactNode;
    className?: string;
}


